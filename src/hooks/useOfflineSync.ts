import { useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const OFFLINE_QUEUE_KEY = "brave_offline_queue";
const OFFLINE_CACHE_KEY = "brave_offline_cache";

interface OfflineAction {
  id: string;
  table: string;
  type: "insert" | "update" | "delete";
  data: Record<string, any>;
  timestamp: number;
}

/** Returns current online status */
function isOnline() {
  return navigator.onLine;
}

/** Save key data to localStorage for offline access */
function cacheData(key: string, data: any) {
  try {
    const cache = JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || "{}");
    cache[key] = { data, cachedAt: Date.now() };
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore quota errors */ }
}

/** Get cached data */
export function getCachedData<T>(key: string): T | null {
  try {
    const cache = JSON.parse(localStorage.getItem(OFFLINE_CACHE_KEY) || "{}");
    return cache[key]?.data ?? null;
  } catch {
    return null;
  }
}

/** Queue an action for later sync */
export function queueOfflineAction(action: Omit<OfflineAction, "id" | "timestamp">) {
  const queue: OfflineAction[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  queue.push({
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

/** Process the offline queue when back online */
async function processQueue(): Promise<number> {
  const queue: OfflineAction[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  if (queue.length === 0) return 0;

  let processed = 0;
  const failed: OfflineAction[] = [];

  for (const action of queue) {
    try {
      if (action.type === "insert") {
        const { error } = await supabase.from(action.table as any).insert(action.data);
        if (error) throw error;
      } else if (action.type === "update") {
        const { id, ...rest } = action.data;
        const { error } = await supabase.from(action.table as any).update(rest).eq("id", id);
        if (error) throw error;
      } else if (action.type === "delete") {
        const { error } = await supabase.from(action.table as any).delete().eq("id", action.data.id);
        if (error) throw error;
      }
      processed++;
    } catch {
      failed.push(action);
    }
  }

  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(failed));
  return processed;
}

/** Hook that caches query data for offline use and syncs queued actions when online */
export function useOfflineSync() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const syncingRef = useRef(false);

  // Cache important query data whenever it changes
  const cacheQueryData = useCallback(() => {
    if (!user) return;
    const keys = ["wallets", "categories", "dashboard-transactions", "goals"];
    for (const key of keys) {
      const data = queryClient.getQueryData([key, user.id]);
      if (data) cacheData(`${key}_${user.id}`, data);
    }
  }, [user, queryClient]);

  // Sync queued actions when coming back online
  const syncOfflineActions = useCallback(async () => {
    if (syncingRef.current || !isOnline()) return;
    syncingRef.current = true;

    try {
      const count = await processQueue();
      if (count > 0) {
        toast.success(`${count} ação(ões) sincronizada(s)`, {
          description: "Dados offline foram enviados com sucesso",
        });
        // Invalidate all queries to refresh data
        queryClient.invalidateQueries();
      }
    } finally {
      syncingRef.current = false;
    }
  }, [queryClient]);

  useEffect(() => {
    // Cache data periodically
    const cacheInterval = setInterval(cacheQueryData, 30000);
    cacheQueryData();

    // Listen for online event
    const handleOnline = () => {
      toast.info("Conexão restaurada", { description: "Sincronizando dados..." });
      syncOfflineActions();
    };

    const handleOffline = () => {
      toast.warning("Sem conexão", {
        description: "Suas ações serão salvas e sincronizadas quando a conexão voltar",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Try to sync on mount
    if (isOnline()) syncOfflineActions();

    return () => {
      clearInterval(cacheInterval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [cacheQueryData, syncOfflineActions]);

  return { isOnline: isOnline(), queueOfflineAction, getCachedData };
}
