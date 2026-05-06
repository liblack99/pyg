// app/lib/auth.types.ts
export type Me = {
  id: string;
  name: string | null;
  email: string;
  role: string; // "ADMIN" | "SALES" | "VIEWER" (lo dejamos flexible)
  permissions: string[];
};

export function can(me: Me | null | undefined, permission: string): boolean {
  console.log("permiso", permission);
  if (!me) return false;
  return Array.isArray(me.permissions) && me.permissions.includes(permission);
}
