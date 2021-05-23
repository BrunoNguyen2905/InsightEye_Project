import { Action } from "redux";
import {
  INCIDENT_CHANGE_TAB,
  INCIDENT_TOGGLE_CAM,
  INCIDENT_SETUP_DATA,
  INCIDENT_SAVE_DATA,
  INCIDENT_SET_DETAIL,
  INCIDENT_UPDATE_DATA,
  INCIDENT_GET_DETAIL,
  INCIDENT_PLAY_CLIP,
  INCIDENT_SAVE_NOTE,
  INCIDENT_EDIT_NOTE,
  INCIDENT_DELETE_NOTE
} from "../constants";
import { Dispatch, Store } from "react-redux";
import IIncidentTransferData from "../types/IncidentTransferData";
import {
  IIncidentPostInfo,
  IIncidentResponseInfo,
  IIncidentPutInfo
} from "../types/IncidentInfo";
import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../../../../../environment";
import { SAVE_STATUS } from "../types";
import { NEW_KEY } from "../../../../../helpers/mappingRedux";
import {
  INCIDENT_SAVE_CLIP,
  INCIDENT_RELEASE_PLAYING_CLIP
} from "../constants";
import ICmrClipPost from "../../Camera/ICmrClipPost";
import ICmrClipPostRespone from "../../Camera/ICmrClipPostRespone";
import { IIcdClip } from "../types/IncidentInfo";
import { IStoreState } from "../../../../../types";

export interface IIncidentChangeTab extends Action<INCIDENT_CHANGE_TAB> {
  payload: number;
}

export const incidentChangeTab = (dispatch: Dispatch<IIncidentChangeTab>) => (
  tabIdx: number
) => {
  dispatch({
    type: INCIDENT_CHANGE_TAB,
    payload: tabIdx
  });
};

export interface IIncidentToggleCam extends Action<INCIDENT_TOGGLE_CAM> {
  payload: string;
}

export const incidentToggleCam = (dispatch: Dispatch<IIncidentToggleCam>) => (
  cameraId: string
) => {
  dispatch({
    type: INCIDENT_TOGGLE_CAM,
    payload: cameraId
  });
};

export interface IIncidentSetupData extends Action<INCIDENT_SETUP_DATA> {
  payload: IIncidentTransferData;
}
export interface IIncidentUpateData extends Action<INCIDENT_UPDATE_DATA> {
  payload: Partial<IIncidentTransferData>;
}
export const incidentSetupData = (dispatch: Dispatch<IIncidentSetupData>) => (
  data: IIncidentTransferData
) => {
  dispatch({
    type: INCIDENT_SETUP_DATA,
    payload: data
  });
};
export const incidentUpdateData = (dispatch: Dispatch<IIncidentUpateData>) => (
  data: Partial<IIncidentTransferData>
) => {
  dispatch({
    type: INCIDENT_UPDATE_DATA,
    payload: data
  });
};

export interface IIncidentSaveData extends Action<INCIDENT_SAVE_DATA> {
  payload: { saveStatus: SAVE_STATUS; data: IIncidentPostInfo };
}

export const incidentSaveData = (store: Store<IStoreState>) => (
  dispatch: Dispatch<IIncidentSaveData>
) => (data: IIncidentPostInfo) => {
  let request = null;
  const currentState = store.getState();
  if (data.id && data.id !== NEW_KEY) {
    const putData: IIncidentPutInfo = {
      title: data.name,
      incidentDate: data.incidentDateTimeUtc,
      pointWithIndex: data.pointWithIndexes,
      note: data.note,
      sharedUserIds: data.shareUserIds
    };
    request = axios.put(
      `${REACT_APP_API_URL}/api/v2/incident/${
        currentState.libs.selectedLib
      }/info/${data.id}`,
      putData
    );
  } else {
    request = axios.post(
      `${REACT_APP_API_URL}/api/v2/incident/${currentState.libs.selectedLib}`,
      data
    );
  }

  request
    .then((resp: AxiosResponse<IIncidentPostInfo>) => {
      dispatch({
        type: INCIDENT_SAVE_DATA,
        payload: {
          saveStatus: SAVE_STATUS.SAVED,
          data: {
            ...data,
            id: resp.data.id
          }
        }
      });
    })
    .catch(err => {
      dispatch({
        type: INCIDENT_SAVE_DATA,
        payload: {
          saveStatus: SAVE_STATUS.ERROR,
          data
        }
      });
    });
};

export interface IIncidentSetDetail extends Action<INCIDENT_SET_DETAIL> {
  payload: IIncidentResponseInfo;
}
export interface IIncidentGetDetail extends Action<INCIDENT_GET_DETAIL> {
  payload: string;
}

