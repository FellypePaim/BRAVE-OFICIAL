import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Repeat, Plus, X, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  description: string;
  amount: number;
  categoryId: string | null;
  categoryName: string;
  count: number;
  avgDay: number;
}

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function RecurrenceSuggestions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState<string | null>(null);

  // Get last 3 months of transactions
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const startDate = threeMonthsAgo.toISOString().slice(0, 10);

  const { data: transactions = [] } = useQuery({
    queryKey: ["recurrence-analysis", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("description, amount, category_id, date, type, categories(name)")
        .eq("type", "expense")
        .gte("date", startDate)
        .order("date");
      return data || [];
    },
    enabled: !!user,
  });

  const { data: existingRecurring = [] } = useQuery({
    queryKey: ["existing-recurring", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("recurring_transactions")
        .select("description")
        .eq("is_active", true);
      return data || [];
    },
    enabled: !!user,
  });

  const suggestions = useMemo<Suggestion[]>(() => {
    const existingDescs = new Set(existingRecurring.map(r => r.description?.toLowerCase()));

    // Group by normalized description
    const groups: Record<string, { amounts: number[]; days: number[]; categoryId: string | null; categoryName: string }> = {};

    transactions.forEach((t: any) => {
      const key = (t.description || "").toLowerCase().trim();
      if (!key || key.length < 3) return;
      if (!groups[key]) {
        groups[key] = { amounts: [], days: [], categoryId: t.category_id, categoryName: t.categories?.name || "Sem categoria" };
      }
      groups[key].amounts.push(Number(t.amount));
      groups[key].days.push(new Date(t.date).getDate());
    });

    const results: Suggestion[] = [];
    for (const [desc, data] of Object.entries(groups)) {
      // Need at least 2 occurrences to suggest
      if (data.amounts.length < 2) continue;
      // Skip if already a recurring transaction
      if (existingDescs.has(desc)) continue;

      // Check if amounts are similar (within 20% variance)
      const avgAmount = data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;
      const variance = data.amounts.every(a => Math.abs(a - avgAmount) / avgAmount < 0.2);
      if (!variance) continue;

      const avgDay = Math.round(data.days.reduce((a, b) => a + b, 0) / data.days.length);

      results.push({
        description: desc.charAt(0).toUpperCase() + desc.slice(1),
        amount: Math.round(avgAmount * 100) / 100,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        count: data.amounts.length,
        avgDay,
      });
    }

    return results.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [transactions, existingRecurring]);

  const handleCreate = async (s: Suggestion) => {
    if (!user) return;
    setCreating(s.description);
    try {
      const { error } = await supabase.from("recurring_transactions").insert({
        user_id: user.id,
        description: s.description,
        amount: s.amount,
        category_id: s.categoryId,
        type: "expense",
        day_of_month: s.avgDay,
        is_active: true,
      });
      if (error) throw error;
      toast({ title: "Recorrência criada!", description: `${s.description} será registrada todo dia ${s.avgDay}` });
      queryClient.invalidateQueries({ queryKey: ["existing-recurring"] });
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
    } catch {
      toast({ title: "Erro ao criar recorrência", variant: "destructive" });
    }
    setCreating(null);
  };

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.description));

  if (visibleSuggestions.length === 0) return null;

  return (
    <Card className="p-4 md:p-5 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Gastos Recorrentes Detectados</h3>
          <p className="text-xs text-muted-foreground">Sugestões baseadas nos seus últimos 3 meses</p>
        </div>
      </div>

      <div className="space-y-2">
        {visibleSuggestions.map((s) => (
          <div key={s.description} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Repeat className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{s.description}</p>
              <p className="text-xs text-muted-foreground">
                {fmt(s.amount)} · ~dia {s.avgDay} · {s.count}x nos últimos 3 meses · {s.categoryName}
              </p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setDismissed(prev => new Set(prev).add(s.description))}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                className="h-8 rounded-full gap-1 text-xs px-3"
                disabled={creating === s.description}
                onClick={() => handleCreate(s)}
              >
                {creating === s.description ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Criar
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
