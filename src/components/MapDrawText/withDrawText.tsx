import { Subtract } from "utility-types";
import * as React from "react";
import { point } from "@turf/helpers";
import * as mapboxgl from "mapbox-gl";
import {
  DrawEventCreate,
  // DrawEventDelete,
  DrawEventSelectionChange,
  DrawEventUpdate,
  DrawFeature,
  DrawFeatureGeometryPoint,
  default as MapboxDraw
} from "@mapbox/mapbox-gl-draw";
import { Feature, FeatureCollection, LineString, Position } from "geojson";
import destination from "@turf/destination";

export interface INote {
  id: string;
  content: string;
  lat: number;
  lon: number;
  bearing: number;
}

export type CreateCanvasDrawText = (
  feature: {
    id: string;
    coordinates: number[];
    text: string;
    bearing?: number;
  },
  map: mapboxgl.Map,
  draw: MapboxDraw
) => void;

export type UpdateCanvasDrawText = (
  feature: { id: string; coordinates: number[]; bearing?: number },
  map: mapboxgl.Map
) => void;

export type SetDrawCanvasText = (
  data: INote[],
  draw: MapboxDraw,
  map: mapboxgl.Map
) => void;

export type SetSelectedDrawText = (id: string) => void;

export type DeleteDrawCanvasText = (id: string) => void;

export type DrawText = (id: string, text: string) => void;

export type SetupEvent = (map: mapboxgl.Map, draw: MapboxDraw) => void;

export interface InjectedWithDrawTextProps {
  currentDrawText: Array<Feature<LineString, IDrawJsonTextProperties>>;
  createCanvasDrawText: CreateCanvasDrawText;
  updateCanvasDrawText: UpdateCanvasDrawText;
  drawText: DrawText;
  setUpEventDrawText: SetupEvent;
  selectedDrawText: string;
  setSelectedDrawText: SetSelectedDrawText;
  setDrawCanvasText: SetDrawCanvasText;
  deleteCanvasDrawText: DeleteDrawCanvasText;
}

interface IWithDrawTextStates {
  currentDrawText: Array<Feature<LineString, IDrawJsonTextProperties>>;
  selectedDrawText: string;
}

export interface IDrawJsonTextProperties {
  id: string;
  bearing: number;
  text: string;
  startPoint: Position;
  pointPolyline: Position[];
  pointCanvas: Position[];
}