export const incidentGetInfo = (dispatch: Dispatch<IIncidentGetDetail>) => (
  id: string
) => {
  dispatch({
    type: INCIDENT_GET_DETAIL,
    payload: id
  });
};

export const incidentRequestInfo = (store: Store<IStoreState>) => (
  dispatch: Dispatch<IIncidentSetDetail>
) => (id: string) => {
  const currentState = store.getState();
  axios
    .get(
      `${REACT_APP_API_URL}/api/v2/incident/${
        currentState.libs.selectedLib
      }/${id}`
    )
    .then((resp: AxiosResponse<IIncidentResponseInfo>) => {
      dispatch({
        type: INCIDENT_SET_DETAIL,
        payload: resp.data
      });
    })
    .catch(err => {
      throw err;
    });
};

export interface IIncidentSaveClip extends Action<INCIDENT_SAVE_CLIP> {
  payload: ICmrClipPostRespone;
}

export const incidentSaveClip = (store: Store<IStoreState>) => (
  dispatch: Dispatch<IIncidentSaveClip>
) => (clip: ICmrClipPost) => {
  const currentState = store.getState();
  axios
    .post(
      `${REACT_APP_API_URL}/api/v2/incident/${
        currentState.libs.selectedLib
      }/clip`,
      clip
    )
    .then((resp: AxiosResponse<ICmrClipPostRespone>) => {
      dispatch({
        type: INCIDENT_SAVE_CLIP,
        payload: resp.data
      });
    })
    .catch(err => {
      throw err;
    });
};

export interface IIncidentPlayClip extends Action<INCIDENT_PLAY_CLIP> {
  payload: IIcdClip;
}

export const incidentPlayClip = (dispatch: Dispatch<IIncidentPlayClip>) => (
  clip: IIcdClip
) => {
  dispatch({
    type: INCIDENT_PLAY_CLIP,
    payload: clip
  });
};

export interface IIncidentReleasePlayingClip
  extends Action<INCIDENT_RELEASE_PLAYING_CLIP> {}
export const incidentReleasePlayClip = (
  dispatch: Dispatch<IIncidentReleasePlayingClip>
) => () => {
  dispatch({
    type: INCIDENT_RELEASE_PLAYING_CLIP
  });
};

export interface IIncidentSaveNotePayload {
  incidentId: string;
  bearing: number;
  lat: number;
  lon: number;
  content: string;
}

export interface IIncidentSaveNote extends Action<INCIDENT_SAVE_NOTE> {
  type: INCIDENT_SAVE_NOTE;
  payload: IIncidentSaveNotePayload;
  meta: {
    done: (success: boolean, data?: { id: string }) => void;
  };
}

export interface IIncidentSaveNoteOptions {
  done: (success: boolean, data?: { id: string }) => void;
}

export const incidentSaveNote = (
  payload: IIncidentSaveNotePayload,
  options: IIncidentSaveNoteOptions
): IIncidentSaveNote => {
  return {
    type: INCIDENT_SAVE_NOTE,
    payload,
    meta: {
      done: options.done
    }
  };
};

export interface IIncidentEditNotePayload {
  incidentId: string;
  noteId: string;
  bearing: number;
  lat: number;
  lon: number;
  content: string;
}

export interface IIncidentEditNoteOptions {
  done: (success: boolean) => void;
}

export interface IIncidentEditNote extends Action<INCIDENT_EDIT_NOTE> {
  type: INCIDENT_EDIT_NOTE;
  payload: IIncidentEditNotePayload;
  meta: IIncidentEditNoteOptions;
}

export const incidentEditNote = (
  payload: IIncidentEditNotePayload,
  options: IIncidentEditNoteOptions
): IIncidentEditNote => {
  return {
    type: INCIDENT_EDIT_NOTE,
    payload,
    meta: options
  };
};

export interface IIncidentDeleteNotePayload {
  incidentId: string;
  noteId: string;
}

export interface IIncidentDeleteNoteOptions {
  done: (success: boolean) => void;
}

export interface IIncidentDeleteNote extends Action<INCIDENT_DELETE_NOTE> {
  type: INCIDENT_DELETE_NOTE;
  payload: IIncidentDeleteNotePayload;
  meta: {
    done: (success: boolean) => void;
  };
}

export const incidentDeleteNote = (
  payload: IIncidentDeleteNotePayload,
  options: IIncidentDeleteNoteOptions
): IIncidentDeleteNote => {
  return {
    type: INCIDENT_DELETE_NOTE,
    payload,
    meta: {
      done: options.done
    }
  };
};

export * from "./Map";
