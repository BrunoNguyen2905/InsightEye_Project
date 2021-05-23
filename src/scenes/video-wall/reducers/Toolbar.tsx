import { combineReducers } from "redux";
import {
  SET_LIST_VIDEO_WALLS,
  SET_LIST_CCTVS,
  SET_VIDEO_WALL,
  SET_TOOLBAR_STATUS,
  SET_LIST_CAMERA,
  ADD_TILE,
  REMOVE_TILE,
  UPDATE_CUSTOM_TILE,
  UPDATE_CUSTOM_LAYOUT,
  INIT_VIDEO_WALL
} from "../../../constants/index";
import {
  ISetVideoWalls,
  ISetCCTVs,
  ISetVideoWall,
  ISetToolbarStatus,
  ISetListCamera,
  IAddTile,
  IRemoveTile,
  IUpdateCustomTile,
  IUpdateCustomLayout,
  IInitVideoWall
} from "../actions/Toolbar";
import { IVideoWall, ICCTV, ICameraInfo } from "../types/VideoWall";
import { ICustomTile } from "../types/Layout";

function listCTTV(state: ICCTV[] = [], action: ISetCCTVs): ICCTV[] {
  switch (action.type) {
    case SET_LIST_CCTVS:
      return action.payload;
  }
  return state;
}

function listVideoWall(
  state: IVideoWall[] = [],
  action: ISetVideoWalls
): IVideoWall[] {
  switch (action.type) {
    case SET_LIST_VIDEO_WALLS:
      return action.payload;
  }
  return state;
}

function listCamera(
  state: ICameraInfo[] = [],
  action: ISetListCamera
): ICameraInfo[] {
  switch (action.type) {
    case SET_LIST_CAMERA:
      return action.payload;
  }
  return state;
}

function listTile(
  state: ICustomTile[] = [],
  action: IAddTile | IRemoveTile | IUpdateCustomTile | IUpdateCustomLayout
): ICustomTile[] {
  switch (action.type) {
    case ADD_TILE: {
      let newTile: ICustomTile = {
        ...action.payload,
        id: state.length
      };
      for (let i = 0; i < state.length; i++) {
        const tile = state.find(e => {
          return e.id === i;
        });
        if (!tile) {
          newTile = {
            ...action.payload,
            id: i
          };
          return state.concat(newTile);
        }
      }
      return state.concat(newTile);
    }
    case REMOVE_TILE:
      return state.filter(x => x.id !== action.payload);
    case UPDATE_CUSTOM_TILE: {
      state = state.map(el => {
        if (el.id === action.payload.id) {
          el = action.payload;
        }
        return el;
      });
      return state;
    }
    case UPDATE_CUSTOM_LAYOUT:
      return action.payload;
  }
  return state;
}

function videoWall(
  state: IVideoWall | null = null,
  action: ISetVideoWall | ISetVideoWalls | IInitVideoWall
): IVideoWall | null {
  switch (action.type) {
    case SET_VIDEO_WALL:
      return action.payload;
    case SET_LIST_VIDEO_WALLS: {
      if (action.payload.length === 0) {
        return null;
      } else {
        return state;
      }
    }
    case INIT_VIDEO_WALL: {
      return null;
    }
  }
  return state;
}

function status(
  state: string = "view",
  action: ISetToolbarStatus | IInitVideoWall
): string {
  switch (action.type) {
    case SET_TOOLBAR_STATUS:
      return action.payload;
    case INIT_VIDEO_WALL: {
      return "view";
    }
  }
  return state;
}

export const videoWallManagement = combineReducers({
  listCTTV,
  listCamera,
  listVideoWall,
  listTile,
  videoWall,
  status
});
