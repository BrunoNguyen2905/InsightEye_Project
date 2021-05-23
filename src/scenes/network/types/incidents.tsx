import { Point } from "geojson";

export interface IPointIncidentGeoJsonProperties {
  id: string;
}

export interface IIncidents {
  address: string;
  incidentDateUtc: string;
  incidentId: string;
  incidentName: string;
  lat: number;
  lon: number;
}

export interface IResultSearchIncidents {
  total: number;
  data: IIncidents[];
  geoJson: GeoJSON.FeatureCollection<Point, IPointIncidentGeoJsonProperties>;
}

export interface IIncidentsSearchResult {
  result: IResultSearchIncidents;
  keyword: string;
  startDateTimeUtc: string;
  endDateTimeUtc: string;
  coordinates: number[][];
  isWithinMap: boolean;
  bound: number[][][];
  timeModified: number;
  currentPage: number;
  limit: number;
  state: {
    isSearching: boolean;
    isFailed: boolean;
  };
}
