import {prisma} from "@/app/lib/prisma";

export async function getUserWithPermissionsByEmail(email: string) {
  return prisma.user.findUnique({
    where: {email},
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          name: true,
          permissions: {
            select: {permission: {select: {key: true}}},
          },
        },
      },
    },
  });
}

export async function getUserPermissionKeysById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      role: {
        select: {
          permissions: {
            select: {permission: {select: {key: true}}},
          },
        },
      },
    },
  });

  if (!user) return [];
  return user.role.permissions.map((rp) => rp.permission.key);
}
