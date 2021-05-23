import ICamera from "./Camera";
import { Polygon, LineString, GeoJsonProperties } from "geojson";
import { IIcdClip, IIncidentNote } from "./IncidentInfo";

export type IIncidentLngLat = [number, number];
export default interface IIncidentTransferData {
  cameras: ICamera[];
  paths: GeoJSON.FeatureCollection<Polygon | LineString, GeoJsonProperties>;
  address: string;
  lnglat: IIncidentLngLat;
  incidentDateTimeUtc?: string;
  name?: string;
  note?: string;
  shares?: string[];
  clips?: IIcdClip[];
  notes: IIncidentNote[];
}

export interface IIncidnetOpenIncidentTab {
  cameras: ICamera[];
  paths: GeoJSON.FeatureCollection<Polygon | LineString, GeoJsonProperties>;
  address: string;
  lnglat: IIncidentLngLat;
}
