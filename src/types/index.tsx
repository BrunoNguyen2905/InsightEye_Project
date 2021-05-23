import { RouterState } from "react-router-redux";

import {
  IVideoWall,
  ICCTV,
  ICameraInfo,
  ISelectedWallTile
} from "../scenes/video-wall/types/VideoWall";
import RouteUri from "../helpers/routeUri";
import IAuth from "./Auth";
// import { IFormLogin, IErrorLogin } from "../scenes/auth/components/Signin";
import { ICameraLayout, ICustomTile } from "../scenes/video-wall/types/Layout";
import IProfileMenu from "./ProfileMenu";
import ICommon from "./Common";
import INetwork from "../scenes/network/types";
import IFloatingVideo from "./FloatingVideo";
import {
  ICameraView,
  ICamereRecordVideo,
  ICameraLocation
} from "../scenes/network/types/CameraView";
import { IStoreCCTVManagement } from "../scenes/cctv/types";
import ITabRoute from "../components/TabRoute/types";
import { IUsersManagement } from "../scenes/user-mgnt/types";
import ILogScene from "../scenes/logs-mgnt/types/LogScene";
import { IMappingType } from "../helpers/mappingRedux";
import { ILibsStore } from "../scenes/lib/types";
// import {
//   IFormForgotPassword,
//   IErrorForgotPassword
// } from "../scenes/auth/components/ForgotPassword";

export interface IStoreState {
  common: ICommon;
  tabRoute: ITabRoute;
  helloState: { width: number; height: number };
  routing: RouterState;
  isOpenDrawer: boolean;
  mainMap: INetwork;
  CCTVManagement: IStoreCCTVManagement;
  videoWallManagement: {
    listVideoWall: IVideoWall[];
    listCamera: ICameraInfo[];
    listCTTV: ICCTV[];
    listTile: ICustomTile[];
    videoWall: IVideoWall | null;
    status: string;
  };
  currentUri: RouteUri;
  auth: IAuth;
  // login: {
  //   form: IFormLogin;
  //   error: IErrorLogin;
  // };
  // forgot: {
  //   form: IFormForgotPassword;
  //   error: IErrorForgotPassword;
  // };
  layoutDialog: {
    listLayout: ICameraLayout[];
    showDialog: boolean;
  };
  cameraLayout: {
    layout: ICameraLayout | null;
    selectedCamera: ISelectedWallTile;
    isFullScreen: boolean;
  };
  profileMenu: IProfileMenu;
  floatingVideoManagement: {
    listFloatingVideo: IFloatingVideo[];
  };
  cameraViewManagement: {
    listCameraView: ICameraView[];
    listRecordVideo: ICamereRecordVideo;
    cameraLogs: ICameraLocation[];
    logs: IMappingType<ILogScene>;
  };
  tabBoardManagement: {
    tabId: string;
  };
  usersManagement: IUsersManagement;
  logMgnt: ILogScene;
  addVideoWallDialog: {
    showDialog: boolean;
    listCameraId: string[];
  };
  libs: ILibsStore;
}
