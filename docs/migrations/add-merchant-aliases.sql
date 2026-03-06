-- Merchant aliases: map raw merchant names to display names
-- Run in Supabase SQL Editor: docs/migrations/add-merchant-aliases.sql
CREATE TABLE IF NOT EXISTS merchant_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  original_merchant text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, original_merchant)
);

CREATE INDEX IF NOT EXISTS idx_merchant_aliases_user ON merchant_aliases(user_id);

ALTER TABLE merchant_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user owns merchant aliases"
ON merchant_aliases FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
