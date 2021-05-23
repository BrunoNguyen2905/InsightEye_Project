import { UserLibRole } from "./permission";

export const PEMISSION_MAP = {
  addUser: (role: UserLibRole) => {
    return role === UserLibRole.Owner;
  },
  ban: (role: UserLibRole, targetRole: UserLibRole) => {
    if (targetRole === UserLibRole.Owner) {
      return false;
    }
    return role === UserLibRole.Owner;
  },

  userList: (role: UserLibRole) => {
    if (role === UserLibRole.BaseUser) {
      return false;
    }
    return true;
  }
};
