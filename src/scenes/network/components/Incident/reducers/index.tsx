import { combineReducers } from "redux";
import {
  IIncidentChangeTab,
  IIncidentToggleCam,
  IIncidentUpateData,
  IIncidentSaveClip,
  IIncidentPlayClip
} from "../actions";
import {
  INCIDENT_CHANGE_TAB,
  INCIDENT_SAVE_DATA,
  INCIDENT_RELEASE_PLAYING_CLIP
} from "../constants";
import { showRoute } from "./Map";
import {
  INCIDENT_TOGGLE_CAM,
  INCIDENT_SETUP_DATA,
  INCIDENT_UPDATE_DATA
} from "../constants/index";
import {
  IIncidentSetupData,
  IIncidentSaveData,
  IIncidentReleasePlayingClip
} from "../actions/index";
import IIncidentTransferData from "../types/IncidentTransferData";
import { SAVE_STATUS } from "../types";
import { createFeatureCollection } from "src/helpers/geojson";
import {
  FeatureCollection,
  Polygon,
  LineString,
  GeoJsonProperties
} from "geojson";
import { IIncidentLngLat } from "../types/IncidentTransferData";
import {
  mappingReducer as mr,
  mappingReducerMoveable
} from "../../../../../helpers/mappingRedux";
import { INCIDENT_SAVE_CLIP, INCIDENT_PLAY_CLIP } from "../constants/index";
import ICmrClipPostRespone from "../../Camera/ICmrClipPostRespone";
import { IIncidentPostInfo } from "../types/IncidentInfo";
import {
  IIcdClip,
  ICD_CLIP_DEFAULT,
  IIncidentNote
} from "../types/IncidentInfo";

const mappingReducer = mappingReducerMoveable("INCIDENT", mr);

function currentTab(state: number = 0, action: IIncidentChangeTab): number {
  switch (action.type) {
    case INCIDENT_CHANGE_TAB:
      return action.payload;
  }
  return state;
}

function inactives(
  state: { [key: string]: boolean } = {},
  action: IIncidentToggleCam
): { [key: string]: boolean } {
  switch (action.type) {
    case INCIDENT_TOGGLE_CAM:
      return {
        ...state,
        [action.payload]: state[action.payload] ? false : true
      };
  }
  return state;
}

const incidentDefaultData = {
  cameras: [],
  paths: createFeatureCollection([]) as FeatureCollection<
    Polygon | LineString,
    GeoJsonProperties
  >,
  address: "",
  lnglat: [0, 0] as IIncidentLngLat,
  name: "",
  note: "",
  shares: [],
  notes: [] as IIncidentNote[]
};

const clipResponeToIcdClip = (clipResp: ICmrClipPostRespone): IIcdClip => ({
  incidentDetailId: clipResp.incidentDetailId,
  pointId: clipResp.pointId,
  pointName: clipResp.pointName,
  videoRecordId: clipResp.videoRecordId,
  videoSrc: clipResp.videoSrc,
  description: clipResp.description,
  videoStartTimeUtc: clipResp.videoStartTimeUtc,
  videoStartTimeUtcEpoch: clipResp.videoStartTimeUtcEpoch,
  startTime: clipResp.startTime,
  endTime: clipResp.endTime,
  formattedEndTime: clipResp.formattedEndTime,
  formattedStartTime: clipResp.formattedStartTime
});

function data(
  state: IIncidentTransferData = incidentDefaultData,
  action: IIncidentSetupData | IIncidentUpateData | IIncidentSaveClip
): IIncidentTransferData {
  switch (action.type) {
    case INCIDENT_SETUP_DATA:
      return action.payload;
    case INCIDENT_UPDATE_DATA:
      return {
        ...state,
        ...action.payload
      };
    case INCIDENT_SAVE_CLIP: {
      return {
        ...state,
        clips: [...(state.clips || []), clipResponeToIcdClip(action.payload)]
      };
    }
  }
  return state;
}

function saveStatus(
  state: { saveStatus: SAVE_STATUS; data?: IIncidentPostInfo } = {
    saveStatus: SAVE_STATUS.NOT_CHANGED
  },
  action: IIncidentSaveData | IIncidentSetupData | IIncidentUpateData
): { saveStatus: SAVE_STATUS; data?: IIncidentPostInfo } {
  switch (action.type) {
    case INCIDENT_SETUP_DATA: {
      return state;
    }
    case INCIDENT_UPDATE_DATA: {
      return { saveStatus: SAVE_STATUS.UNSAVED };
    }
    case INCIDENT_SAVE_DATA:
      return action.payload;
  }
  return state;
}

function playingClip(
  state: IIcdClip = ICD_CLIP_DEFAULT,
  action: IIncidentPlayClip | IIncidentReleasePlayingClip
): IIcdClip {
  switch (action.type) {
    case INCIDENT_PLAY_CLIP:
      return action.payload;
    case INCIDENT_RELEASE_PLAYING_CLIP:
      return ICD_CLIP_DEFAULT;
  }
  return state;
}

export const incident = combineReducers({
  currentTab: mappingReducer(currentTab),
  showRoute: mappingReducer(showRoute),
  inactives: mappingReducer(inactives),
  data: mappingReducer(data),
  saveStatus: mappingReducer(saveStatus),
  playingClip: mappingReducer(playingClip)
});
