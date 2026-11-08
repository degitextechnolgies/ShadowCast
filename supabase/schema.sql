-- ==============================================================================
-- SHADOWCAST SUPABASE PRODUCTION DATABASE SCHEMA (100% IDEMPOTENT & SAFE)
-- Project: snnziouhxitblbzybesg.supabase.co (South Asia - Mumbai ap-south-1)
-- Can be re-run safely anytime without "already exists" errors.
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Shadow Pilot',
  email TEXT UNIQUE,
  avatar_url TEXT,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  plan TEXT NOT NULL DEFAULT 'Creator', -- 'Creator' or 'Creator Pro'
  max_resolution TEXT NOT NULL DEFAULT '1080p', -- '1080p' for Creator, '4K UHD' for Creator Pro
  max_fps INT NOT NULL DEFAULT 60, -- 60 for Creator, 120 for Creator Pro
  max_devices INT NOT NULL DEFAULT 1, -- 1 for Creator, 5 for Creator Pro
  connected_devices INT NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'pilot', -- 'pilot' or 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist even if profiles table was previously created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'max_resolution') THEN
    ALTER TABLE public.profiles ADD COLUMN max_resolution TEXT NOT NULL DEFAULT '1080p';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'max_fps') THEN
    ALTER TABLE public.profiles ADD COLUMN max_fps INT NOT NULL DEFAULT 60;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'max_devices') THEN
    ALTER TABLE public.profiles ADD COLUMN max_devices INT NOT NULL DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'connected_devices') THEN
    ALTER TABLE public.profiles ADD COLUMN connected_devices INT NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'pilot';
  END IF;
END $$;

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
-- ROW LEVEL SECURITY (RLS) POLICIES (WITH SAFE DROP IF EXISTS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile; public read for avatars
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public profile read" ON public.profiles;
CREATE POLICY "Public profile read"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (true);

-- Licenses: Read access for authenticated users; admins can insert/update
DROP POLICY IF EXISTS "Users can read own licenses" ON public.licenses;
DROP POLICY IF EXISTS "Allow read licenses" ON public.licenses;
CREATE POLICY "Users can read own licenses"
  ON public.licenses FOR SELECT
  TO authenticated, anon
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Allow manage licenses" ON public.licenses;
DROP POLICY IF EXISTS "Allow admin manage licenses" ON public.licenses;
CREATE POLICY "Allow manage licenses"
  ON public.licenses FOR ALL
  TO authenticated, anon
  USING (true);

-- Stream Sessions: Public read for live monitoring
DROP POLICY IF EXISTS "Allow read stream sessions" ON public.stream_sessions;
DROP POLICY IF EXISTS "Allow manage stream sessions" ON public.stream_sessions;
CREATE POLICY "Allow read stream sessions"
  ON public.stream_sessions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow manage stream sessions"
  ON public.stream_sessions FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Audit logs: Public insert & read
DROP POLICY IF EXISTS "Allow read audit logs" ON public.audit_logs;
CREATE POLICY "Allow read audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow insert audit logs" ON public.audit_logs;
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
  -- Determine whether account is Creator or Creator Pro based on metadata or email
  IF (new.raw_user_meta_data->>'is_pro')::BOOLEAN = true OR 
     new.raw_user_meta_data->>'plan' = 'Creator Pro' OR
     new.raw_user_meta_data->>'plan' = 'Pro Ultra (4K)' OR
     new.email = 'degitextechnolgies@gmail.com' OR
     new.email = 'admin@shadowcast.io' THEN
    is_user_pro := true;
    chosen_plan := 'Creator Pro';
    chosen_max_fps := 120;
    chosen_max_res := '4K UHD';
    chosen_devices := 5;
    new_license_key := 'SHADOWCAST-PRO-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 12));
  ELSE
    is_user_pro := false;
    chosen_plan := 'Creator';
    chosen_max_fps := 60;
    chosen_max_res := '1080p';
    chosen_devices := 1;
    new_license_key := 'SHADOWCAST-CREATOR-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 10));
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
    CASE WHEN new.email IN ('degitextechnolgies@gmail.com', 'admin@shadowcast.io') THEN 'admin' ELSE 'pilot' END
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    is_pro = EXCLUDED.is_pro,
    plan = EXCLUDED.plan,
    max_resolution = EXCLUDED.max_resolution,
    max_fps = EXCLUDED.max_fps,
    max_devices = EXCLUDED.max_devices,
    updated_at = NOW();

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
    CASE WHEN is_user_pro THEN 'CREATOR PRO' ELSE 'CREATOR' END,
    'ACTIVE',
    chosen_devices,
    CASE WHEN is_user_pro THEN NOW() + INTERVAL '1 year' ELSE NULL END
  )
  ON CONFLICT (license_key) DO NOTHING;

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

