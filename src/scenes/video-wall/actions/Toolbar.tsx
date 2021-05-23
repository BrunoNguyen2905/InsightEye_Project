import * as constants from "src/constants";
import { Action } from "redux";
import { ICCTV, IVideoWall, ICameraInfo } from "../types/VideoWall";
import { ICustomTile } from "../types/Layout";

export interface ILoadVideoWalls extends Action<constants.LOAD_VIDEO_WALLS> {}

export interface ILoadCCTVs extends Action<constants.LOAD_CCTVS> {
  payload: string;
}

export interface ILoadListCamera extends Action<constants.LOAD_LIST_CAMERA> {}

export interface ISetListCamera extends Action<constants.SET_LIST_CAMERA> {
  payload: ICameraInfo[];
}

export interface ISetCCTVs extends Action<constants.SET_LIST_CCTVS> {
  payload: ICCTV[];
}

export interface ISetVideoWalls extends Action<constants.SET_LIST_VIDEO_WALLS> {
  payload: IVideoWall[];
}

export interface ISetVideoWall extends Action<constants.SET_VIDEO_WALL> {
  payload: IVideoWall | null;
}

export interface IAddTile extends Action<constants.ADD_TILE> {
  payload: ICustomTile;
}

export interface IRemoveTile extends Action<constants.REMOVE_TILE> {
  payload: number;
}

export interface IUpdateCustomLayout
  extends Action<constants.UPDATE_CUSTOM_LAYOUT> {
  payload: ICustomTile[];
}

export interface IUpdateCustomTile
  extends Action<constants.UPDATE_CUSTOM_TILE> {
  payload: ICustomTile;
}

export interface ISetToolbarStatus
  extends Action<constants.SET_TOOLBAR_STATUS> {
  payload: string;
}

export interface IInitVideoWall extends Action<constants.INIT_VIDEO_WALL> {}

export interface ICreateVideoWall extends Action<constants.CREATE_VIDEO_WALL> {
  payload: IVideoWall;
}

export interface IUpdateVideoWall extends Action<constants.UPDATE_VIDEO_WALL> {
  payload: IVideoWall;
}

export interface IDeleteVideoWall extends Action<constants.DELETE_VIDEO_WALL> {
  payload: IVideoWall;
}

export interface ISetFullScreen extends Action<constants.SET_FULL_SCREEN> {
  payload: boolean;
}

export function initVideoWall(): IInitVideoWall {
  return {
    type: constants.INIT_VIDEO_WALL
  };
}
export function loadVideoWalls(): ILoadVideoWalls {
  return {
    type: constants.LOAD_VIDEO_WALLS
  };
}
export function loadCTTVs(videoWallId: string): ILoadCCTVs {
  return {
    payload: videoWallId,
    type: constants.LOAD_CCTVS
  };
}

export function setListCTTVs(listCTTV: ICCTV[]): ISetCCTVs {
  return {
    payload: listCTTV,
    type: constants.SET_LIST_CCTVS
  };
}

export function setListVideoWall(listVideoWall: IVideoWall[]): ISetVideoWalls {
  return {
    payload: listVideoWall,
    type: constants.SET_LIST_VIDEO_WALLS
  };
}

export function setVideoWall(videoWall: IVideoWall | null): ISetVideoWall {
  return {
    payload: videoWall,
    type: constants.SET_VIDEO_WALL
  };
}

export function setToolbarStatus(status: string): ISetToolbarStatus {
  return {
    payload: status,
    type: constants.SET_TOOLBAR_STATUS
  };
}

export function createVideoWall(videoWall: IVideoWall): ICreateVideoWall {
  return {
    payload: videoWall,
    type: constants.CREATE_VIDEO_WALL
  };
}

export function updateVideoWall(videoWall: IVideoWall): IUpdateVideoWall {
  return {
    payload: videoWall,
    type: constants.UPDATE_VIDEO_WALL
  };
}

export function deleteVideoWall(videoWall: IVideoWall): IDeleteVideoWall {
  return {
    payload: videoWall,
    type: constants.DELETE_VIDEO_WALL
  };
}

export function setFullScreen(isFull: boolean): ISetFullScreen {
  return {
    payload: isFull,
    type: constants.SET_FULL_SCREEN
  };
}

export function loadListCamera(): ILoadListCamera {
  return {
    type: constants.LOAD_LIST_CAMERA
  };
}

export function setListCamera(cameras: ICameraInfo[]): ISetListCamera {
  return {
    payload: cameras,
    type: constants.SET_LIST_CAMERA
  };
}

export function addTile(tile: ICustomTile): IAddTile {
  return {
    payload: tile,
    type: constants.ADD_TILE
  };
}

export function removeTile(id: number): IRemoveTile {
  return {
    payload: id,
    type: constants.REMOVE_TILE
  };
}

export function updateCustomTile(tile: ICustomTile): IUpdateCustomTile {
  return {
    payload: tile,
    type: constants.UPDATE_CUSTOM_TILE
  };
}

export function updateCustomLayout(
  listTile: ICustomTile[]
): IUpdateCustomLayout {
  return {
    payload: listTile,
    type: constants.UPDATE_CUSTOM_LAYOUT
  };
}
