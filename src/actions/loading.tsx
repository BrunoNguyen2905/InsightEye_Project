import { Action } from "redux";
import { API_LOADING_SET, API_LOADING_UNSET } from "../constants/loading";

export interface ISetApiLoading extends Action<API_LOADING_SET> {
  payload: string;
}

export function setApiLoading(api: string): ISetApiLoading {
  return {
    payload: api,
    type: API_LOADING_SET
  };
}

export interface IUnsetApiLoading extends Action<API_LOADING_UNSET> {
  payload: string;
}

export function unsetApiLoading(api: string): IUnsetApiLoading {
  return {
    payload: api,
    type: API_LOADING_UNSET
  };
}
