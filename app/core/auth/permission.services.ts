import {getUserPermissionKeysById} from "@/app/infra/repositories/user/user.repo";

export class PermissionService {
  async has(userId: string, permissionKey: string) {
    const keys = await getUserPermissionKeysById(userId);
    return keys.includes(permissionKey);
  }

  async require(userId: string, permissionKey: string) {
    const ok = await this.has(userId, permissionKey);
    if (!ok) {
      throw new Error("FORBIDDEN");
    }
  }
}
