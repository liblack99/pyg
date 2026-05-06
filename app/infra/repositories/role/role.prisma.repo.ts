import {prisma} from "@/app/lib/prisma";
import type {RoleRepoPort} from "@/app/core/users/port/role.repo.port";

export const roleRepo: RoleRepoPort = {
  async list() {
    return prisma.role.findMany({
      select: {id: true, name: true},
      orderBy: {name: "asc"},
    });
  },
};
