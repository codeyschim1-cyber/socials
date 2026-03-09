-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- PROFILES (extends Supabase auth.users)
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text default '',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- ANALYTICS ENTRIES
-- ==========================================
create table public.analytics_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  platform text not null,
  date text not null,
  followers integer default 0,
  following integer default 0,
  posts_count integer default 0,
  likes integer default 0,
  comments integer default 0,
  shares integer default 0,
  views integer default 0,
  engagement_rate numeric,
  reach integer,
  impressions integer,
  created_at timestamptz default now()
);

alter table public.analytics_entries enable row level security;
create policy "Users manage own analytics" on public.analytics_entries for all using (auth.uid() = user_id);

-- ==========================================
-- BRAND DEALS
-- ==========================================
create table public.brand_deals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  brand_name text not null,
  contact_name text,
  contact_email text,
  platform text not null,
  status text not null default 'outreach',
  deliverables text default '',
  rate numeric default 0,
  currency text default 'USD',
  deadline text,
  notes text default '',
  results jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.brand_deals enable row level security;
create policy "Users manage own deals" on public.brand_deals for all using (auth.uid() = user_id);

-- ==========================================
-- CALENDAR POSTS
-- ==========================================
create table public.calendar_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text default '',
  platform text not null,
  status text not null default 'idea',
  scheduled_date text not null,
  scheduled_time text,
  tags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.calendar_posts enable row level security;
create policy "Users manage own posts" on public.calendar_posts for all using (auth.uid() = user_id);

-- ==========================================
-- CONTENT IDEAS
-- ==========================================
create table public.content_ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text default '',
  category text not null default 'evergreen',
  platform text not null default 'all',
  pillar_id text,
  tags text[] default '{}',
  is_favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.content_ideas enable row level security;
create policy "Users manage own ideas" on public.content_ideas for all using (auth.uid() = user_id);

-- ==========================================
-- BOARD CONTENT (Kanban)
-- ==========================================
create table public.board_content (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  status text not null default 'idea',
  platform text not null default 'all',
  project text default '',
  tags text[] default '{}',
  scheduled_date text,
  caption text default '',
  hashtags text[] default '{}',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.board_content enable row level security;
create policy "Users manage own board" on public.board_content for all using (auth.uid() = user_id);

-- ==========================================
-- INCOME ENTRIES
-- ==========================================
create table public.income_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  source text not null,
  amount numeric default 0,
  currency text default 'USD',
  date text not null,
  category text not null default 'sponsorship',
  deal_id text,
  notes text default '',
  created_at timestamptz default now()
);

alter table public.income_entries enable row level security;
create policy "Users manage own income" on public.income_entries for all using (auth.uid() = user_id);

-- ==========================================
-- INCOME GOALS
-- ==========================================
create table public.income_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  period text not null default 'monthly',
  target_amount numeric default 0,
  currency text default 'USD',
  year integer not null,
  month integer,
  created_at timestamptz default now()
);

alter table public.income_goals enable row level security;
create policy "Users manage own goals" on public.income_goals for all using (auth.uid() = user_id);

-- ==========================================
-- MEDIA KIT
-- ==========================================
create table public.media_kit (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  display_name text default '',
  bio text default '',
  niche text[] default '{}',
  instagram_handle text default '',
  tiktok_handle text default '',
  youtube_handle text default '',
  facebook_handle text default '',
  instagram_followers integer default 0,
  tiktok_followers integer default 0,
  youtube_subscribers integer default 0,
  facebook_followers integer default 0,
  instagram_engagement_rate numeric default 0,
  tiktok_engagement_rate numeric default 0,
  youtube_engagement_rate numeric default 0,
  facebook_engagement_rate numeric default 0,
  email text default '',
  website text,
  location text,
  rates jsonb default '{}',
  demographics text,
  past_brands text[] default '{}',
  inspiration_creators jsonb default '[]',
  updated_at timestamptz default now()
);

alter table public.media_kit enable row level security;
create policy "Users manage own media kit" on public.media_kit for all using (auth.uid() = user_id);

-- ==========================================
-- CONTENT LIBRARY
-- ==========================================
create table public.content_library (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text,
  platform text not null,
  type text not null default 'post',
  notes text default '',
  performance text,
  created_at timestamptz default now()
);

alter table public.content_library enable row level security;
create policy "Users manage own library" on public.content_library for all using (auth.uid() = user_id);

-- ==========================================
-- HASHTAG SETS
-- ==========================================
create table public.hashtag_sets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  hashtags text[] default '{}',
  platform text not null default 'all',
  created_at timestamptz default now()
);

alter table public.hashtag_sets enable row level security;
create policy "Users manage own hashtags" on public.hashtag_sets for all using (auth.uid() = user_id);

-- ==========================================
-- CAPTION TEMPLATES
-- ==========================================
create table public.caption_templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  template text default '',
  category text default '',
  platform text not null default 'all',
  created_at timestamptz default now()
);

alter table public.caption_templates enable row level security;
create policy "Users manage own captions" on public.caption_templates for all using (auth.uid() = user_id);

-- ==========================================
-- TRENDING TOPICS
-- ==========================================
create table public.trending_topics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic text not null,
  platform text not null default 'all',
  notes text default '',
  date_spotted text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.trending_topics enable row level security;
create policy "Users manage own topics" on public.trending_topics for all using (auth.uid() = user_id);

-- ==========================================
-- CONTENT PILLARS
-- ==========================================
create table public.content_pillars (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text default '',
  color text default '#8b5cf6',
  created_at timestamptz default now()
);

alter table public.content_pillars enable row level security;
create policy "Users manage own pillars" on public.content_pillars for all using (auth.uid() = user_id);

-- ==========================================
-- SWIPE FILE
-- ==========================================
create table public.swipe_file (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  source_url text,
  notes text default '',
  platform text not null default 'all',
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table public.swipe_file enable row level security;
create policy "Users manage own swipe file" on public.swipe_file for all using (auth.uid() = user_id);

-- ==========================================
-- CUSTOM EVENTS (user-added calendar events)
-- ==========================================
create table public.custom_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text default '',
  location text default '',
  state text default '',
  url text,
  time text,
  dates text[] default '{}',
  created_at timestamptz default now()
);

alter table public.custom_events enable row level security;
create policy "Users manage own events" on public.custom_events for all using (auth.uid() = user_id);

-- ==========================================
-- ATTENDED EVENTS
-- ==========================================
create table public.attended_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  event_id text not null,
  created_at timestamptz default now()
);

alter table public.attended_events enable row level security;
create policy "Users manage own attended" on public.attended_events for all using (auth.uid() = user_id);

-- ==========================================
-- USER SETTINGS (API key, last auto search, etc.)
-- ==========================================
create table public.user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade unique not null,
  api_key text default '',
  last_auto_search text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_settings enable row level security;
create policy "Users manage own settings" on public.user_settings for all using (auth.uid() = user_id);
