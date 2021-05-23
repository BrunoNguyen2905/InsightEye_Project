import { Action } from "redux";
import * as constants from "../constants";
import { IDetailCCTV } from "../types/listCCTV";

export interface IGetDetailCCTVData {
  isFailed?: boolean;
  isLoading?: boolean;
  data?: IDetailCCTV;
}

export interface ISetDetailCCTV
  extends Action<constants.MANAGEMENT_CCTV_SET_CCTV> {
  payload: IGetDetailCCTVData;
}

export function setDetailCCTV(data: IGetDetailCCTVData): ISetDetailCCTV {
  return {
    type: constants.MANAGEMENT_CCTV_SET_CCTV,
    payload: data
  };
}
