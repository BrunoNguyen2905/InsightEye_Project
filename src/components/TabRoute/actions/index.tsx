import { Action } from "redux";
import {
  SWITCH_TAB,
  SETUP_TAB_ROUTES,
  CLOSE_TAB,
  UPDATE_TAB,
  RESET_TAB
} from "../constants";
import ITabInfo from "../types/TabInfo";
import { Dispatch } from "react-redux";
import { IRoutesNoComponent } from "../types/Routes";
import { FinalRouteKey } from "src/routes";

export interface ISwitchTab extends Action<SWITCH_TAB> {
  payload: { key: FinalRouteKey; tab: ITabInfo };
}

export const switchTab = (dispatch: Dispatch<ISwitchTab>) => (
  key: FinalRouteKey,
  tabInfo: ITabInfo
) => {
  dispatch({
    payload: { key, tab: tabInfo },
    type: SWITCH_TAB
  });
};

export interface ICloseTab extends Action<CLOSE_TAB> {
  payload: { key: FinalRouteKey; tab: ITabInfo };
}

export const closeTab = (dispatch: Dispatch<ICloseTab>) => (
  key: FinalRouteKey,
  tabInfo: ITabInfo
) => {
  dispatch({
    payload: { key, tab: tabInfo },
    type: CLOSE_TAB
  });
};

export interface IUpdateTab extends Action<UPDATE_TAB> {
  payload: { key: FinalRouteKey; tab: ITabInfo };
}

export const updateTab = (dispatch: Dispatch<IUpdateTab>) => (
  key: FinalRouteKey,
  tabInfo: ITabInfo
) => {
  dispatch({
    payload: { key, tab: tabInfo },
    type: UPDATE_TAB
  });
};

export interface IResetTab extends Action<RESET_TAB> {
  payload: {
    key: string;
    keepTabs: string[];
  };
}

export const resetTab = (dispatch: Dispatch<IResetTab>) => (
  key: string,
  keepTabs: string[] = []
) => {
  dispatch({
    type: RESET_TAB,
    payload: {
      key,
      keepTabs
    }
  });
};

export interface ISetupTabRoutes extends Action<SETUP_TAB_ROUTES> {
  payload: IRoutesNoComponent;
}

export const setupTabRoutes = (dispatch: Dispatch<ISetupTabRoutes>) => (
  routes: IRoutesNoComponent
) => {
  dispatch({
    payload: routes,
    type: SETUP_TAB_ROUTES
  });
};
