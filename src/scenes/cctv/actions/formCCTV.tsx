import { Action } from "redux";
import * as constants from "../constants";
import { CameraType } from "../../../types/Camera";

export interface ICreateCCTVData {
  hidden: boolean;
  coveragePolygonJsonString: string;
  pointName: string;
  address: string;
  longitude: number;
  latitude: number;
  bearing: number;
  fieldOfView: number;
  lengthOfFOV: number;
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
  vehicleMacAddress?: string;
}

export interface IEditCCTVData {
  hidden: boolean;
  coveragePolygonJsonString: string;
  pointName: string;
  address: string;
  longitude: number;
  latitude: number;
  bearing: number;
  fieldOfView: number;
  lengthOfFOV: number;
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
  vehicleMacAddress?: string;
}

interface ICreateCCTVMeta {
  cb: (success: boolean) => void;
}

interface IEditCCTVMeta {
  cb: (success: boolean) => void;
}

export interface ICreateCCTV
  extends Action<constants.MANAGEMENT_CCTV_CREATE_CCTV> {
  payload: ICreateCCTVData;
  meta: ICreateCCTVMeta | undefined;
}

export function createCCTV(
  data: ICreateCCTVData,
  meta: ICreateCCTVMeta | undefined
): ICreateCCTV {
  return {
    type: constants.MANAGEMENT_CCTV_CREATE_CCTV,
    payload: data,
    meta
  };
}

export interface IEditCCTV extends Action<constants.MANAGEMENT_CCTV_EDIT_CCTV> {
  payload: ICreateCCTVData;
  meta: ICreateCCTVMeta | undefined;
}

export function editCCTV(
  data: IEditCCTVData,
  meta: IEditCCTVMeta | undefined
): IEditCCTV {
  return {
    type: constants.MANAGEMENT_CCTV_EDIT_CCTV,
    payload: data,
    meta
  };
}

export interface IGetDetailCCTV
  extends Action<constants.MANAGEMENT_CCTV_GET_CCTV> {
  payload: string;
}

export function getDetailCCTV(pointid: string): IGetDetailCCTV {
  return {
    type: constants.MANAGEMENT_CCTV_GET_CCTV,
    payload: pointid
  };
}
