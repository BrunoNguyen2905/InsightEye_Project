import { CameraType } from "../../../types/Camera";

export interface ICameraView {
  pointId: string;
  cameraId: string;
  cameraName: string;
  liveStreamUrl: string;
  address: string;
  pointDeviceType: CameraType;
}

export interface IRecordVideo {
  videoSrc: string;
  id: string;
  name: string;
  createdDateUtc: string;
  videoUrl: string;
  androidVideoUrl: string;
  thumbnailUrl: string;
  duration: string;
  startDateUtc: string;
  endDateUtc: string;
  start: number;
  end: number;
}

export interface ICamereRecordVideo {
  total: number;
  recordedVideos: IRecordVideo[];
}

export enum CameraViewType {
  INCIDENT_VIEW = "incident-view",
  CAMERA_VIEW = "camera-view",
  FLOATING_VIDEO = "floating-video"
}

export interface ICameraLocation {
  time: number;
  lon: number;
  lat: number;
}

export interface ICameraLocationJSON {
  time: string;
  lon: string;
  lat: string;
}

export const CLONE_KEY_CAMERA_VIEW = "CLONE_KEY_CAMERA_VIEW";