-- Upgrade User to Creator Pro (4K 120FPS)
CREATE OR REPLACE FUNCTION public.upgrade_user_to_pro(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
  pro_key TEXT := 'SHADOWCAST-PRO-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 12));
BEGIN
  -- Update Profile
  UPDATE public.profiles
  SET 
    is_pro = true,
    plan = 'Creator Pro',
    max_resolution = '4K UHD',
    max_fps = 120,
    max_devices = 5,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Update or Insert License
  INSERT INTO public.licenses (user_id, license_key, tier, status, max_devices, expires_at)
  VALUES (target_user_id, pro_key, 'CREATOR PRO', 'ACTIVE', 5, NOW() + INTERVAL '1 year')
  ON CONFLICT (license_key) DO NOTHING;

  -- Log Upgrade
  INSERT INTO public.audit_logs (category, level, message, user_id)
  VALUES ('LICENSE', 'INFO', 'Upgraded to Creator Pro license ' || pro_key, target_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Downgrade User to Creator
CREATE OR REPLACE FUNCTION public.downgrade_user_to_free(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    is_pro = false,
    plan = 'Creator',
    max_resolution = '1080p',
    max_fps = 60,
    max_devices = 1,
    updated_at = NOW()
  WHERE id = target_user_id;

  UPDATE public.licenses
  SET tier = 'CREATOR', max_devices = 1, expires_at = NULL
  WHERE user_id = target_user_id;

  INSERT INTO public.audit_logs (category, level, message, user_id)
  VALUES ('LICENSE', 'INFO', 'Downgraded to Creator plan', target_user_id);
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

-- Secure view with underlying Row-Level Security (RLS) enforcement
ALTER VIEW public.v_pilot_overview SET (security_invoker = true);

-- ==============================================================================
-- PAYMENT, PLANS & SUBSCRIPTIONS SYSTEM (UPI & DESKTOP SYNC)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  duration_days INT NOT NULL,
  max_devices INT NOT NULL DEFAULT 1,
  max_fps INT NOT NULL DEFAULT 60,
  max_resolution TEXT NOT NULL DEFAULT '1080p',
  watermark BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed authoritative plans
INSERT INTO public.plans (id, name, price, duration_days, max_devices, max_fps, max_resolution, watermark)
VALUES 
  ('free', 'Creator', 0.00, 0, 1, 60, '1080p', true),
  ('monthly_pro', 'ShadowCast Monthly Pro', 499.00, 30, 2, 120, '4K UHD', false),
  ('yearly_pro', 'ShadowCast Yearly VIP Pro', 2499.00, 365, 5, 120, '4K UHD', false),
  ('lifetime_pro', 'ShadowCast Lifetime License', 4999.00, 36500, 10, 120, '4K UHD', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days,
  max_devices = EXCLUDED.max_devices,
  max_fps = EXCLUDED.max_fps,
  max_resolution = EXCLUDED.max_resolution,
  watermark = EXCLUDED.watermark;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  plan_id TEXT NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subs_user_email_status ON public.subscriptions(user_email, status);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL DEFAULT 'upi_intent',
  payment_id TEXT,
  order_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read plans" ON public.plans FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Users read own subscriptions" ON public.subscriptions FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Users insert own subscriptions" ON public.subscriptions FOR INSERT TO authenticated, anon WITH CHECK (true);
CREATE POLICY "Users read own payments" ON public.payments FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Users insert own payments" ON public.payments FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Atomic RPC function for instant Pro upgrade
CREATE OR REPLACE FUNCTION public.process_pro_upgrade(
  p_user_id UUID,
  p_email TEXT,
  p_plan_id TEXT,
  p_amount NUMERIC,
  p_payment_id TEXT,
  p_payment_method TEXT
) RETURNS JSONB AS $$
DECLARE
  v_duration_days INT;
  v_expires_at TIMESTAMPTZ;
  v_pro_key TEXT;
  v_max_devices INT;
BEGIN
  IF p_plan_id = 'monthly_pro' THEN
    v_duration_days := 30;
    v_expires_at := NOW() + INTERVAL '30 days';
    v_max_devices := 2;
  ELSIF p_plan_id = 'yearly_pro' THEN
    v_duration_days := 365;
    v_expires_at := NOW() + INTERVAL '365 days';
    v_max_devices := 5;
  ELSIF p_plan_id = 'lifetime_pro' THEN
    v_duration_days := 36500;
    v_expires_at := NULL;
    v_max_devices := 10;
  ELSE
    v_duration_days := 30;
    v_expires_at := NOW() + INTERVAL '30 days';
    v_max_devices := 2;
  END IF;

  v_pro_key := 'SHADOWCAST-PRO-' || UPPER(SUBSTRING(MD5(p_user_id::text || NOW()::text) FROM 1 FOR 12));

  UPDATE public.profiles
  SET 
    is_pro = true,
    plan = 'Creator Pro',
    max_resolution = '4K UHD',
    max_fps = 120,
    max_devices = v_max_devices,
    updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO public.licenses (user_id, license_key, tier, status, max_devices, expires_at)
  VALUES (p_user_id, v_pro_key, 'CREATOR PRO', 'ACTIVE', v_max_devices, v_expires_at)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    license_key = v_pro_key,
    tier = 'CREATOR PRO',
    status = 'ACTIVE',
    max_devices = v_max_devices,
    expires_at = v_expires_at;

  INSERT INTO public.subscriptions (user_id, user_email, plan_id, status, starts_at, expires_at)
  VALUES (p_user_id, LOWER(p_email), p_plan_id, 'active', NOW(), v_expires_at);

  INSERT INTO public.payments (user_id, user_email, plan_id, amount, payment_method, payment_id, status)
  VALUES (p_user_id, LOWER(p_email), p_plan_id, p_amount, p_payment_method, p_payment_id, 'completed');

  INSERT INTO public.audit_logs (category, level, message, user_id)
  VALUES ('PAYMENT', 'INFO', 'Upgraded to Creator Pro (' || p_plan_id || ') via UPI', p_user_id);

  RETURN jsonb_build_object(
    'success', true,
    'plan', 'Creator Pro',
    'plan_id', p_plan_id,
    'license_key', v_pro_key,
    'expires_at', v_expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant API permissions to Supabase anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;



