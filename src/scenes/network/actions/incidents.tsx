import { Action } from "redux";
import {
  SET_SEARCH_RESULT_INCIDENTS,
  SET_SEARCH_STATE_INCIDENTS,
  SET_SEARCH_CONFIG_INCIDENTS,
  GET_SEARCH_RESULT_INCIDENTS
} from "../constants/incidents";
import { IResultSearchIncidents } from "../types/incidents";

export interface ISetSearchConfigIncidents
  extends Action<SET_SEARCH_CONFIG_INCIDENTS> {
  payload: {
    keyword?: string;
    startDateTimeUtc?: string;
    endDateTimeUtc?: string;
    coordinates?: number[][];
    isWithinMap?: boolean;
    currentPage?: number;
    limit?: number;
    bound?: number[][][];
  };
}

export function setSearchConfigIncidents(config: {
  keyword?: string;
  startDateTimeUtc?: string;
  endDateTimeUtc?: string;
  coordinates?: number[][];
  isWithinMap?: boolean;
  currentPage?: number;
  limit?: number;
  bound?: number[][][];
}): ISetSearchConfigIncidents {
  return {
    type: SET_SEARCH_CONFIG_INCIDENTS,
    payload: {
      ...config
    }
  };
}

export interface ISetSearchStateIncidents
  extends Action<SET_SEARCH_STATE_INCIDENTS> {
  payload: {
    isSearching?: boolean;
    isFailed?: boolean;
  };
  meta: {
    newData: boolean;
  };
}

export function setSearchStateIncidents(
  state: {
    isSearching?: boolean;
    isFailed?: boolean;
  },
  newData?: boolean
): ISetSearchStateIncidents {
  return {
    type: SET_SEARCH_STATE_INCIDENTS,
    payload: {
      ...state
    },
    meta: {
      newData: Boolean(newData)
    }
  };
}

export interface ISetSearchResultIncidents
  extends Action<SET_SEARCH_RESULT_INCIDENTS> {
  payload: IResultSearchIncidents;
}

export function setSearchResultIncidents(
  incidents: IResultSearchIncidents
): ISetSearchResultIncidents {
  return {
    type: SET_SEARCH_RESULT_INCIDENTS,
    payload: incidents
  };
}

export interface IGetSearchResultIncidents
  extends Action<GET_SEARCH_RESULT_INCIDENTS> {}

export function getSearchResultIncidents(): IGetSearchResultIncidents {
  return {
    type: GET_SEARCH_RESULT_INCIDENTS
  };
}
