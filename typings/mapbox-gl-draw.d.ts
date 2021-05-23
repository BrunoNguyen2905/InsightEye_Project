declare module "@mapbox/mapbox-gl-draw" {
  import { FeatureCollection, Feature } from "geojson";
  export type DrawMode =
    | "draw_point"
    | "draw_line_string"
    | "draw_polygon"
    | "simple_select"
    | "direct_select";
  export interface DrawFeatureGeometryPolygon {
    type: "Polygon";
    coordinates: number[][][];
  }

  export interface DrawFeatureGeometryLineString {
    type: "LineString";
    coordinates: number[][];
  }

  export interface DrawFeatureGeometryPoint {
    type: "Point";
    coordinates: number[];
  }

  export interface DrawFeature<
    P =
      | DrawFeatureGeometryPolygon
      | DrawFeatureGeometryLineString
      | DrawFeatureGeometryPoint
  > {
    id: string;
    properties: { [k: string]: any };
    type: string;
    geometry: P;
  }

  export interface DrawEventCreate<
    P =
      | DrawFeatureGeometryPolygon
      | DrawFeatureGeometryLineString
      | DrawFeatureGeometryPoint
  > {
    features: Array<DrawFeature<P>>;
    target: any;
    type: "draw.create";
  }

  export interface DrawEventUpdate<
    P =
      | DrawFeatureGeometryPolygon
      | DrawFeatureGeometryLineString
      | DrawFeatureGeometryPoint
  > {
    action: "move" | "change_coordinates";
    features: Array<DrawFeature<P>>;
    target: any;
    type: "draw.update";
  }

  export interface DrawEventModeChange {
    mode: DrawMode;
    target: any;
    type: "draw.modechange";
  }

  export interface DrawEventSelectionChange<
    P =
      | DrawFeatureGeometryPolygon
      | DrawFeatureGeometryLineString
      | DrawFeatureGeometryPoint
  > {
    features: Array<DrawFeature<P>>;
    type: "draw.selectionchange";
  }

  export interface DrawEventDelete<
    P =
      | DrawFeatureGeometryPolygon
      | DrawFeatureGeometryLineString
      | DrawFeatureGeometryPoint
  > {
    features: Array<DrawFeature<P>>;
    target: any;
    type: "draw.delete";
  }

  interface options {
    controls?: {
      combine_features?: Boolean;
      uncombine_features?: Boolean;
      trash?: Boolean;
      polygon?: Boolean;
      point?: Boolean;
      line_string?: Boolean;
    };
  }

  export class MapboxDraw {
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    getDefaultPosition(): string;
    constructor(options?: options);

    get(featureId: string): DrawFeature;

    add(featureCollection: Feature): string[];

    delete(id: string | string[]): MapboxDraw;

    getMode(): DrawMode;
    changeMode(
      mode: DrawMode,
      options?: {
        featureIds?: string[];
        featureId?: string;
      }
    ): MapboxDraw;
  }
  export default MapboxDraw;
}
