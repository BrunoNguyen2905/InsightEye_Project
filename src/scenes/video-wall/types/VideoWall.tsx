import { ICustomTile } from "./Layout";
import { CameraType } from "../../../types/Camera";

export interface IWallTile {
  cameraUrl: string;
  cameraName: string;
  available: true;
  cameraId: string;
  tileIndex: number;
}

export interface ISelectedWallTile {
  [index: number]: string;
}

export interface IWallTileUpdate {
  cameraId: string;
  tileIndex: number;
}

export interface IVideoWallResponse {
  isCustomLayout: boolean;
  wallName: string;
  wallId?: string;
  wallType: number;
  wallTiles: IWallTile[];
  wallLayout?: string;
}

export interface IVideoWall {
  isCustomLayout: boolean;
  wallName: string;
  wallId?: string;
  wallType: number;
  wallTiles: IWallTile[];
  wallLayout?: ICustomTile[];
}

export interface IVideoWallUpdate {
  isCustomLayout: boolean;
  wallName: string;
  wallId?: string;
  wallType: number;
  wallTiles: IWallTileUpdate[];
  wallLayout?: string;
}

export interface IPosition {
  lat: number;
  long: number;
}

export interface IB {
  level: number;
}

export interface IDroneData {
  h: number;
  a: number;
  l: IPosition;
  b: IB;
}

export interface ICCTV {
  id: string;
  videowallId: string;
  horizontalAxis: number;
  verticalAxis: number;
  height: number;
  width: 0;
  pointId: string;
  tileType: string;
  droneData: IDroneData;
  cameraId: string;
  cameraName: string;
  ipAddress: string;
  address: string;
  inWatchList: true;
  liveStreamUrl: string;
  androidStreamUrl: string;
}

export interface ICameraInfo {
  CameraId: string;
  CameraName: string;
  CameraUrl: string;
  PointDeviceType: CameraType;
}