const withDrawText = <P extends InjectedWithDrawTextProps>(
  Component: React.ComponentType<P>
) =>
  class WithDrawText extends React.Component<
    Subtract<P, InjectedWithDrawTextProps>,
    IWithDrawTextStates
  > {
    public state: IWithDrawTextStates = {
      currentDrawText: [] as Array<
        Feature<LineString, IDrawJsonTextProperties>
      >,
      selectedDrawText: ""
    };

    private map: mapboxgl.Map;
    private draw: MapboxDraw;

    private createCanvasDrawText: CreateCanvasDrawText = (
      { coordinates, id, text, bearing },
      map,
      draw
    ) => {
      const startPoint = point(coordinates);
      const distance = 100;
      let bearingFinal = bearing || Math.round(map.getBearing() + 180);
      if (bearingFinal > 360) {
        bearingFinal -= 360;
      }

      const destination1 = destination(startPoint, distance, bearingFinal, {
        units: "meters"
      });
      const destination2 = destination(
        startPoint,
        distance + 800,
        bearingFinal,
        {
          units: "meters"
        }
      );

      const destinationA1 = destination(destination1, 600, bearingFinal - 90, {
        units: "meters"
      });
      const destinationA4 = destination(destination1, 600, bearingFinal + 90, {
        units: "meters"
      });
      const destinationA2 = destination(destination2, 600, bearingFinal - 90, {
        units: "meters"
      });
      const destinationA3 = destination(destination2, 600, bearingFinal + 90, {
        units: "meters"
      });

      if (
        destinationA1.geometry &&
        destinationA2.geometry &&
        destinationA3.geometry &&
        destinationA4.geometry
      ) {
        const coordinateForPolyline = [
          destinationA1.geometry.coordinates,
          destinationA2.geometry.coordinates,
          destinationA3.geometry.coordinates,
          destinationA4.geometry.coordinates,
          destinationA1.geometry.coordinates
        ];

        const coordinateForCanvas = [
          destinationA4.geometry.coordinates,
          destinationA1.geometry.coordinates,
          destinationA2.geometry.coordinates,
          destinationA3.geometry.coordinates
        ];

        const newDrawText: Feature<LineString, IDrawJsonTextProperties> = {
          type: "Feature",
          properties: {
            startPoint: coordinates,
            id,
            text,
            bearing: bearingFinal,
            pointCanvas: coordinateForCanvas,
            pointPolyline: coordinateForPolyline
          },
          id,
          geometry: {
            type: "LineString",
            coordinates: coordinateForPolyline
          }
        };

        this.setState(
          {
            currentDrawText: this.state.currentDrawText.concat([newDrawText])
          },
          () => {
            (map.getSource(
              "poliLineForText"
            ) as mapboxgl.GeoJSONSource).setData({
              type: "FeatureCollection",
              features: this.state.currentDrawText
            });
          }
        );

        const newCanvas = document.createElement("canvas");
        newCanvas.setAttribute("id", "canvas_" + id);
        newCanvas.style.display = "none";
        document.body.appendChild(newCanvas);

        const newCtx = newCanvas.getContext("2d");
        const height = 400;
        const width = 600;
        if (newCtx) {
          newCtx.canvas.height = height;
          newCtx.canvas.width = width;
          newCtx.clearRect(0, 0, width, height);
          newCtx.font = "normal normal normal 30px arial";
          newCtx.fillStyle = "red";
          const lines = text.split("\n");
          const fontSize = 30;
          for (let i = 0; i < lines.length; i++) {
            newCtx.fillText(lines[i], 10, 5 + (i + 1) * fontSize);
          }

          (map.addSource as (id: string, source: any) => void)("canvas_" + id, {
            type: "canvas",
            canvas: "canvas_" + id,
            coordinates: coordinateForCanvas
          });
          map.addLayer({
            id: "canvas_" + id,
            source: "canvas_" + id,
            type: "raster"
          });
        }

        if (!draw.get("id")) {
          draw.add({
            type: "Feature",
            properties: {},
            id,
            geometry: {
              type: "Point",
              coordinates
            }
          });
        }
      }
    };

    private updateCanvasDrawText: UpdateCanvasDrawText = (
      { id, coordinates, bearing },
      map
    ) => {
      if (this.state.currentDrawText.length > 0) {
        let bearingFinal = bearing || Math.round(map.getBearing() + 180);

        const startPoint = point(coordinates);

        const distance = 100;

        if (bearingFinal > 360) {
          bearingFinal -= 360;
        }

        const destination1 = destination(startPoint, distance, bearingFinal, {
          units: "meters"
        });
        const destination2 = destination(
          startPoint,
          distance + 800,
          bearingFinal,
          {
            units: "meters"
          }
        );

        const destinationA1 = destination(
          destination1,
          600,
          bearingFinal - 90,
          {
            units: "meters"
          }
        );
        const destinationA4 = destination(
          destination1,
          600,
          bearingFinal + 90,
          {
            units: "meters"
          }
        );
        const destinationA2 = destination(
          destination2,
          600,
          bearingFinal - 90,
          {
            units: "meters"
          }
        );
        const destinationA3 = destination(
          destination2,
          600,
          bearingFinal + 90,
          {
            units: "meters"
          }
        );

        if (
          destinationA1.geometry &&
          destinationA2.geometry &&
          destinationA3.geometry &&
          destinationA4.geometry
        ) {
          const coordinateForPolyline = [
            destinationA1.geometry.coordinates,
            destinationA2.geometry.coordinates,
            destinationA3.geometry.coordinates,
            destinationA4.geometry.coordinates,
            destinationA1.geometry.coordinates
          ];
          const coordinateForCanvas = [
            destinationA4.geometry.coordinates,
            destinationA1.geometry.coordinates,
            destinationA2.geometry.coordinates,
            destinationA3.geometry.coordinates
          ];
          (map.getSource("canvas_" + id) as any).setCoordinates(
            coordinateForCanvas
          );

          this.setState(
            {
              currentDrawText: this.state.currentDrawText.reduce(
                (current, draw) => {
                  if (draw.id === id) {
                    current.push({
                      type: "Feature",
                      properties: {
                        startPoint: coordinates,
                        id,
                        text: draw.properties.text,
                        bearing: bearingFinal,
                        pointCanvas: coordinateForCanvas,
                        pointPolyline: coordinateForPolyline
                      },
                      id,
                      geometry: {
                        type: "LineString",
                        coordinates: coordinateForPolyline
                      }
                    });
                  } else {
                    current.push(draw);
                  }
                  return current;
                },
                [] as Array<Feature<LineString, IDrawJsonTextProperties>>
              )
            },
            () => {
              (map.getSource(
                "poliLineForText"
              ) as mapboxgl.GeoJSONSource).setData({
                type: "FeatureCollection",
                features: this.state.currentDrawText
              });
            }
          );
        }
      }
    };

    private drawText: DrawText = (id, text) => {
      this.setState(
        {
          currentDrawText: this.state.currentDrawText.reduce(
            (current, draw) => {
              if (draw.id === this.state.selectedDrawText) {
                current.push({
                  type: "Feature",
                  properties: {
                    ...draw.properties,
                    text
                  },
                  id: this.state.selectedDrawText,
                  geometry: draw.geometry
                });
              } else {
                current.push(draw);
              }
              return current;
            },
            [] as Array<Feature<LineString, IDrawJsonTextProperties>>
          )
        },
        () => {
          const drawCanvas = document.getElementById(
            "canvas_" + id
          ) as HTMLCanvasElement;
          const ctx = drawCanvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "normal normal normal 40px arial";
            ctx.fillStyle = "red";
            const lines = text.split("\n");
            const fontSize = 40;
            for (let i = 0; i < lines.length; i++) {
              ctx.fillText(lines[i], 10, 5 + (i + 1) * fontSize);
            }
          }
        }
      );
    };

    private setUpEvent: SetupEvent = (map, draw) => {
      this.map = map;
      this.draw = draw;
      if (!this.map.getSource("poliLineForText")) {
        map.addSource("poliLineForText", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [] as Array<Feature<LineString>>
          } as FeatureCollection<LineString>
        });

        map.addLayer({
          id: "poliLineForText",
          type: "line",
          source: "poliLineForText",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#FC4242",
            "line-width": 4
          }
        });
        map.on("draw.create", this.onDraw);
        map.on("draw.update", this.onDrawChange);
        // map.on("draw.delete", this.onDeleteDraw);
        map.on("draw.selectionchange", this.onDrawSelectionChange);
      }
    };

    private deleteCanvasDrawText = (id: string) => {
      this.draw.delete(id);
      const canvas = document.getElementById("canvas_" + id);
      if (canvas) {
        canvas.remove();
      }
      this.map.removeLayer("canvas_" + id);
      this.map.removeSource("canvas_" + id);
      this.setState(
        {
          selectedDrawText: "",
          currentDrawText: this.state.currentDrawText.reduce(
            (current, draw) => {
              if (draw.id !== id) {
                current.push(draw);
              }
              return current;
            },
            [] as Array<Feature<LineString, IDrawJsonTextProperties>>
          )
        },
        () => {
          (this.map.getSource(
            "poliLineForText"
          ) as mapboxgl.GeoJSONSource).setData({
            type: "FeatureCollection",
            features: this.state.currentDrawText
          });
        }
      );
    };

    private onDraw = (e: DrawEventCreate) => {
      const feature = e.features[0];
      if (feature.geometry.type === "Point") {
        const featurePoint = feature as DrawFeature<DrawFeatureGeometryPoint>;
        this.createCanvasDrawText(
          {
            id: featurePoint.id,
            coordinates: featurePoint.geometry.coordinates,
            text: ""
          },
          this.map,
          this.draw
        );
      }
    };

    private onDrawChange = (e: DrawEventUpdate) => {
      const feature = e.features[0];
      const type = feature.geometry.type;
      if (type === "Point") {
        const featurePoint = feature as DrawFeature<DrawFeatureGeometryPoint>;
        this.updateCanvasDrawText(
          {
            id: featurePoint.id,
            coordinates: featurePoint.geometry.coordinates
          },
          this.map
        );
      }
    };

    // private onDeleteDraw = (e: DrawEventDelete) => {
    //   if (e.features.length > 0) {
    //     const feature = e.features[0];
    //     if (feature.geometry.type === "Point") {
    //       this.deleteCanvasDrawText(feature.id);
    //     }
    //   }
    // };

    private onDrawSelectionChange = (e: DrawEventSelectionChange) => {
      if (e.features.length > 0) {
        const feature = e.features[0];
        if (feature.geometry.type === "Point") {
          this.setState({
            selectedDrawText: feature.id
          });
        }
      } else {
        this.setState({
          selectedDrawText: ""
        });
      }
    };

    private setDrawCanvasText: SetDrawCanvasText = (data, draw, map) => {
      data.forEach(note => {
        if (document.getElementById("canvas_" + note.id)) {
          this.updateCanvasDrawText(
            {
              id: note.id,
              coordinates: [note.lon, note.lat],
              bearing: note.bearing
            },
            map
          );
        } else {
          this.createCanvasDrawText(
            {
              id: note.id,
              coordinates: [note.lon, note.lat],
              text: note.content,
              bearing: note.bearing
            },
            map,
            draw
          );
        }
      });
    };

    private setSelectedDrawText: SetSelectedDrawText = id => {
      this.setState({
        selectedDrawText: id
      });
      this.draw.changeMode("simple_select", { featureIds: [id] });
    };

    public componentWillUnmount() {
      this.state.currentDrawText.forEach(draw => {
        const canvas = document.getElementById("canvas_" + draw.id);
        if (canvas) {
          canvas.remove();
        }
      });
    }

    public render() {
      return (
        <Component
          {...this.props}
          selectedDrawText={this.state.selectedDrawText}
          setSelectedDrawText={this.setSelectedDrawText}
          setUpEventDrawText={this.setUpEvent}
          setDrawCanvasText={this.setDrawCanvasText}
          currentDrawText={this.state.currentDrawText}
          createCanvasDrawText={this.createCanvasDrawText}
          updateCanvasDrawText={this.updateCanvasDrawText}
          deleteCanvasDrawText={this.deleteCanvasDrawText}
          drawText={this.drawText}
        />
      );
    }
  };

export default withDrawText;
