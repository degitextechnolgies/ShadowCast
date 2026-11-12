-- Migration: 20261108_create_subscriptions_and_payments.sql
-- ShadowCast Payments, UPI Transactions & Desktop Subscription Sync

-- 1. Create Plans Table
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

-- Seed authoritative tiers
INSERT INTO public.plans (id, name, price, duration_days, max_devices, max_fps, max_resolution, watermark)
VALUES 
  ('free', 'Creator', 0.00, 0, 1, 60, '1080p', true),
  ('monthly_pro', 'ShadowCast Monthly Pro', 70.00, 30, 2, 120, '4K UHD', false),
  ('yearly_pro', 'ShadowCast Yearly VIP Pro', 840.00, 365, 5, 120, '4K UHD', false),
  ('lifetime_pro', 'ShadowCast Lifetime License', 1999.00, 36500, 10, 120, '4K UHD', false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days,
  max_devices = EXCLUDED.max_devices,
  max_fps = EXCLUDED.max_fps,
  max_resolution = EXCLUDED.max_resolution,
  watermark = EXCLUDED.watermark;

-- 2. Create Subscriptions Table (Read by Desktop App ShadowCast.exe)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  plan_id TEXT NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
  license_key TEXT,
  max_devices INT DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS license_key TEXT;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS max_devices INT DEFAULT 2;

CREATE INDEX IF NOT EXISTS idx_subs_user_email_status ON public.subscriptions(user_email, status);

-- 3. Create Payments Audit Table
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

-- 4. Enable Row-Level Security
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read plans" ON public.plans;
CREATE POLICY "Public read plans" ON public.plans FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users read own subscriptions" ON public.subscriptions;
CREATE POLICY "Users read own subscriptions" ON public.subscriptions FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users insert own subscriptions" ON public.subscriptions FOR INSERT TO authenticated, anon WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own payments" ON public.payments;
CREATE POLICY "Users read own payments" ON public.payments FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users insert own payments" ON public.payments;
CREATE POLICY "Users insert own payments" ON public.payments FOR INSERT TO authenticated, anon WITH CHECK (true);

-- 5. Atomic RPC Function for Pro Upgrade
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

-- 6. Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;
