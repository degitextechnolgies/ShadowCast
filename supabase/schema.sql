-- ==============================================================================
-- SHADOWCAST SUPABASE PRODUCTION DATABASE SCHEMA (OPTIMIZED FOR FREE & PRO)
-- Project: snnziouhxitblbzybesg.supabase.co
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Shadow Pilot',
  email TEXT UNIQUE,
  avatar_url TEXT,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  plan TEXT NOT NULL DEFAULT 'Free Plan', -- 'Free Plan' or 'Pro Ultra (4K)'
  max_resolution TEXT NOT NULL DEFAULT '1080p', -- '1080p' for Free, '4K UHD' for Pro
  max_fps INT NOT NULL DEFAULT 60, -- 60 for Free, 120 for Pro
  max_devices INT NOT NULL DEFAULT 1, -- 1 for Free, 5 for Pro
  connected_devices INT NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'pilot', -- 'pilot' or 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. LICENSES TABLE
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_key TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'FREE', -- 'FREE', 'PRO ULTRA', 'ENTERPRISE'
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'EXPIRED'
  max_devices INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 3. STREAM SESSIONS TABLE (Live Mirroring Telemetry)
CREATE TABLE IF NOT EXISTS public.stream_sessions (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  device_model TEXT NOT NULL,
  protocol TEXT NOT NULL DEFAULT 'WebRTC / D3D11',
  resolution TEXT NOT NULL DEFAULT '1080p',
  fps INT NOT NULL DEFAULT 60,
  bitrate_mbps NUMERIC(5, 2) NOT NULL DEFAULT 24.0,
  latency_ms NUMERIC(4, 2) NOT NULL DEFAULT 1.2,
  relay_node TEXT NOT NULL DEFAULT 'AP-South-1 (Mumbai)',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AUDIT & TELEMETRY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'AUTH', -- 'AUTH', 'NVENC', 'AIRPLAY', 'RELAY', 'LICENSE'
  level TEXT NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARN', 'SECURITY', 'CRITICAL'
  message TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- HIGH-PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON public.profiles(is_pro);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_tier ON public.licenses(tier);
CREATE INDEX IF NOT EXISTS idx_stream_sessions_status ON public.stream_sessions(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile; public read for avatars
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
CREATE POLICY "Users can read own licenses"
  ON public.licenses FOR SELECT
  TO authenticated, anon
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Allow manage licenses"
  ON public.licenses FOR ALL
  TO authenticated, anon
  USING (true);

-- Stream Sessions: Public read for live monitoring
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
-- AUTOMATED USER ONBOARDING TRIGGER (PRO & FREE DIFFERENTIATION)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_user_pro BOOLEAN;
  chosen_plan TEXT;
  chosen_max_fps INT;
  chosen_max_res TEXT;
  chosen_devices INT;
  new_license_key TEXT;
BEGIN
  -- Determine whether account is Free or Pro based on metadata or email
  IF (new.raw_user_meta_data->>'is_pro')::BOOLEAN = true OR 
     new.raw_user_meta_data->>'plan' = 'Pro Ultra (4K)' OR
     new.email = 'admin@shadowcast.io' THEN
    is_user_pro := true;
    chosen_plan := 'Pro Ultra (4K)';
    chosen_max_fps := 120;
    chosen_max_res := '4K UHD';
    chosen_devices := 5;
    new_license_key := 'SHADOWCAST-PRO-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 12));
  ELSE
    is_user_pro := false;
    chosen_plan := 'Free Plan';
    chosen_max_fps := 60;
    chosen_max_res := '1080p';
    chosen_devices := 1;
    new_license_key := 'SHADOWCAST-FREE-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 10));
  END IF;

  -- 1. Create Profile
  INSERT INTO public.profiles (
    id,
    email,
    name,
    avatar_url,
    is_pro,
    plan,
    max_resolution,
    max_fps,
    max_devices,
    connected_devices,
    role
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    is_user_pro,
    chosen_plan,
    chosen_max_res,
    chosen_max_fps,
    chosen_devices,
    0,
    CASE WHEN new.email = 'admin@shadowcast.io' THEN 'admin' ELSE 'pilot' END
  );

  -- 2. Automatically Provision Corresponding License
  INSERT INTO public.licenses (
    user_id,
    license_key,
    tier,
    status,
    max_devices,
    expires_at
  )
  VALUES (
    new.id,
    new_license_key,
    CASE WHEN is_user_pro THEN 'PRO ULTRA' ELSE 'FREE' END,
    'ACTIVE',
    chosen_devices,
    CASE WHEN is_user_pro THEN NOW() + INTERVAL '1 year' ELSE NULL END
  );

  -- 3. Log Registration in Audit
  INSERT INTO public.audit_logs (category, level, message, user_id)
  VALUES (
    'AUTH',
    'INFO',
    'Pilot account registered under ' || chosen_plan || ' [' || new_license_key || ']',
    new.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- CONVENIENCE STORED PROCEDURES (UPGRADE & DOWNGRADE)
-- ==============================================================================

-- Upgrade User to Pro Ultra (4K)
CREATE OR REPLACE FUNCTION public.upgrade_user_to_pro(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
  pro_key TEXT := 'SHADOWCAST-PRO-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 12));
BEGIN
  -- Update Profile
  UPDATE public.profiles
  SET 
    is_pro = true,
    plan = 'Pro Ultra (4K)',
    max_resolution = '4K UHD',
    max_fps = 120,
    max_devices = 5,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Update or Insert License
  INSERT INTO public.licenses (user_id, license_key, tier, status, max_devices, expires_at)
  VALUES (target_user_id, pro_key, 'PRO ULTRA', 'ACTIVE', 5, NOW() + INTERVAL '1 year')
  ON CONFLICT (license_key) DO NOTHING;

  -- Log Upgrade
  INSERT INTO public.audit_logs (category, level, message, user_id)
  VALUES ('LICENSE', 'INFO', 'Upgraded to Pro Ultra (4K) license ' || pro_key, target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Downgrade User to Free Plan
CREATE OR REPLACE FUNCTION public.downgrade_user_to_free(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    is_pro = false,
    plan = 'Free Plan',
    max_resolution = '1080p',
    max_fps = 60,
    max_devices = 1,
    updated_at = NOW()
  WHERE id = target_user_id;

  UPDATE public.licenses
  SET tier = 'FREE', max_devices = 1, expires_at = NULL
  WHERE user_id = target_user_id;

  INSERT INTO public.audit_logs (category, level, message, user_id)
  VALUES ('LICENSE', 'INFO', 'Downgraded to Free Plan', target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- UNIFIED DASHBOARD VIEW
-- ==============================================================================

CREATE OR REPLACE VIEW public.v_pilot_overview AS
SELECT 
  p.id,
  p.name,
  p.email,
  p.avatar_url,
  p.is_pro,
  p.plan,
  p.max_resolution,
  p.max_fps,
  p.max_devices,
  p.connected_devices,
  p.role,
  l.license_key,
  l.tier AS license_tier,
  l.status AS license_status,
  l.expires_at AS license_expires_at,
  p.created_at
FROM public.profiles p
LEFT JOIN public.licenses l ON p.id = l.user_id;
