export const DIPLOMA_BRANCHES = [
  'Information Technology (IT)',
  'Computer Science (CS)',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Production Engineering',
  'FTTP',
  'Pharmacy',
  'MOM',
  'Architecture',
  'Other Diploma Branch',
] as const;

export type DiplomaBranch = (typeof DIPLOMA_BRANCHES)[number];

export const DIPLOMA_SEMESTERS = [1, 2, 3, 4, 5, 6] as const;
export type DiplomaSemester = (typeof DIPLOMA_SEMESTERS)[number];
