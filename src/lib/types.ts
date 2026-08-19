// ============================================================
// SAC Student Portal — Shared Types
// ============================================================

export type UserRole = 'SUPER_ADMIN' | 'CLUB_ADMIN' | 'MEMBER';
export type ClubStatus = 'ACTIVE' | 'ARCHIVED';
export type MemberStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type ClubRole = 'LEAD' | 'CO_LEAD' | 'MEMBER';
export type SessionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED';
export type ThemeId = 'midnight' | 'lumina' | 'emerald' | 'amber';

export interface Profile {
  id: string;
  name: string;
  email: string;
  contact_number: string | null;
  branch: string | null;
  semester: number | null;
  roll_no: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  branch_tags: string[];
  status: ClubStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: ClubRole;
  status: MemberStatus;
  joined_at: string | null;
  created_at: string;
  // Joined fields
  profiles?: Profile;
  clubs?: Club;
}

export interface Session {
  id: string;
  club_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  lat: number | null;
  lng: number | null;
  geofence_radius_m: number;
  qr_secret: string;
  status: SessionStatus;
  created_by: string | null;
  created_at: string;
  // Joined fields
  clubs?: Club;
}

export interface Attendance {
  id: string;
  session_id: string;
  user_id: string;
  check_in_time: string;
  check_out_time: string | null;
  check_in_lat: number | null;
  check_in_lng: number | null;
  created_at: string;
  // Joined fields
  profiles?: Profile;
  sessions?: Session;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  // Joined
  profiles?: Profile;
}

export interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}
