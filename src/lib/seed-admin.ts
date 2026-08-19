import type { Profile, UserRole } from './types';

export interface AuditEntry {
  id: string;
  actor_name: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_name: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const SEED_USERS: Profile[] = [
  {
    id: 'u1111111-1111-1111-1111-111111111111',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@svpoly.edu.in',
    roll_no: '2024CS101',
    contact_number: '+91 98765 43210',
    branch: 'Computer Engineering',
    semester: 4,
    role: 'SUPER_ADMIN' as UserRole,
    avatar_url: null,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u2222222-2222-2222-2222-222222222222',
    name: 'Priya Patel',
    email: 'priya.patel@svpoly.edu.in',
    roll_no: '2024IT204',
    contact_number: '+91 98765 43211',
    branch: 'IT',
    semester: 4,
    role: 'CLUB_ADMIN' as UserRole,
    avatar_url: null,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u3333333-3333-3333-3333-333333333333',
    name: 'Rohan Verma',
    email: 'rohan.verma@svpoly.edu.in',
    roll_no: '2024EC305',
    contact_number: '+91 98765 43212',
    branch: 'Electronics & Communication',
    semester: 3,
    role: 'CLUB_ADMIN' as UserRole,
    avatar_url: null,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u4444444-4444-4444-4444-444444444444',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@svpoly.edu.in',
    roll_no: '2024ME412',
    contact_number: '+91 98765 43213',
    branch: 'Mechanical Engineering',
    semester: 2,
    role: 'MEMBER' as UserRole,
    avatar_url: null,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u5555555-5555-5555-5555-555555555555',
    name: 'Kavita Singh',
    email: 'kavita.singh@svpoly.edu.in',
    roll_no: '2024CE501',
    contact_number: '+91 98765 43214',
    branch: 'Civil Engineering',
    semester: 5,
    role: 'MEMBER' as UserRole,
    avatar_url: null,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'u6666666-6666-6666-6666-666666666666',
    name: 'Devansh Joshi',
    email: 'devansh.joshi@svpoly.edu.in',
    roll_no: '2024CH602',
    contact_number: '+91 98765 43215',
    branch: 'Chemical Engineering',
    semester: 1,
    role: 'MEMBER' as UserRole,
    avatar_url: null,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    actor_name: 'Aarav Sharma',
    actor_email: 'aarav.sharma@svpoly.edu.in',
    action: 'CREATE_CLUB',
    target_type: 'CLUB',
    target_name: 'CodeCraft Society',
    metadata: { branch_tags: ['Computer Engineering', 'IT'], status: 'ACTIVE' },
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    actor_name: 'Aarav Sharma',
    actor_email: 'aarav.sharma@svpoly.edu.in',
    action: 'ELEVATE_ROLE',
    target_type: 'USER',
    target_name: 'Priya Patel (2024IT204)',
    metadata: { previous_role: 'MEMBER', new_role: 'CLUB_ADMIN', club: 'CodeCraft Society' },
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    actor_name: 'Priya Patel',
    actor_email: 'priya.patel@svpoly.edu.in',
    action: 'ACCEPT_MEMBER',
    target_type: 'MEMBERSHIP',
    target_name: 'Ananya Gupta (2024ME412)',
    metadata: { club: 'CodeCraft Society', status: 'ACCEPTED' },
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    actor_name: 'Rohan Verma',
    actor_email: 'rohan.verma@svpoly.edu.in',
    action: 'CREATE_SESSION',
    target_type: 'SESSION',
    target_name: 'Robotics Guild: Autonomous Rover Calibration',
    metadata: { geofence_radius_m: 150, lat: 28.7041, lng: 77.1025 },
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    actor_name: 'Aarav Sharma',
    actor_email: 'aarav.sharma@svpoly.edu.in',
    action: 'ARCHIVE_CLUB',
    target_type: 'CLUB',
    target_name: 'Legacy Aero Club',
    metadata: { reason: 'Annual reorganization and transition to Robotics Guild' },
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];
