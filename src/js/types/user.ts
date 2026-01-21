import type { Role } from './role';

type User = {
  _id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  password?: string | null;
  profileImage?: string | null;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  warehouseId?: string | null;
};

export type { User };
