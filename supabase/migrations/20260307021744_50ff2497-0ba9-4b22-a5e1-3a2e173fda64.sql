CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions (user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_due_date ON public.transactions (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_recurring ON public.transactions (user_id, recurring_id);