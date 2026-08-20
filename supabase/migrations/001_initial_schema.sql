-- ============================================================
-- SAC Student Portal — Initial Schema Migration
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- 1. Custom Enums
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'TEACHER', 'CLUB_ADMIN', 'MEMBER');
CREATE TYPE club_status AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE member_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE club_role AS ENUM ('LEAD', 'CO_LEAD', 'MEMBER');
CREATE TYPE session_status AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED');

-- 2. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contact_number TEXT,
  branch TEXT,
  semester INTEGER CHECK (semester >= 1 AND semester <= 6),
  roll_no TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'MEMBER',
  roles TEXT[] DEFAULT '{MEMBER}',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Clubs
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  branch_tags TEXT[] DEFAULT '{}',
  status club_status NOT NULL DEFAULT 'ACTIVE',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Club Members (join table)
CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role club_role NOT NULL DEFAULT 'MEMBER',
  status member_status NOT NULL DEFAULT 'PENDING',
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- 5. Sessions (attendance events)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  geofence_radius_m INTEGER DEFAULT 100,
  qr_secret TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status session_status NOT NULL DEFAULT 'SCHEDULED',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Attendance records
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_out_time TIMESTAMPTZ,
  check_in_lat DOUBLE PRECISION,
  check_in_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- 7. Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_profiles_roll_no ON profiles(roll_no);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_club_members_club ON club_members(club_id);
CREATE INDEX idx_club_members_user ON club_members(user_id);
CREATE INDEX idx_club_members_status ON club_members(status);
CREATE INDEX idx_sessions_club ON sessions(club_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Clubs
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active clubs"
  ON clubs FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE' OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  ));

CREATE POLICY "Super admins can insert clubs"
  ON clubs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  ));

CREATE POLICY "Super admins can update clubs"
  ON clubs FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  ));

-- Club Members
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own memberships"
  ON club_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM club_members cm
      WHERE cm.club_id = club_members.club_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('LEAD', 'CO_LEAD')
      AND cm.status = 'ACCEPTED'
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY "Authenticated users can request membership"
  ON club_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'PENDING');

CREATE POLICY "Club leads can update membership"
  ON club_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_members cm
      WHERE cm.club_id = club_members.club_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('LEAD', 'CO_LEAD')
      AND cm.status = 'ACCEPTED'
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- Sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view sessions of their clubs"
  ON sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_members
      WHERE club_id = sessions.club_id
      AND user_id = auth.uid()
      AND status = 'ACCEPTED'
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'CLUB_ADMIN')
    )
  );

CREATE POLICY "Club leads can create sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM club_members
      WHERE club_id = sessions.club_id
      AND user_id = auth.uid()
      AND role IN ('LEAD', 'CO_LEAD')
      AND status = 'ACCEPTED'
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY "Club leads can update sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM club_members
      WHERE club_id = sessions.club_id
      AND user_id = auth.uid()
      AND role IN ('LEAD', 'CO_LEAD')
      AND status = 'ACCEPTED'
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- Attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM sessions s
      JOIN club_members cm ON cm.club_id = s.club_id
      WHERE s.id = attendance.session_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('LEAD', 'CO_LEAD')
      AND cm.status = 'ACCEPTED'
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

CREATE POLICY "Users can insert own attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update attendance"
  ON attendance FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  ));

CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (actor_id = auth.uid());

-- ============================================================
-- Trigger: auto-create profile on auth.users insert
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role user_role := 'MEMBER';
  default_roles TEXT[] := ARRAY['MEMBER'];
BEGIN
  IF NEW.email = 'vaibhavvishwakarma0322@gmail.com' THEN
    default_role := 'SUPER_ADMIN';
    default_roles := ARRAY['SUPER_ADMIN'];
  END IF;

  INSERT INTO public.profiles (id, name, email, roll_no, contact_number, branch, semester, role, roles)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'roll_no', ''),
    COALESCE(NEW.raw_user_meta_data->>'contact_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'branch', ''),
    COALESCE((NEW.raw_user_meta_data->>'semester')::INTEGER, 1),
    default_role,
    default_roles
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Trigger: update updated_at on profiles/clubs
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER clubs_updated_at
  BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Enable Realtime for attendance (live session monitor)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE club_members;
