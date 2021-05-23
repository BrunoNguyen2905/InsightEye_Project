import * as React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Geometry } from "geojson";
import { IPointGeoJsonProperties } from "../../../types/GeoProperties";
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core";
import IStyleProps from "src/styles/utils";
import * as classNames from "classnames";
import { LngLat } from "mapbox-gl";
import MapboxDraw, { DrawEventDelete } from "@mapbox/mapbox-gl-draw";
import {
  InjectedWithDrawTextProps,
  default as withDrawText
} from "src/components/MapDrawText/withDrawText";
import MapDrawText from "src/components/MapDrawText";
import { IIncidentNote } from "../types/IncidentInfo";
import {
  IIncidentDeleteNoteOptions,
  IIncidentDeleteNotePayload,
  IIncidentEditNoteOptions,
  IIncidentEditNotePayload,
  IIncidentSaveNoteOptions,
  IIncidentSaveNotePayload
} from "../actions";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  mapInner: {
    position: "absolute"
  }
});

const GEO_EMPTY_FEATURE: GeoJSON.FeatureCollection<
  Geometry,
  IPointGeoJsonProperties
> = {
  type: "FeatureCollection",
  features: []
};

interface IState {
  lat: number;
  lng: number;
  zoom: number;
}

export interface IMapboxLocation {
  lng: number;
  lat: number;
}

export interface IMapboxLayer {
  id: string;
  type: "symbol" | "fill" | "line";
  layout?: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          type: "identity";
          property: string;
        };
  };
  paint?: { [key: string]: string | number };
}

export interface IMapBoxOptions {
  center: IMapboxLocation;
  zoom: number;
  layers?: mapboxgl.Layer[];
  data: {
    [key: string]: GeoJSON.FeatureCollection;
  };
  children?: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
}

interface IMapBoxProps extends IMapBoxOptions, InjectedWithDrawTextProps {
  notes: IIncidentNote[];
  incidentId: string;
  onSaveDrawText: (
    payload: IIncidentSaveNotePayload,
    options: IIncidentSaveNoteOptions
  ) => void;
  onEditDrawText: (
    payload: IIncidentEditNotePayload,
    options: IIncidentEditNoteOptions
  ) => void;
  onDeleteDrawText: (
    payload: IIncidentDeleteNotePayload,
    options: IIncidentDeleteNoteOptions
  ) => void;
}

class MapBox extends React.Component<IStyleProps & IMapBoxProps, IState> {
  private mapContainer: any;
  private map: mapboxgl.Map;
  private draw: MapboxDraw;

  constructor(props: IMapBoxProps & IStyleProps) {
    super(props);
    this.mapContainer = React.createRef();
    this.state = {
      lng: props.center.lng,
      lat: props.center.lat,
      zoom: props.zoom
    };
  }

  private loadMapAsset = (link: string, name: string): Promise<string> => {
    return new Promise(resolve => {
      this.map.loadImage(link, (error: any, image: HTMLImageElement) => {
        this.map.addImage(name, image);
        resolve(name);
      });
    });
  };

