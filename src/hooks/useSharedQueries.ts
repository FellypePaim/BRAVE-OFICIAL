import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/** Shared hook for categories — uses consistent cache key ["categories", userId] */
export function useCategories() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["categories", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user!.id)
        .order("name");
      return data || [];
    },
    enabled: !!user,
  });
}

/** Shared hook for wallets — uses consistent cache key ["wallets", userId] */
export function useWallets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wallets", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });
}
