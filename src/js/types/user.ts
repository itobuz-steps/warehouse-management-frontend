import type { Role } from './role';

type User = {
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  name?: string | null;
  password?: string | null;
  profileImage?: string | null;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type { User };
