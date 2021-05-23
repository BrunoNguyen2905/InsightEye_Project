import * as constants from "src/constants";
import { Action } from "redux";
import { ICameraLayout } from "../types/Layout";

export interface ILoadCameraLayout
  extends Action<constants.LOAD_CAMERA_LAYOUT> {}

export interface ISelectLayout extends Action<constants.SELECT_CAMERA_LAYOUT> {
  payload: ICameraLayout | null;
}

export interface IShowDialog extends Action<constants.SHOW_CAMERA_LAYOUT> {
  payload: boolean;
}

export function loadCameraLayout(): ILoadCameraLayout {
  return {
    type: constants.LOAD_CAMERA_LAYOUT
  };
}

export function selectCameraLayout(
  cameraLayout: ICameraLayout | null
): ISelectLayout {
  return {
    payload: cameraLayout,
    type: constants.SELECT_CAMERA_LAYOUT
  };
}

export function showDialog(): IShowDialog {
  return {
    payload: true,
    type: constants.SHOW_CAMERA_LAYOUT
  };
}

export function hideDialog(): IShowDialog {
  return {
    payload: false,
    type: constants.SHOW_CAMERA_LAYOUT
  };
}
