import { combineReducers } from "redux";
import {
  SELECT_CAMERA_LAYOUT,
  SET_FULL_SCREEN,
  SELECT_WALL_TILE,
  UPDATE_WALL_TILE,
  UN_SELECT_WALL_TILE,
  SET_LIST_VIDEO_WALLS,
  INIT_VIDEO_WALL
} from "../../../constants/index";
import { ISelectLayout } from "../actions/LayoutDialog";
import {
  ISelectWallTile,
  IUpdateWallTile,
  IUnSelectWallTile
} from "../actions/VideoWall";
import { ISetVideoWalls, IInitVideoWall } from "../actions/Toolbar";
import { ICameraLayout } from "../types/Layout";
import { ISetFullScreen } from "../actions";
import { ISelectedWallTile } from "../types/VideoWall";

function layout(
  state: ICameraLayout | null = null,
  action: ISelectLayout | ISetVideoWalls | IInitVideoWall
): ICameraLayout | null {
  switch (action.type) {
    case SELECT_CAMERA_LAYOUT:
      return action.payload;
    case SET_LIST_VIDEO_WALLS: {
      if (action.payload.length === 0) {
        return null;
      } else {
        return state;
      }
    }
    case INIT_VIDEO_WALL:
      return null;
  }
  return state;
}

function isFullScreen(state: boolean = false, action: ISetFullScreen): boolean {
  switch (action.type) {
    case SET_FULL_SCREEN:
      return action.payload;
  }
  return state;
}

function selectedCamera(
  state: ISelectedWallTile = {},
  action: ISelectWallTile | IUnSelectWallTile | IUpdateWallTile
): ISelectedWallTile {
  switch (action.type) {
    case SELECT_WALL_TILE: {
      return {
        ...state,
        [action.payload.tileIndex]: action.payload.cameraId
      };
    }
    case UN_SELECT_WALL_TILE: {
      const resState = Object.assign({}, state);
      delete resState[action.payload.tileIndex];
      return {
        ...resState
      };
    }
    case UPDATE_WALL_TILE: {
      const obj = {};
      if (action.payload) {
        action.payload.map(el => {
          obj[el.tileIndex] = el.cameraId;
        });
      }
      return {
        ...obj
      };
    }
  }
  return state;
}

export const cameraLayout = combineReducers({
  layout,
  selectedCamera,
  isFullScreen
});
