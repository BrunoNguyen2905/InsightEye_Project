import * as React from "react";
import { Redirect } from "react-router";
import paths from "src/paths";
import IAuth from "../types/Auth";
// import { Roles } from "../types/Account";
import { mgr } from "../scenes/auth/middlewares/userManager";
import { ILib } from "../scenes/lib/types/libs";
import { UserLibRole } from "../helpers/permission";

export enum ProtectLevel {
  all,
  private,
  public
}

export interface IRouteProps {
  role: UserLibRole;
  protect?: ProtectLevel;
  auth: IAuth;
  children: React.ReactElement<{}> | null;
  routePath: string;
  libs: ILib[];
  selectLib: string;
}

// const alow = (protect: ProtectLevel, isAuth: boolean): boolean => {
//   switch (protect) {
//     case ProtectLevel.private: {
//       return isAuth;
//     }
//     case ProtectLevel.public: {
//       return !isAuth;
//     }
//   }
//   return true;
// };

const listAccessRolePaths = {
  [UserLibRole.BaseUser]: [paths.board, paths.libSelect, paths.libNew],
  [UserLibRole.VideoUser]: [
    paths.board,
    paths.videoWall,
    paths.libSelect,
    paths.libNew
  ],
  [UserLibRole.Supervisor]: [
    paths.board,
    paths.videoWall,
    paths.logsMgnt,
    paths.libSelect,
    paths.libNew
  ],
  [UserLibRole.Admin]: [
    paths.board,
    paths.videoWall,
    paths.users,
    paths.cctv,
    paths.logsMgnt,
    paths.profile,
    paths.libSelect,
    paths.libNew
  ],
  [UserLibRole.Owner]: [
    paths.board,
    paths.videoWall,
    paths.users,
    paths.cctv,
    paths.logsMgnt,
    paths.profile,
    paths.libSelect,
    paths.libNew
  ]
};

const AuthComponent = ({
  protect,
  auth,
  children,
  routePath,
  libs,
  selectLib,
  role
}: IRouteProps) => {
  protect = protect || ProtectLevel.all;
  const isAuth = auth.isAuth;
  if (auth.isChecking) {
    return children;
  }

  // const redirectPath =
  //   protect === ProtectLevel.private ? paths.signin : paths.home;
  // const redirectCom = <Redirect to={redirectPath} />;

  // if (!alow(protect, isAuth)) {
  //   return redirectCom;
  // }
  // if (isAuth) {
  //   if (
  //     auth.account &&
  //     !listAccessRolePaths[auth.account.role].find(
  //       path => routePath.indexOf(path) === 0
  //     )
  //   ) {
  //     return redirectCom;
  //   }
  // }

  if (
    routePath !== "/callback" &&
    !listAccessRolePaths[role].find(path => routePath.indexOf(path) === 0)
  ) {
    return <Redirect to={paths.board} />;
  }

  if (isAuth && paths.home === routePath) {
    return <Redirect to={paths.board} />;
  }
  if (protect === ProtectLevel.public && isAuth) {
    return <Redirect to={paths.board} />;
  } else if (protect === ProtectLevel.private && !isAuth) {
    mgr.signinRedirect();
    return <div>Redirecting...</div>;
  }

  const selectedLib = libs.find(lib => lib.id === selectLib);
  if (
    auth.isAuth &&
    !selectedLib &&
    [paths.libSelect, paths.libNew].indexOf(routePath) < 0
  ) {
    return <Redirect to={paths.libSelect} />;
  }

  return children;
};

export default AuthComponent;