  public componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "/3d_building_style.json",
      center: [lng, lat],
      zoom
    });

    this.map.addControl(new mapboxgl.NavigationControl(), "top-left");

    this.draw = new MapboxDraw({
      controls: {
        line_string: false,
        polygon: false,
        point: true,
        uncombine_features: false,
        combine_features: false
      }
    });

    this.map.addControl(this.draw, "top-left");

    this.map.on("load", () => {
      Promise.all([
        this.loadMapAsset(
          require("src/assets/images/marker/camera.png"),
          "camera"
        ),
        this.loadMapAsset(
          require("src/assets/images/marker/camera-vehicle.png"),
          "camera-vehicle"
        ),
        this.loadMapAsset(
          require("src/assets/images/marker/camera-360.png"),
          "camera-360"
        )
      ]).then(() => {
        (this.props.layers || []).forEach(layer => {
          this.map.addSource(layer.id, {
            type: "geojson",
            data: GEO_EMPTY_FEATURE
          });
          this.map.addLayer({
            ...layer,
            source: layer.id
          });
          this.updateData();
          this.props.setUpEventDrawText(this.map, this.draw);
          if (this.props.notes && this.props.notes.length > 0) {
            this.props.setDrawCanvasText(this.props.notes, this.draw, this.map);
          }
        });
      });
      this.map.on("draw.delete", this.onDeleteDraw);
    });
  }

  private updateData() {
    Object.keys(this.props.data).forEach(dataKey => {
      const source = this.map.getSource(dataKey) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(this.props.data[dataKey]);
      }
    });
    this.map.setCenter(
      new LngLat(this.props.center.lng, this.props.center.lat)
    );
  }

  private onChangeDrawText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    this.props.drawText(this.props.selectedDrawText, target.value);
  };

  private onSaveDrawText = (inputs: any, reset: (should: boolean) => void) => {
    const selectedDraw = this.props.currentDrawText.find(draw => {
      return draw.id === this.props.selectedDrawText;
    });
    if (selectedDraw) {
      if (this.props.notes.find(note => note.id === selectedDraw.id)) {
        this.props.onEditDrawText(
          {
            bearing: selectedDraw.properties.bearing,
            content: selectedDraw.properties.text,
            incidentId: this.props.incidentId,
            noteId: selectedDraw.id as string,
            lon: selectedDraw.properties.startPoint[0],
            lat: selectedDraw.properties.startPoint[1]
          },
          {
            done: () => {
              reset(false);
            }
          }
        );
      } else {
        this.props.onSaveDrawText(
          {
            bearing: selectedDraw.properties.bearing,
            content: selectedDraw.properties.text,
            incidentId: this.props.incidentId,
            lon: selectedDraw.properties.startPoint[0],
            lat: selectedDraw.properties.startPoint[1]
          },
          {
            done: (success, data) => {
              if (success && data) {
                this.props.deleteCanvasDrawText(this.props.selectedDrawText);
                this.props.setDrawCanvasText(
                  [
                    {
                      id: data.id,
                      bearing: selectedDraw.properties.bearing,
                      content: selectedDraw.properties.text,
                      lon: selectedDraw.properties.startPoint[0],
                      lat: selectedDraw.properties.startPoint[1]
                    }
                  ],
                  this.draw,
                  this.map
                );
                this.props.setSelectedDrawText(data.id);
              }
              reset(false);
            }
          }
        );
      }
    }
  };

  private onDeleteDraw = (e: DrawEventDelete) => {
    if (e.features.length > 0) {
      const feature = e.features[0];
      if (feature.geometry.type === "Point") {
        const noteFound = this.props.notes.find(note => note.id === feature.id);
        if (noteFound) {
          this.props.onDeleteDrawText(
            {
              incidentId: this.props.incidentId,
              noteId: noteFound.id
            },
            {
              done: (success: boolean) => {
                if (success) {
                  this.props.deleteCanvasDrawText(noteFound.id);
                }
              }
            }
          );
        } else {
          this.props.deleteCanvasDrawText(feature.id);
        }
      }
    }
  };

  public componentDidUpdate(prevProps: IMapBoxOptions, prevState: IState) {
    this.updateData();
  }

  public render() {
    return (
      <div className="map">
        <div
          ref={this.mapContainer}
          className={classNames(this.props.classes.mapInner, "map-inner")}
        />
        {this.props.children && this.props.children}
        {this.props.selectedDrawText &&
          this.props.currentDrawText.map(current => {
            if (current.id === this.props.selectedDrawText) {
              return (
                <MapDrawText
                  key={current.id}
                  value={current.properties.text}
                  onChange={this.onChangeDrawText}
                  onSave={this.onSaveDrawText}
                />
              );
            }
            return;
          })}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withDrawText(MapBox));
