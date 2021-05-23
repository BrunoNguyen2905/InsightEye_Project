import { PEMISSION_MAP } from "./permissionMap";

export enum UserLibRole {
  Owner = "Owner",
  BaseUser = "BaseUser",
  VideoUser = "VideoUser",
  Supervisor = "Supervisor",
  Admin = "Admin"
}

export enum UserLibRoleText {
  Owner = "Owner",
  BaseUser = "Base User",
  VideoUser = "Video User",
  Supervisor = "Supervisor",
  Admin = "Admin"
}

type RoleAction = (role: UserLibRole) => boolean;
type RoleActionUser = (role: UserLibRole, userRole: UserLibRole) => boolean;

export interface IRoleMap {
  [key: string]: RoleAction | RoleActionUser;
}

type Perrmisions = keyof typeof PEMISSION_MAP;

export const allow = (
  permision: Perrmisions,
  role: UserLibRole,
  targetRole?: UserLibRole
): boolean => {
  const roleAction = PEMISSION_MAP[permision];
  if (targetRole) {
    return (roleAction as RoleActionUser)(role, targetRole);
  }
  return (roleAction as RoleAction)(role);
};
