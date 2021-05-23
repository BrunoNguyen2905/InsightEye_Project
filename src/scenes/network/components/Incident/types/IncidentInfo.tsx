import { FeatureCollection, Point } from "geojson";
import { Polygon } from "@turf/helpers";
import IUser from "../../../../../types/User";
export interface IIncidentPostInfo {
  id?: string;
  name: string;
  address: string;
  incidentDateTimeUtc: string;
  pointWithIndexes: IPointDisplay[];
  lat: number;
  lon: number;
  jsonStringForRouteOrPolygon: string;
  note: string;
  shareUserIds: string[];
}
export interface IIncidentPutInfo {
  title: string;
  incidentDate: string;
  pointWithIndex: IPointDisplay[];
  note: string;
  sharedUserIds: string[];
}

export interface IPointDisplay {
  pointName?: string;
  pointId: string;
  index: number;
  isShow: boolean;
}

export interface IIcdCamPointResp {
  pointId: string;
  pointName: string;
}
export interface IIcdCamCoverageResp {
  pointid: string;
  pointname: string;
  type: number;
  id: string;
}
export interface IIncidentResponseInfo {
  id: string;
  title: string;
  createdDateUtc: string;
  incidentDateUtc: string;
  jsonStringForRouteOrPolygon: string;
  note: string;
  notes: IIncidentNote[];
  address: string;
  createdUserId: string;
  createdUser: ICreatedUser;
  sharedUsers: IUser[];
  pointWithIndex: IPointDisplay[];
  clips: IIcdClip[];
  pointGeoJson: FeatureCollection<Point, IIcdCamPointResp>;
  coverageGeoJson: FeatureCollection<Polygon, IIcdCamCoverageResp>;
  lat: number;
  lon: number;
}
export const ICD_CLIP_DEFAULT: IIcdClip = {
  incidentDetailId: "",
  pointId: "",
  pointName: "",
  videoRecordId: "",
  videoSrc: "",
  description: "",
  videoStartTimeUtc: "",
  videoStartTimeUtcEpoch: 0,
  startTime: 0,
  endTime: 0,
  formattedStartTime: "",
  formattedEndTime: ""
};
export interface IIcdClip {
  incidentDetailId: string;
  pointId: string;
  pointName: string;
  videoRecordId: string;
  videoSrc: string;
  description: string;
  videoStartTimeUtc: string;
  videoStartTimeUtcEpoch: number;
  startTime: number;
  endTime: number;
  formattedStartTime: string;
  formattedEndTime: string;
}

export interface ICreatedUser {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface IIncidentNote {
  id: string;
  content: string;
  lat: number;
  lon: number;
  bearing: number;
}

export interface IIncidentForm {
  name?: string;
  address: string;
  incidentDateTimeUtc: string;
  note?: string;
  shareUserIds?: string[];
}
