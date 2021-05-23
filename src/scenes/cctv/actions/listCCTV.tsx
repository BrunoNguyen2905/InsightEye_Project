import { ICCTV } from "../types/listCCTV";
import * as constants from "../constants";
import { Action } from "redux";

export interface ISetListCCTV
  extends Action<constants.MANAGEMENT_CCTV_SET_LIST_CCTV> {
  payload: ICCTV[];
}

export function setListCCTV(list: ICCTV[]): ISetListCCTV {
  return {
    type: constants.MANAGEMENT_CCTV_SET_LIST_CCTV,
    payload: list
  };
}

interface IGetListCCTVOptions {
  keyword?: string;
  page?: number;
  skip?: number;
}

export interface IGetListCCTV
  extends Action<constants.MANAGEMENT_CCTV_GET_LIST_CCTV> {
  payload?: IGetListCCTVOptions;
}

export function getListCCTV(options?: IGetListCCTVOptions): IGetListCCTV {
  return {
    type: constants.MANAGEMENT_CCTV_GET_LIST_CCTV,
    payload: options
  };
}

interface ISetListCCTVStateOptions {
  isLoading?: boolean;
  isFailed?: boolean;
  total?: number;
  currentPage?: number;
  skip?: number;
  keyword?: string;
}

export interface ISetListCCTVState
  extends Action<constants.MANAGEMENT_CCTV_SET_LIST_CCTV_STATE> {
  payload: ISetListCCTVStateOptions;
}

export function setListCCTVState(
  state: ISetListCCTVStateOptions
): ISetListCCTVState {
  return {
    type: constants.MANAGEMENT_CCTV_SET_LIST_CCTV_STATE,
    payload: state
  };
}
