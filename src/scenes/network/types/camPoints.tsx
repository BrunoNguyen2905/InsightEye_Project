import {
  IPointGeoJsonProperties,
  ICoverageGeoJsonProperties
} from "./GeoProperties";
import { Point, Polygon } from "geojson";

export enum SearchMode {
  CCTV = "cctv",
  INCIDENT = "job"
}

export interface ICamPoints {
  points: GeoJSON.FeatureCollection<Point, IPointGeoJsonProperties>;
  coverages: GeoJSON.FeatureCollection<Polygon, ICoverageGeoJsonProperties>;
  isLoading: boolean;
  isFailed: boolean;
  timeModified: number;
}

export interface ISearchResultCamPoints {
  result: string[];
  keyword: string;
  isWithinMap: boolean;
  timeModified: number;
  currentPage: number;
  limit: number;
}

export interface ISearchMode {
  mode: SearchMode;
  active: boolean;
}
