import * as constants from "src/constants";
import { Action } from "redux";
import { IWallTileUpdate } from "../types/VideoWall";

export interface ISelectWallTile extends Action<constants.SELECT_WALL_TILE> {
  payload: IWallTileUpdate;
}

export interface IUnSelectWallTile
  extends Action<constants.UN_SELECT_WALL_TILE> {
  payload: IWallTileUpdate;
}

export interface IUpdateWallTile extends Action<constants.UPDATE_WALL_TILE> {
  payload: IWallTileUpdate[];
}

export function selectWallTile(wallTile: IWallTileUpdate): ISelectWallTile {
  return {
    payload: wallTile,
    type: constants.SELECT_WALL_TILE
  };
}

export function unSelectWallTile(wallTile: IWallTileUpdate): IUnSelectWallTile {
  return {
    payload: wallTile,
    type: constants.UN_SELECT_WALL_TILE
  };
}

export function updateWallTile(wallTiles: IWallTileUpdate[]): IUpdateWallTile {
  return {
    payload: wallTiles,
    type: constants.UPDATE_WALL_TILE
  };
}
