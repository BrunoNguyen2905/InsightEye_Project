import {
  IUpdateHelloState,
  IHandleDrawer,
  IUpdateProfileMenu
} from "../actions";
import {
  UPDATE_HELLO_STATE,
  HANDLE_DRAWER,
  UPDATE_PROFILE_MENU
} from "../constants/index";
import { getCurrentUri } from "src/helpers/url";
import { LocationChangeAction, LOCATION_CHANGE } from "react-router-redux";
import RouteUri from "../helpers/routeUri";
import ProfileMenu from "../types/ProfileMenu";

export function helloState(
  state: { width: number; height: number } = {
    width: 500,
    height: 500
  },
  action: IUpdateHelloState
): { width: number; height: number } {
  switch (action.type) {
    case UPDATE_HELLO_STATE:
      return action.payload;
  }
  return state;
}

export function isOpenDrawer(
  state: boolean = true,
  action: IHandleDrawer
): boolean {
  switch (action.type) {
    case HANDLE_DRAWER:
      return action.payload;
  }
  return state;
}

export function currentUri(
  state: RouteUri = new RouteUri(""),
  action: LocationChangeAction
): RouteUri {
  switch (action.type) {
    case LOCATION_CHANGE:
      return getCurrentUri(action.payload);
  }
  return state;
}

export function profileMenu(
  state: ProfileMenu = {},
  action: IUpdateProfileMenu
): ProfileMenu {
  switch (action.type) {
    case UPDATE_PROFILE_MENU:
      return {
        ...state,
        ...action.payload
      };
  }
  return state;
}

export * from "../scenes/user-mgnt/reducers";
export * from "../scenes/network/reducers";
export * from "../scenes/cctv/reducers";
export * from "../scenes/video-wall/reducers";
export * from "../scenes/auth/reducers";
export * from "../scenes/logs-mgnt/reducers";
export * from "../scenes/lib/reducers";
export * from "./video";
export * from "./common";
export * from "../components/TabRoute/reducers";
export * from "./TabBoard";
