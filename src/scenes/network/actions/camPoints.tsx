import { Action } from "redux";
import {
  GET_CAM_POINTS,
  SET_CAM_POINTS,
  SET_SEARCH_RESULT_CAM_POINTS,
  SET_SEARCH_MODE_MAIN_MAP,
  UPDATE_CAM_POINTS
} from "../constants/camPoints";
import {
  IPointGeoJsonProperties,
  ICoverageGeoJsonProperties,
  IPointLocation
} from "../types/GeoProperties";
import { Point, Polygon } from "geojson";
import { SearchMode } from "../types/camPoints";

export interface IGetCamPoints extends Action<GET_CAM_POINTS> {}

export function getCamPoints(): IGetCamPoints {
  return {
    type: GET_CAM_POINTS
  };
}
export interface ISetCamPointData {
  points?: GeoJSON.FeatureCollection<Point, IPointGeoJsonProperties>;
  coverages?: GeoJSON.FeatureCollection<Polygon, ICoverageGeoJsonProperties>;
  isLoading?: boolean;
  isFailed?: boolean;
}

export interface ISetCamPointPayload extends ISetCamPointData {
  timeModified?: number;
}

export interface ISetCamPoints extends Action<SET_CAM_POINTS> {
  payload: ISetCamPointPayload;
}
export function setCamPoints(
  data: ISetCamPointData,
  modified?: boolean
): ISetCamPoints {
  return {
    type: SET_CAM_POINTS,
    payload: modified
      ? {
          ...data,
          timeModified: new Date().getTime()
        }
      : data
  };
}

export interface IUpdateCamPoint extends Action<UPDATE_CAM_POINTS> {
  payload: IPointLocation[];
}

export function updateCamPoint(listPoints: IPointLocation[]): IUpdateCamPoint {
  return {
    type: UPDATE_CAM_POINTS,
    payload: listPoints
  };
}

export interface ISetSearchResultCamPointsPayload extends ISetCamPointData {
  result?: string[];
  keyword?: string;
  isWithinMap?: boolean;
  timeModified?: number;
  currentPage?: number;
  limit?: number;
}

export interface ISetSearchResultCamPoints
  extends Action<SET_SEARCH_RESULT_CAM_POINTS> {
  payload: ISetSearchResultCamPointsPayload;
}

export function setSearchResultCamPoints(
  data: {
    result?: string[];
    keyword?: string;
  },
  modified?: boolean
): ISetSearchResultCamPoints {
  return {
    type: SET_SEARCH_RESULT_CAM_POINTS,
    payload: modified
      ? {
          ...data,
          timeModified: new Date().getTime()
        }
      : data
  };
}

export interface ISetSearchMode extends Action<SET_SEARCH_MODE_MAIN_MAP> {
  payload: {
    active?: boolean;
    mode?: SearchMode;
  };
}

export function setSearchMode(data: {
  active?: boolean;
  mode?: SearchMode;
}): ISetSearchMode {
  return {
    type: SET_SEARCH_MODE_MAIN_MAP,
    payload: data
  };
}
