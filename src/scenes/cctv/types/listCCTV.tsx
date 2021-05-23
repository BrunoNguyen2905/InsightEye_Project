import { CameraType } from "../../../types/Camera";

export interface ICCTV {
  bearing: number;
  pointId: string;
  pointName: string;
  address: string;
  lat: number;
  lon: number;
  coverage: number[][][];
  isPtz: boolean;
  lengthOfFOV: number;
  pointDeviceType: CameraType;
}

export interface IDetailCCTV {
  id: string;
  hidden: boolean;
  coverages: number[][][];
  pointName: string;
  address: string;
  longitude: number;
  latitude: number;
  bearing: number;
  fieldOfViewAngle: number;
  fieldOfViewlength: number;
  cctvUrl: string;
  businessName: string;
  ownerName: string;
  contactPhoneNumber: string;
  heightOfCamera: number;
  timeToSaveVideo: number;
  timeToSaveVideoType: string;
  isDrone: boolean;
  altitude: 0;
  isPtz: boolean;
  pointDeviceType: CameraType;
  streamUserName: string;
  streamPassword: string;
  streamIpAddress: string;
  streamRtmpUrl: string;
  streamRtmpKey: string;
  vehicleMacAddress: string;
}

export interface IListCCTVState {
  isLoading: boolean;
  isFailed: boolean;
  total: number;
  currentPage: number;
  skip: number;
  keyword: string;
}

export interface IDetailCCTVState {
  isLoading: boolean;
  isFailed: boolean;
  data: IDetailCCTV | null;
}
