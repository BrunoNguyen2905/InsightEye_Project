import { CameraType } from "../../../types/Camera";

export default interface IGeoProperties<T = {}> {
  siteId: string;
  name: string;
  id: string;
  type: string;
  data?: T;
}

export enum PointType {
  CAMERA = 0,
  CAMERA360 = 1
}

export interface IPointGeoJsonProperties {
  id: string;
  Altitude: number;
  IsDrone: boolean;
  address: string;
  bearing: number;
  businessname: string;
  contactphonenumber: string;
  fieldofview: number;
  heightofcamera: number;
  isavailable: boolean;
  lengthoffov: number;
  ownername: string;
  pointid: string;
  pointname: string;
  timetosavevideo: number;
  timetosavevideotype: string;
  type: number;
  isPtz: boolean;
  pointdevicetype: CameraType;
}

export interface ICoverageGeoJsonProperties {
  id: string;
  pointid: string;
  pointname: string;
  type: number;
}

export interface IVehicleProperties {
  macAddress: string;
  streamName: string;
  lon: string;
  lat: number;
}

export interface ICoverageProperties {
  pointid: string;
  pointname: string;
  type: PointType;
  id: string;
}

export interface IPointLocation {
  [key: string]: {
    lon: number;
    lat: number;
    time: number;
  };
}
