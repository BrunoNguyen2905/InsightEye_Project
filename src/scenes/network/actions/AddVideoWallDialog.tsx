import {
  SHOW_ADD_VIDEO_WALL_DIALOG,
  SET_CAMERA_ID,
  SET_LIST_CAMERA_ID
} from "../constants/AddVideoWallDialog";
import { Action } from "redux";
// import { ICameraLayout } from "../types/Layout";

// export interface ILoadCameraLayout
//   extends Action<constants.LOAD_CAMERA_LAYOUT> {}

// export interface ISelectLayout extends Action<constants.SELECT_CAMERA_LAYOUT> {
//   payload: ICameraLayout | null;
// }

export interface IShowDialog extends Action<SHOW_ADD_VIDEO_WALL_DIALOG> {
  payload: boolean;
}

export interface ISetCameraId extends Action<SET_CAMERA_ID> {
  payload: string;
}

export function setCameraId(cameraId: string): ISetCameraId {
  return {
    payload: cameraId,
    type: SET_CAMERA_ID
  };
}

export interface ISetListCameraId extends Action<SET_LIST_CAMERA_ID> {
  payload: string[];
}

export function setListCameraId(listCameraId: string[]): ISetListCameraId {
  return {
    payload: listCameraId,
    type: SET_LIST_CAMERA_ID
  };
}

export function showDialog(): IShowDialog {
  return {
    payload: true,
    type: SHOW_ADD_VIDEO_WALL_DIALOG
  };
}

export function hideDialog(): IShowDialog {
  return {
    payload: false,
    type: SHOW_ADD_VIDEO_WALL_DIALOG
  };
}
