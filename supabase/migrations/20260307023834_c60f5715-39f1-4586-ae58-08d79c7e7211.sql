CREATE POLICY "No direct user access to rate limits"
  ON public.whatsapp_rate_limits FOR ALL
  USING (false);