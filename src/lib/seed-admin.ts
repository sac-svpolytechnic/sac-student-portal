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
    name: 'Vaibhav Vishwakarma',
    email: 'vaibhavvishwakarma0322@gmail.com',
    roll_no: '2024CS101',
    contact_number: '+91 98765 43210',
    branch: 'Computer Science (CS)',
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

export const SEED_AUDIT_LOGS: AuditEntry[] = [];
