-- Add new columns to performance_log table
ALTER TABLE performance_log
  ADD COLUMN IF NOT EXISTS hero_item TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS close_type TEXT DEFAULT 'comment_bait',
  ADD COLUMN IF NOT EXISTS template_used TEXT DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS logistics_in_voiceover BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS payload_timing NUMERIC DEFAULT 0;
