export type RoleRef = {
  id: string;
  name: string;
};

export type UserWithRole = {
  id: string;
  email: string;
  name: string;
  role: RoleRef;
  createdAt: Date;
  isActive: boolean;
  lastLoginAt: Date | null;
};
export type MeWithPerms = {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  role: {name: string; permissions: string[]};
};
export type UserListItem = {
  id: string;
  email: string;
  name: string;
  role: RoleRef;
  createdAt: Date;
  isActive: boolean;
  lastLoginAt: Date | null;
};

export type DefaultsEditUserValues = {
  name: string | null;
  email: string | null;
  roleId: string;
};
