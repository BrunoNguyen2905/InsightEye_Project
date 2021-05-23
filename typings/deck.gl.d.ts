
declare module 'deck.gl' {

  import * as React from 'react';

  export interface EventInfo<T> { layer: BaseLayer<T>, index: number, object: T, x: number, y: number }
  type HandlerInfo<T> = (info: EventInfo<T>) => boolean;

  interface BaseLayerOptions<T, U = T> {
    id?: string;
    data?: T[] | T;
    visible?: boolean;
    opacity?: number;
    pickable?: boolean;
    onHover?: HandlerInfo<U>;
    onClick?: HandlerInfo<U>;
  }

  interface IconDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
    anchorX?: number;
    anchorY?: number;
    mask?: boolean
  }

  interface IconMapping {
    [key: string]: IconDefinition;
  }

  interface IconLayerOptions<T> extends BaseLayerOptions<T> {
    iconAtlas: string;
    iconMapping: IconMapping;
    sizeScale?: number;
    fp64?: boolean;
    getPosition?: (data: T) => [number, number, number];
    getIcon?: (data: T) => string;
    getSize?: (data: T) => number;
    getColor?: (data: T) => [number, number, number];
    getAngle?: (data: T) => number;
  }

  
  interface LineLayerOptions<T> extends BaseLayerOptions<T> {
    strokeWidth: number;
    getSourcePosition?: (data: any) => [number, number, number];
    getTargetPosition?: (data: any) => [number, number, number];
    getColor?: (data: T) => [number, number, number];
  }
  interface GeoJsonLayerOptions<T, U> extends BaseLayerOptions<T, U> {
    stroked: boolean;
    filled: boolean;
    data: T,
    extruded: boolean;
    lineWidthScale: number;
    lineWidthMinPixels: number;
    getFillColor: (d: U) => [number, number, number, number];
    getLineColor: (d: U) => [number, number, number, number];
    getRadius: (d:U) => number;
    getLineWidth: (d:U) => number;
    getElevation: (d:U) => number;
  }
  interface ScatterplotLayerOptions<T> extends BaseLayerOptions<T> {
    radiusScale?: number;
    outline?: boolean;
    data: T[],
    strokeWidth?:number;
    radiusMinPixels?: number;
    radiusMaxPixels?: number;
    fp64?: boolean;
    getColor?: (d: T) => [number, number, number, number];
    getRadius?: (d:T) => number;
    getPosition?: (d:T) => [number, number];
  }

  export interface MouseEvent<T> {
    layer: any,
    object: T
  }

  export class AbstractLayer { }

  export class BaseLayer<T> extends AbstractLayer {
    constructor(props: BaseLayerOptions<T>);
  }

  export class IconLayer<T> extends BaseLayer<T> {
    constructor(props: IconLayerOptions<T>);
  }
  export class LineLayer<T> extends BaseLayer<T> {
    constructor(props: LineLayerOptions<T>);
  }
  export class GeoJsonLayer<T, U> extends BaseLayer<U> {
    constructor(props: GeoJsonLayerOptions<T, U>);
  }
  export class ScatterplotLayer<T> extends BaseLayer<T> {
    constructor(props: ScatterplotLayerOptions<T>);
  }

  export class MapController {
    public events: string[];
    public handleEvent(event: any):void;
  }

  export interface DeckGLProperties {
    id?: string;
    width: number;
    height: number;
    latitude: number;
    longitude: number;
    zoom: number;
    bearing: number;
    pitch: number;
    layers?: AbstractLayer[];
    style?: React.CSSProperties;
    pickingRadius?: number;
    pixelRatio?: number;
    controller?:typeof MapController;
    onLayerClick?: (info:any, pickedInfo:any, mouseEvent: any) => void;
  }

  export default class DeckGL extends React.Component<DeckGLProperties> { }
}
