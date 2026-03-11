import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook that subscribes to Supabase Realtime for:
 * 1. New transactions → check budget overruns
 * 2. Bills approaching due date (checked on mount + interval)
 */
export function useRealtimeNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const checkedRef = useRef(false);

  // Check for overdue/upcoming bills
  const checkBills = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);
    const in3days = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

    // Overdue bills
    const { data: overdue } = await supabase
      .from("transactions")
      .select("id, description, amount, due_date")
      .eq("is_paid", false)
      .lt("due_date", today)
      .limit(5);

    if (overdue && overdue.length > 0) {
      toast.error(`🔴 ${overdue.length} conta(s) vencida(s)!`, {
        description: overdue.slice(0, 2).map(b => b.description).join(", "),
        duration: 8000,
        action: {
          label: "Ver contas",
          onClick: () => window.location.href = "/dashboard/bills",
        },
      });
    }

    // Bills due in 3 days
    const { data: upcoming } = await supabase
      .from("transactions")
      .select("id, description, amount, due_date")
      .eq("is_paid", false)
      .gte("due_date", today)
      .lte("due_date", in3days)
      .limit(5);

    if (upcoming && upcoming.length > 0) {
      toast.warning(`⚠️ ${upcoming.length} conta(s) vencem em breve`, {
        description: upcoming.slice(0, 2).map(b => `${b.description} - ${new Date(b.due_date!).toLocaleDateString("pt-BR")}`).join(", "),
        duration: 6000,
        action: {
          label: "Ver",
          onClick: () => window.location.href = "/dashboard/bills",
        },
      });
    }
  }, [user]);

  // Check budget overruns for a category
  const checkBudgetOverrun = useCallback(async (categoryId: string) => {
    if (!user || !categoryId) return;

    const { data: category } = await supabase
      .from("categories")
      .select("name, budget_limit")
      .eq("id", categoryId)
      .single();

    if (!category?.budget_limit) return;

    const monthStart = new Date();
    monthStart.setDate(1);
    const startDate = monthStart.toISOString().slice(0, 10);

    const { data: txs } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "expense")
      .eq("category_id", categoryId)
      .gte("date", startDate);

    const spent = (txs || []).reduce((s, t) => s + Number(t.amount), 0);
    const pct = (spent / Number(category.budget_limit)) * 100;

    if (pct >= 100) {
      toast.error(`🚨 Orçamento estourado: ${category.name}`, {
        description: `Gasto: R$ ${spent.toFixed(2)} / Limite: R$ ${Number(category.budget_limit).toFixed(2)}`,
        duration: 8000,
      });
    } else if (pct >= 80) {
      toast.warning(`⚠️ ${category.name}: ${pct.toFixed(0)}% do orçamento`, {
        description: `R$ ${spent.toFixed(2)} de R$ ${Number(category.budget_limit).toFixed(2)}`,
        duration: 5000,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Check bills on mount (once)
    if (!checkedRef.current) {
      checkedRef.current = true;
      // Delay to not overwhelm the user on login
      setTimeout(checkBills, 3000);
    }

    // Check bills every 30 minutes
    const billInterval = setInterval(checkBills, 30 * 60 * 1000);

    // Subscribe to new transactions via Realtime
    const channel = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newTx = payload.new as any;
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["dashboard-transactions"] });
          queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
          queryClient.invalidateQueries({ queryKey: ["wallets"] });
          queryClient.invalidateQueries({ queryKey: ["bills-transactions"] });

          // Check budget if category is set
          if (newTx.category_id && newTx.type === "expense") {
            checkBudgetOverrun(newTx.category_id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-transactions"] });
          queryClient.invalidateQueries({ queryKey: ["bills-transactions"] });
        }
      )
      .subscribe();

    return () => {
      clearInterval(billInterval);
      supabase.removeChannel(channel);
    };
  }, [user, checkBills, checkBudgetOverrun, queryClient]);
}
