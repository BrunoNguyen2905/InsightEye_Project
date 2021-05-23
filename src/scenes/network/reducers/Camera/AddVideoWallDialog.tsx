import { combineReducers } from "redux";

import {
  IShowDialog,
  ISetCameraId,
  ISetListCameraId
} from "../../actions/AddVideoWallDialog";
import {
  SHOW_ADD_VIDEO_WALL_DIALOG,
  SET_CAMERA_ID,
  SET_LIST_CAMERA_ID
} from "../../constants/AddVideoWallDialog";

function showDialog(state: boolean = false, action: IShowDialog): boolean {
  switch (action.type) {
    case SHOW_ADD_VIDEO_WALL_DIALOG:
      return action.payload;
  }
  return state;
}

function listCameraId(
  state: string[] = [],
  action: ISetCameraId | ISetListCameraId
): string[] {
  switch (action.type) {
    case SET_CAMERA_ID:
      return [action.payload];
    case SET_LIST_CAMERA_ID:
      return action.payload;
  }
  return state;
}

export const addVideoWallDialog = combineReducers({
  showDialog,
  listCameraId
});
