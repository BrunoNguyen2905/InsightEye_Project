import {
  OPEN_CAMERA_VIEW,
  CLOSE_CAMERA_VIEW,
  LOAD_CAMERA_VIEW,
  LOAD_RECORD_VIDEO,
  SET_RECORD_VIDEO,
  SAVE_RECORD_VIDEO,
  SET_RECORD_VIDEO_LOGS,
  LOAD_RECORD_VIDEO_LOGS,
  UPDATE_TAB_CAMERA_VIEW
} from "../constants/CameraView";
import { Action, Dispatch } from "redux";
import {
  ICameraView,
  ICamereRecordVideo,
  CameraViewType,
  ICameraLocation
} from "../types/CameraView";
import { ILogsMngtSearch } from "src/scenes/logs-mgnt/actions";
import ILogRequest from "src/scenes/logs-mgnt/types/LogRequest";
import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "src/environment";
import ILogResponse from "src/scenes/logs-mgnt/types/LogRespone";
import { LOGS_MGNT_SEARCH } from "src/scenes/logs-mgnt/constaints";
import { Store } from "react-redux";
import { IStoreState } from "../../../types";

export interface ICloseCameraView extends Action<CLOSE_CAMERA_VIEW> {
  payload: string;
}

export interface IOpenCameraView extends Action<OPEN_CAMERA_VIEW> {
  payload: ICameraView;
}

export interface IUpdateTabCameraView extends Action<UPDATE_TAB_CAMERA_VIEW> {
  payload: ICameraView;
}

export interface ILoadCameraView extends Action<LOAD_CAMERA_VIEW> {
  payload: {
    pointId: string;
    type: CameraViewType;
  };
}

export interface ILoadRecordVideo extends Action<LOAD_RECORD_VIDEO> {
  payload: {
    skip: number;
    pointId: string;
    start?: string;
    end?: string;
  };
}

export interface ILoadRecordVideoLogs extends Action<LOAD_RECORD_VIDEO_LOGS> {
  payload: {
    videoId: string;
  };
}

export interface ISetRecordVideo extends Action<SET_RECORD_VIDEO> {
  payload: ICamereRecordVideo;
}

export interface ISetRecordVideoLogs extends Action<SET_RECORD_VIDEO_LOGS> {
  payload: ICameraLocation[];
}

export function setRecordCameraLogs(
  data: ICameraLocation[]
): ISetRecordVideoLogs {
  return {
    payload: data,
    type: SET_RECORD_VIDEO_LOGS
  };
}

export interface IRecordVideo extends Action<SAVE_RECORD_VIDEO> {
  payload: string;
}

export function saveVideo(pointId: string): IRecordVideo {
  return {
    payload: pointId,
    type: SAVE_RECORD_VIDEO
  };
}

export function closeCameraView(pointId: string): ICloseCameraView {
  return {
    payload: pointId,
    type: CLOSE_CAMERA_VIEW
  };
}
export function openCameraView(cameraView: ICameraView): IOpenCameraView {
  return {
    payload: cameraView,
    type: OPEN_CAMERA_VIEW
  };
}

export function updateTabCameraView(
  cameraView: ICameraView
): IUpdateTabCameraView {
  return {
    payload: cameraView,
    type: UPDATE_TAB_CAMERA_VIEW
  };
}

export function loadCameraView(
  pointId: string,
  type: CameraViewType
): ILoadCameraView {
  return {
    payload: {
      pointId,
      type
    },
    type: LOAD_CAMERA_VIEW
  };
}

export function loadRecordCamera(
  pointId: string,
  skip: number,
  start?: string,
  end?: string
): ILoadRecordVideo {
  return {
    payload: {
      pointId,
      skip,
      start,
      end
    },
    type: LOAD_RECORD_VIDEO
  };
}

export function loadRecordCameraLogs(videoId: string): ILoadRecordVideoLogs {
  return {
    payload: {
      videoId
    },
    type: LOAD_RECORD_VIDEO_LOGS
  };
}

export function setRecordCamera(data: ICamereRecordVideo): ISetRecordVideo {
  return {
    payload: data,
    type: SET_RECORD_VIDEO
  };
}

export const logsMngtPointSearch = (store: Store<IStoreState>) => (
  dispatch: Dispatch<ILogsMngtSearch>
) => (
  pageSize: number,
  pageNo: number,
  filter: ILogRequest,
  pointId: string
) => {
  const currentState = store.getState();
  axios
    .post(
      `${REACT_APP_API_URL}/api/v2/log/${
        currentState.libs.selectedLib
      }/point/search/${pointId}/${pageSize}/${(pageNo - 1) * pageSize}`,
      filter
    )
    .then((resp: AxiosResponse<ILogResponse>) => {
      dispatch({
        type: LOGS_MGNT_SEARCH,
        payload: resp.data
      });
    })
    .catch(err => {
      throw err;
    });
};
