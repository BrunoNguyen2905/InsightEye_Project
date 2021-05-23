import { Action } from "redux";
import * as constants from "../constants";
// import { LocationChangeAction } from "react-router-redux";
// import {
//   IHandleMainMapData,
//   IHandleMainMap,
//   IMainMapHover,
//   IMainMapSiteDetail,
//   IMainMapSiteDetailTabClose
// } from "../scenes/network/actions";
// import { ISetupAuthentication } from "../scenes/auth/actions";
import IProfileMenu from "../types/ProfileMenu";
import * as notifications from "../components/notification/action";

export interface IUpdateHelloState
  extends Action<constants.UPDATE_HELLO_STATE> {
  payload: any;
}

export interface IHandleDrawer extends Action<constants.HANDLE_DRAWER> {
  payload: boolean;
}

export interface IApplicationInit extends Action<constants.APPLICATION_INIT> {}

export interface ISignInSilent extends Action<constants.SIGN_IN_SILENT> {
  payload: number;
}
export function signInSilent(time: number): ISignInSilent {
  return {
    type: constants.SIGN_IN_SILENT,
    payload: time
  };
}
export interface IUpdateProfileMenu
  extends Action<constants.UPDATE_PROFILE_MENU> {
  payload: IProfileMenu;
}
export interface ISetLibActive extends Action<constants.LIB_ACTIVE> {
  payload: boolean;
}

export function setLibActive(status: boolean): ISetLibActive {
  return {
    payload: status,
    type: constants.LIB_ACTIVE
  };
}

export interface IUserBanned extends Action<constants.USER_BANNED> {}

export function userBanned(): IUserBanned {
  return {
    type: constants.USER_BANNED
  };
}

// export type IHelloAction =
//   | IUpdateHelloState
//   | IHandleDrawer
//   | IHandleMainMap
//   | IHandleMainMapData
//   | IMainMapHover
//   | IMainMapSiteDetailTabClose
//   | IMainMapSiteDetail
//   | LocationChangeAction
//   | ISetupAuthentication
//   | IUpdateProfileMenu;

export function handleDrawer(value: boolean): IHandleDrawer {
  return {
    payload: value,
    type: constants.HANDLE_DRAWER
  };
}
export function updateHelloState(helloState: {
  width: number;
  height: number;
}): IUpdateHelloState {
  return {
    payload: helloState,
    type: constants.UPDATE_HELLO_STATE
  };
}

export function applicationInit(): IApplicationInit {
  return {
    type: constants.APPLICATION_INIT
  };
}
export function updateProfileMenu(
  profileMenu: IProfileMenu
): IUpdateProfileMenu {
  return {
    type: constants.UPDATE_PROFILE_MENU,
    payload: profileMenu
  };
}

export * from "../scenes/network/actions";

export const common = {
  ...notifications
};
