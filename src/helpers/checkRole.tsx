import { Roles } from "../types/Account";
import { User } from "oidc-client";

export default function checkRole(account: User, roles: Roles | Roles[]) {
  if (Array.isArray(roles)) {
    return Boolean(roles.find(role => role === account.profile.role));
  } else {
    return account.profile.role === roles;
  }
}
