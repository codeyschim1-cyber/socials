-- Performance Log table
CREATE TABLE IF NOT EXISTS performance_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  format_type TEXT NOT NULL DEFAULT 'reel',
  hook_type TEXT NOT NULL DEFAULT 'bold_statement',
  key_item TEXT DEFAULT '',
  price_point TEXT DEFAULT '',
  location TEXT DEFAULT '',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  viral BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE performance_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own performance_log"
  ON performance_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Store Log table
CREATE TABLE IF NOT EXISTS store_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'thrift',
  location TEXT DEFAULT '',
  state TEXT DEFAULT '',
  date_visited DATE NOT NULL,
  rating INTEGER DEFAULT 3,
  known_for TEXT DEFAULT '',
  best_sections TEXT DEFAULT '',
  price_range TEXT DEFAULT 'moderate',
  worth_returning BOOLEAN DEFAULT true,
  content_made TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE store_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own store_log"
  ON store_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
