import { ISite, ISiteAlarm } from "../types/Site";
import * as constants from "src/constants";
import { Action } from "redux";
import IGeoProperties from "../types/GeoProperties";
import { ISiteDetailTab } from "../types/SiteDetail";
import { START_INCIDENT, START_BOARD } from "../constants";
import { Dispatch } from "react-redux";
import IMapState from "../../../types/MapState";
import { HANDLE_MAIN_MAP_STATE } from "src/constants";

export interface IHandleMainMapData extends Action<constants.UPDATE_MAP_DATA> {
  payload: ISite[];
}
export interface IHandleMainMap extends Action<constants.HANDLE_VIEWPORT> {
  payload: any;
}
export interface IMainMapHover extends Action<constants.MAIN_MAP_HOVER> {
  payload: IGeoProperties | null;
}
export interface IMainMapSiteDetailTab
  extends Action<constants.MAIN_MAP_SITE_DETAIL_TAB> {
  payload: ISiteDetailTab;
}
export interface IMainMapSiteDetailTabClose
  extends Action<constants.MAIN_MAP_DETAIL_SITE_TAB_CLOSE> {
  payload: string;
}
export interface IMainMapSiteDetail
  extends Action<constants.MAIN_MAP_SITE_DETAIL> {
  payload: ISite;
}
export interface IMainMapSiteDetailState
  extends Action<constants.MAIN_MAP_DETAIL_SITE_STATE> {
  payload: {
    siteId: string;
    state: {
      loading?: boolean;
      notFound?: boolean;
    };
  };
}

export interface IMainMapAlarm extends Action<constants.MAIN_MAP_ALARMS> {
  payload: ISiteAlarm[];
}

export interface IAddAlarm extends Action<constants.ADD_ALARM> {
  payload: ISiteAlarm[];
}

export interface IRemoveAlarm extends Action<constants.REMOVE_ALARM> {
  payload: ISiteAlarm[];
}

export function updateMainMapData(geoData: ISite[]): IHandleMainMapData {
  return {
    payload: geoData,
    type: constants.UPDATE_MAP_DATA
  };
}

export function updateMainMap(viewState: any): IHandleMainMap {
  return {
    payload: viewState,
    type: constants.HANDLE_VIEWPORT
  };
}

export function hoverMainMap(siteInfo: IGeoProperties | null): IMainMapHover {
  return {
    payload: siteInfo,
    type: constants.MAIN_MAP_HOVER
  };
}

export function setDetailSite(siteInfo: ISite): IMainMapSiteDetail {
  return {
    payload: siteInfo,
    type: constants.MAIN_MAP_SITE_DETAIL
  };
}

export function setDetailTab(
  siteid: string,
  name?: string
): IMainMapSiteDetailTab {
  return {
    payload: {
      siteid,
      name
    },
    type: constants.MAIN_MAP_SITE_DETAIL_TAB
  };
}

export function setDetailTabClose(siteid: string): IMainMapSiteDetailTabClose {
  return {
    payload: siteid,
    type: constants.MAIN_MAP_DETAIL_SITE_TAB_CLOSE
  };
}

export function setSiteDetailState(
  siteId: string,
  state: {
    loading?: boolean;
    notFound?: boolean;
  }
): IMainMapSiteDetailState {
  return {
    payload: {
      siteId,
      state
    },
    type: constants.MAIN_MAP_DETAIL_SITE_STATE
  };
}

export function updateAlarm(alarms: ISiteAlarm[]): IMainMapAlarm {
  return {
    payload: alarms,
    type: constants.MAIN_MAP_ALARMS
  };
}

export function addAlarm(alarm: ISiteAlarm): IAddAlarm {
  return {
    payload: [alarm],
    type: constants.ADD_ALARM
  };
}

export function removeAlarm(alarm: ISiteAlarm): IRemoveAlarm {
  return {
    payload: [alarm],
    type: constants.REMOVE_ALARM
  };
}

export interface IStartBoardComponent extends Action<START_BOARD> {}
export interface IStartIncidentComponent extends Action<START_INCIDENT> {
  payload: string;
}

export const startBoardComponent = (
  dispatch: Dispatch<IStartBoardComponent>
) => () => {
  dispatch({
    type: START_BOARD
  });
};
export const startIncidentComponent = (
  dispatch: Dispatch<IStartIncidentComponent>
) => (id: string) => {
  dispatch({
    payload: id,
    type: START_INCIDENT
  });
};

export interface IHandleMainMapState
  extends Action<constants.HANDLE_MAIN_MAP_STATE> {
  payload: IMapState;
}
export const handleMainMapState = (dispatch: Dispatch<IHandleMainMapState>) => (
  mapState: IMapState
) => {
  dispatch({
    payload: mapState,
    type: HANDLE_MAIN_MAP_STATE
  });
};
