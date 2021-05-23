import * as React from "react";
import ShowChart from "@material-ui/icons/ShowChart";
import Person from "@material-ui/icons/Person";
import Schedule from "@material-ui/icons/Schedule";
import Visibility from "@material-ui/icons/Visibility";
import Videocam from "@material-ui/icons/Videocam";
import MenuList from "@material-ui/core/MenuList";
import CMenuItem from "../containers/CMenuItem";
import paths from "../paths";
import RouteUri from "../helpers/routeUri";
import IAuth from "../types/Auth";
import { UserLibRole } from "../helpers/permission";

export interface IRouteProps {
  auth: IAuth;
  role: UserLibRole;
}

const LeftMenu = ({ auth, role }: IRouteProps) => {
  return (
    <MenuList>
      <CMenuItem
        text="Map"
        icon={<ShowChart />}
        uri={new RouteUri(paths.board)}
      />
      {role &&
        role !== UserLibRole.BaseUser && (
          <CMenuItem
            text="Video wall"
            icon={<Visibility />}
            uri={new RouteUri(paths.videoWall)}
          />
        )}
      {role &&
        (role === UserLibRole.Admin || role === UserLibRole.Owner) && (
          <div>
            <CMenuItem
              text="User Mgnt"
              icon={<Person />}
              uri={new RouteUri(paths.users)}
            />
            <CMenuItem
              text="CCTV Mgnt"
              icon={<Videocam />}
              uri={new RouteUri(paths.cctv)}
            />
          </div>
        )}
      {role &&
        (role === UserLibRole.Admin ||
          role === UserLibRole.Owner ||
          role === UserLibRole.Supervisor) && (
          <CMenuItem
            text="Logs"
            icon={<Schedule />}
            uri={new RouteUri(paths.logsMgnt)}
          />
        )}
    </MenuList>
  );
};

export default LeftMenu;
