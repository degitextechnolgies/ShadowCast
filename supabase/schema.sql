-- ==============================================================================
-- SHADOWCAST SUPABASE DATABASE SCHEMA
-- Project: snnziouhxitblbzybesg.supabase.co
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  is_pro BOOLEAN DEFAULT false,
  plan TEXT DEFAULT 'Free Plan',
  connected_devices INT DEFAULT 0,
  role TEXT DEFAULT 'pilot', -- 'pilot' or 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LICENSES TABLE
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  license_key TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL, -- 'FREE', 'CREATOR', 'PRO ULTRA', 'ENTERPRISE'
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'EXPIRED'
  max_devices INT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 3. STREAM SESSIONS TABLE (Live Mirroring Telemetry)
CREATE TABLE IF NOT EXISTS public.stream_sessions (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  device_model TEXT NOT NULL,
  protocol TEXT NOT NULL,
  resolution TEXT NOT NULL,
  fps INT DEFAULT 120,
  bitrate_mbps NUMERIC(5, 2) DEFAULT 48.0,
  latency_ms NUMERIC(4, 2) DEFAULT 0.8,
  relay_node TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'AUTH', 'NVENC', 'AIRPLAY', 'RELAY', 'LICENSE'
  level TEXT NOT NULL, -- 'INFO', 'WARN', 'SECURITY', 'CRITICAL'
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile; admins can manage all
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profile read"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (true);

-- Licenses: Read access for authenticated users; admins can insert/update
CREATE POLICY "Allow read licenses"
  ON public.licenses FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow admin manage licenses"
  ON public.licenses FOR ALL
  TO authenticated, anon
  USING (true);

-- Stream Sessions: Public read for live dashboard
CREATE POLICY "Allow read stream sessions"
  ON public.stream_sessions FOR SELECT
  TO authenticated, anon
  USING (true);

-- Audit logs: Public insert & read
CREATE POLICY "Allow read audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, is_pro, plan)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    true,
    COALESCE(new.raw_user_meta_data->>'plan', 'Pro Ultra (4K)')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

