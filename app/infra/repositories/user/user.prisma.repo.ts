import {prisma} from "@/app/lib/prisma";
import type {UserRepoPort} from "@/app/core/users/port/user.repo.port";

export const userRepo: UserRepoPort = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {id},
      include: {
        role: true,
      },
    });
  },
  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        role: {select: {id: true, name: true}},
      },
      orderBy: {createdAt: "desc"},
    });
  },

  async create(input) {
    return prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        roleId: input.roleId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        role: {select: {id: true, name: true}},
      },
    });
  },

  async update(id, input) {
    return prisma.user.update({
      where: {id},
      data: {
        ...(input.name ? {name: input.name} : {}),
        ...(input.roleId ? {roleId: input.roleId} : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        role: {select: {id: true, name: true}},
      },
    });
  },

  async delete(id) {
    await prisma.user.delete({where: {id}});
  },

  async findByEmailWithPerms(email) {
    const u = await prisma.user.findUnique({
      where: {email},
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: {
          select: {
            name: true,
            permissions: {select: {permission: {select: {key: true}}}},
          },
        },
      },
    });
    if (!u) return null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.passwordHash,
      role: {
        name: u.role.name,
        permissions: u.role.permissions.map((rp) => rp.permission.key),
      },
    };
  },
  async findByIdWithPerms(id: string) {
    const user = await prisma.user.findUnique({
      where: {id},
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: {
        name: user.role.name,
        permissions: user.role.permissions.map((rp) => rp.permission.key),
      },
    };
  },

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: {id},
      data: {lastLoginAt: new Date()},
    });
  },
};
