import * as React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import destination from "@turf/destination";
import { point as pointTurf } from "@turf/helpers";
import { fieldOfView } from "field-of-view";
import { Geometry, GeometryCollection } from "@turf/helpers/lib/geojson";
import ListCCTVContainer from "../containers/ListCCTVContainer";
import FormControlCCTV from "../containers/FormCCTVContainer";
import SideMapPopUp from "./SideMapPopUp";
import { GeoCodingService } from "../../../helpers/GeoCodingService";
import SearchLocation from "src/components/SearchLocation";
import { debounce } from "lodash-es";
import turfCircle from "@turf/circle";
import { CameraType } from "../../../types/Camera";
import { ILib, IPlan } from "../../lib/types/libs";
import ConfirmDialog from "../../../components/Dialog/Confirm";
import links from "../../../links";

function getPointLists(
  angle: number,
  startPointGeometry: GeoJSON.Feature<GeoJSON.Point>,
  targetPointGeometry: GeoJSON.Feature<GeoJSON.Point>
) {
  const cameraTarget = {
    type: "Feature",
    properties: {
      angle
    },
    geometry: {
      type: "GeometryCollection",
      geometries: [startPointGeometry.geometry, targetPointGeometry.geometry]
    }
  };

  const fov = fieldOfView.fromFeature(cameraTarget);

  return {
    angle: fov.properties.angle,
    bearing: fov.properties.bearing,
    distance: fov.properties.distance,
    points: [
      [
        fov.geometry.geometries[1].coordinates[0][0],
        fov.geometry.geometries[1].coordinates[0][1]
      ],
      [
        fov.geometry.geometries[0].coordinates[0],
        fov.geometry.geometries[0].coordinates[1]
      ],
      [
        fov.geometry.geometries[1].coordinates[1][0],
        fov.geometry.geometries[1].coordinates[1][1]
      ]
    ]
  };
}

function getPointListBy3Point(
  startPointGeometry: Geometry | GeometryCollection,
  targetPointGeometry: Geometry | GeometryCollection,
  anglePointGeomtry: Geometry | GeometryCollection
) {
  const points = {
    type: "Feature",
    geometry: {
      type: "GeometryCollection",
      geometries: [startPointGeometry, targetPointGeometry, anglePointGeomtry]
    }
  };

  const fov = fieldOfView.fromFeature(points);

  return {
    distance: fov.properties.distance,
    angle: fov.properties.angle,
    bearing: fov.properties.bearing,
    points: [
      [
        fov.geometry.geometries[1].coordinates[0][0],
        fov.geometry.geometries[1].coordinates[0][1]
      ],
      [
        fov.geometry.geometries[0].coordinates[0],
        fov.geometry.geometries[0].coordinates[1]
      ],
      [
        fov.geometry.geometries[1].coordinates[1][0],
        fov.geometry.geometries[1].coordinates[1][1]
      ]
    ]
  };
}

enum SourcePointId {
  StartPoint = "startPoint",
  AnglePoint = "anglePoint",
  TargetPoint = "targetPoint",
  Coverage = "coverage",
  Camera = "camera",
  CameraPoint = "cameraPoint",
  Marker = "marker",
  MarkerTargetPoint = "markerTargetPoint",
  MarkerAnglePoint = "markerAnglePoint",
  StartPointPreview = "startPointPreview",
  CoveragePreview = "coveragePreview"
}

interface IPointData {
  startPoint: number[];
  destPoint: number[];
  anglePoint: number[];
  bearing: number;
  angle: number;
  coverage: number[][][];
  distance: number;
  timeModified: number;
  isPtz: boolean;
}

interface IPointDataPreview {
  type: CameraType;
  bearing: number;
  startPoint: number[];
  coverage: number[][][];
  timeModified: number;
  isPtz: boolean;
  lengthOfFOV: number;
}

interface IStates {
  isOpenEdit: boolean;
  isOpenCreate: boolean;
  isLoadedMap: boolean;
  angle: number;
  lat: number;
  lng: number;
  zoom: number;
  startCoordinate: number[];
  destCoordinate: number[];
  pointData?: IPointData;
  pointType: CameraType;
  pointDataAddress: string;
  pointDataPreview?: IPointDataPreview;
  isOpenLimitCreateCamera: boolean;
}

const emptyFeature = {
  type: "FeatureCollection",
  features: []
};

function createCoverage(id: string, source: string) {
  return {
    id,
    type: "fill",
    source,
    layout: {},
    paint: {
      "fill-color": "#3388ff",
      "fill-opacity": 0.2
    }
  };
}

function createPoint(id: string, source: string) {
  return {
    id,
    type: "circle",
    source,
    paint: {
      "circle-radius": 10,
      "circle-color": "transparent"
    }
  };
}

function createIconPoint(id: string, source: string, image: string) {
  return {
    id,
    type: "symbol",
    source,
    layout: {
      "icon-image": image,
      "icon-size": 0.5,
      "icon-allow-overlap": true,
      "icon-rotation-alignment": "map"
    }
  };
}

interface IProps {
  selectedLib: ILib | null;
  totalCCTV: number;
}

class Mapbox extends React.Component<IProps, IStates> {
  private mapContainer: any;
  private ismounted: boolean;
  private map: any;

  private debounceCallGeoService = debounce((cb: () => void) => {
    cb();
  }, 250);

  constructor(props: any) {
    super(props);
    this.mapContainer = React.createRef();
    this.ismounted = true;
    this.state = {
      isOpenLimitCreateCamera: false,
      pointType: CameraType.CCTV,
      pointDataAddress: "",
      isOpenEdit: false,
      isOpenCreate: false,
      angle: 60,
      isLoadedMap: false,
      lng: 153.01901480293256,
      lat: -27.790208884355184,
      startCoordinate: [153.01901480293256, -27.790208884355184],
      destCoordinate: [0, 0],
      zoom: 17
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

  public componentWillUnmount() {
    this.ismounted = false;
  }

  public componentDidMount() {
    const { zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "/3d_building_style.json",
      center: [139.4927085, -20.7255748],
      zoom
    });

    const map = this.map;

    map.addControl(new mapboxgl.NavigationControl(), "top-left");

    map.on("load", () => {
      if (this.ismounted) {
        map.addSource(SourcePointId.StartPoint, {
          type: "geojson",
          data: emptyFeature
        });
        map.addSource(SourcePointId.TargetPoint, {
          type: "geojson",
          data: emptyFeature
        });
        map.addSource(SourcePointId.AnglePoint, {
          type: "geojson",
          data: emptyFeature
        });
        map.addSource(SourcePointId.Coverage, {
          type: "geojson",
          data: emptyFeature
        });

        map.addSource(SourcePointId.StartPointPreview, {
          type: "geojson",
          data: emptyFeature
        });

        map.addSource(SourcePointId.CoveragePreview, {
          type: "geojson",
          data: emptyFeature
        });

        map.addLayer(
          createCoverage(SourcePointId.Coverage, SourcePointId.Coverage)
        );

        map.addLayer(
          createCoverage(
            SourcePointId.CoveragePreview,
            SourcePointId.CoveragePreview
          )
        );

        map.addLayer(
          createPoint(SourcePointId.StartPoint, SourcePointId.StartPoint)
        );

        map.addLayer(
          createPoint(SourcePointId.AnglePoint, SourcePointId.AnglePoint)
        );

        map.addLayer(
          createPoint(SourcePointId.TargetPoint, SourcePointId.TargetPoint)
        );

        this.map.loadImage(
          require("src/assets/images/marker/location.png"),
          (error: any, image: HTMLImageElement) => {
            this.map.addImage("location", image);
            this.map.addSource("location", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: []
              }
            });

            this.map.addLayer({
              id: "location",
              type: "symbol",
              source: "location",
              layout: {
                "icon-image": "location",
                "icon-size": 0.5,
                "icon-allow-overlap": true,
                "icon-rotation-alignment": "map"
              }
            });
          }
        );

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
          this.map.addLayer({
            id: SourcePointId.StartPointPreview,
            type: "symbol",
            source: SourcePointId.StartPointPreview,
            layout: {
              "icon-image": {
                type: "interval",
                property: "type",
                stops: [
                  [CameraType.CCTV, "camera"],
                  [CameraType.Vehicle, "camera-vehicle"],
                  [CameraType.B360, "camera-360"]
                ]
              },
              // "icon-image": "camera",
              "icon-size": 0.5,
              "icon-allow-overlap": true,
              "icon-rotation-alignment": "map"
            }
          });
          this.map.addLayer({
            id: SourcePointId.CameraPoint,
            type: "symbol",
            source: SourcePointId.StartPoint,
            layout: {
              "icon-image": {
                type: "interval",
                property: "type",
                stops: [
                  [CameraType.CCTV, "camera"],
                  [CameraType.Vehicle, "camera-vehicle"],
                  [CameraType.B360, "camera-360"]
                ]
              },
              // "icon-image": "camera",
              "icon-size": 0.5,
              "icon-allow-overlap": true,
              "icon-rotation-alignment": "map"
            }
          });
        });

        this.map.loadImage(
          require("src/assets/images/marker/marker.png"),
          (error: any, image: string) => {
            this.map.addImage(SourcePointId.Marker, image);

            this.map.addLayer(
              createIconPoint(
                SourcePointId.MarkerTargetPoint,
                SourcePointId.TargetPoint,
                SourcePointId.Marker
              )
            );

            this.map.addLayer(
              createIconPoint(
                SourcePointId.MarkerAnglePoint,
                SourcePointId.AnglePoint,
                SourcePointId.Marker
              )
            );
          }
        );

        map.on("mouseenter", SourcePointId.StartPoint, () => {
          // map.setPaintProperty(SourcePointId.StartPoint, "circle-color", "#3bb2d0");
          this.mapContainer.current.style.cursor = "move";
        });

        map.on("mouseleave", SourcePointId.StartPoint, () => {
          // map.setPaintProperty(SourcePointId.StartPoint, "circle-color", "#3887be");
          this.mapContainer.current.style.cursor = "";
        });

        map.on("mousedown", SourcePointId.StartPoint, (e: any) => {
          // Prevent the default map drag behavior.
          e.preventDefault();

          this.mapContainer.current.style.cursor = "grab";

          map.on("mousemove", this.onMoveStartPoint);
          map.once("mouseup", this.onUpStartPoint);
        });

        map.on("touchstart", SourcePointId.StartPoint, (e: any) => {
          if (e.points.length !== 1) {
            return;
          }

          // Prevent the default map drag behavior.
          e.preventDefault();

          map.on("touchmove", this.onMoveStartPoint);
          map.once("touchend", this.onUpStartPoint);
        });

        // When the cursor enters a feature in the point layer, prepare for dragging.
        map.on("mouseenter", SourcePointId.TargetPoint, () => {
          this.mapContainer.current.style.cursor = "move";
        });

        map.on("mouseleave", SourcePointId.TargetPoint, () => {
          this.mapContainer.current.style.cursor = "";
        });

        map.on("mousedown", SourcePointId.TargetPoint, (e: any) => {
          e.preventDefault();
          this.mapContainer.current.style.cursor = "grab";
          map.on("mousemove", this.onMoveTargetPoint);
          map.once("mouseup", this.onUpTargetPoint);
        });

        map.on("touchstart", SourcePointId.TargetPoint, (e: any) => {
          if (e.points.length !== 1) {
            return;
          }

          e.preventDefault();

          map.on("touchmove", this.onMoveTargetPoint);
          map.once("touchend", this.onUpTargetPoint);
        });

        map.on("mouseenter", SourcePointId.AnglePoint, () => {
          this.mapContainer.current.style.cursor = "move";
        });

        map.on("mouseleave", SourcePointId.AnglePoint, () => {
          this.mapContainer.current.style.cursor = "";
        });

        map.on("mousedown", SourcePointId.AnglePoint, (e: any) => {
          e.preventDefault();

          this.mapContainer.current.style.cursor = "grab";

          map.on("mousemove", this.onMoveAnglePoint);
          map.once("mouseup", this.onUpAnglePoint);
        });

        map.on("touchstart", SourcePointId.AnglePoint, (e: any) => {
          if (e.points.length !== 1) {
            return;
          }
          e.preventDefault();

          map.on("touchmove", this.onMoveAnglePoint);
          map.once("touchend", this.onUpAnglePoint);
        });

        this.setState({
          isLoadedMap: true
        });
      }
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IStates) {
    if (
      this.state.isLoadedMap &&
      ((!prevState.pointData && this.state.pointData) ||
        (prevState.pointData &&
          this.state.pointData &&
          prevState.pointData.timeModified !==
            this.state.pointData.timeModified))
    ) {
      this.reDrawPointData();
    }

    if (
      (this.state.pointDataPreview &&
        ((!prevState.pointDataPreview && this.state.pointDataPreview) ||
          (prevState.pointDataPreview &&
            this.state.pointDataPreview &&
            prevState.pointDataPreview.timeModified !==
              this.state.pointDataPreview.timeModified))) ||
      !this.state.pointDataPreview
    ) {
      this.reDrawPointDataPreview();
    }

    if (!prevState.isOpenCreate && this.state.isOpenCreate) {
      this.createNewPoint();
    }

    if (
      (!prevProps.selectedLib && this.props.selectedLib) ||
      (prevProps.selectedLib &&
        this.props.selectedLib &&
        prevProps.selectedLib.id !== this.props.selectedLib.id)
    ) {
      if (this.state.isOpenCreate || this.state.isOpenEdit) {
        this.onClickBackForm();
      }
      this.setState({
        pointDataPreview: undefined
      });
    }
  }

  private reDrawPointDataPreview() {
    if (this.state.pointDataPreview) {
      const startFeature = {
        type: "FeatureCollection",
        features: [
          {
            properties: {
              type: this.state.pointDataPreview.type
            },
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: this.state.pointDataPreview.startPoint
            }
          }
        ]
      };

      let currentCoverage = {};
      if (
        (this.state.pointDataPreview.type === CameraType.B360 ||
          this.state.pointDataPreview.isPtz) &&
        this.state.pointDataPreview.type !== CameraType.Vehicle &&
        this.state.pointDataPreview.lengthOfFOV !== 0
      ) {
        currentCoverage = {
          type: "FeatureCollection",
          features: [
            turfCircle(
              this.state.pointDataPreview.startPoint,
              this.state.pointDataPreview.lengthOfFOV,
              {
                steps: 64,
                units: "meters"
              }
            )
          ]
        };
      } else {
        currentCoverage = {
          type: "FeatureCollection",
          features:
            this.state.pointDataPreview.type === CameraType.Vehicle
              ? []
              : [
                  {
                    properties: { type: 0 },
                    geometry: {
                      coordinates: this.state.pointDataPreview.coverage,
                      type: "Polygon"
                    },
                    type: "Feature"
                  }
                ]
        };
      }

      if (this.map.getSource(SourcePointId.StartPointPreview)) {
        if (this.map.getLayer(SourcePointId.StartPointPreview)) {
          this.map.setLayoutProperty(
            SourcePointId.StartPointPreview,
            "icon-rotate",
            this.state.pointDataPreview.bearing
          );
        }
        this.map
          .getSource(SourcePointId.StartPointPreview)
          .setData(startFeature);
        this.map
          .getSource(SourcePointId.CoveragePreview)
          .setData(currentCoverage);
      }
    } else {
      if (this.map.getSource(SourcePointId.StartPointPreview)) {
        this.map
          .getSource(SourcePointId.StartPointPreview)
          .setData(emptyFeature);
        this.map.getSource(SourcePointId.CoveragePreview).setData(emptyFeature);
      }
    }
  }

  private reDrawPointData() {
    if (this.state.pointData) {
      const startFeature = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: this.state.pointData.startPoint
            },
            properties: {
              type: this.state.pointType
            }
          }
        ]
      };

      const targetFeature = {
        type: "FeatureCollection",
        features:
          this.state.pointType === CameraType.Vehicle
            ? []
            : [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: this.state.pointData.destPoint
                  }
                }
              ]
      };

      const angleFeature = {
        type: "FeatureCollection",
        features:
          this.state.pointType === CameraType.B360 ||
          this.state.pointData.isPtz ||
          this.state.pointType === CameraType.Vehicle
            ? []
            : [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: this.state.pointData.isPtz
                      ? []
                      : this.state.pointData.anglePoint
                  }
                }
              ]
      };

      // const currentCoverage = {
      //   type: "FeatureCollection",
      //   features: [
      //     {
      //       properties: { type: 0 },
      //       geometry: {
      //         coordinates: this.state.pointData.coverage,
      //         type: "Polygon"
      //       },
      //       type: "Feature"
      //     }
      //   ]
      // };

      let currentCoverage = {};
      if (
        (this.state.pointData.isPtz ||
          this.state.pointType === CameraType.B360) &&
        this.state.pointType !== CameraType.Vehicle &&
        this.state.pointData.distance !== 0
      ) {
        currentCoverage = {
          type: "FeatureCollection",
          features: [
            turfCircle(
              this.state.pointData.startPoint,
              this.state.pointData.distance,
              {
                steps: 64,
                units: "meters"
              }
            )
          ]
        };
      } else {
        currentCoverage = {
          type: "FeatureCollection",
          features:
            this.state.pointType === CameraType.Vehicle
              ? []
              : [
                  {
                    properties: { type: 0 },
                    geometry: {
                      coordinates: this.state.pointData.coverage,
                      type: "Polygon"
                    },
                    type: "Feature"
                  }
                ]
        };
      }

      if (this.map.getSource(SourcePointId.AnglePoint)) {
        if (this.map.getLayer(SourcePointId.CameraPoint)) {
          this.map.setLayoutProperty(
            SourcePointId.CameraPoint,
            "icon-rotate",
            this.state.pointData.bearing
          );
        }
        this.map.getSource(SourcePointId.AnglePoint).setData(angleFeature);
        this.map.getSource(SourcePointId.TargetPoint).setData(targetFeature);
        this.map.getSource(SourcePointId.StartPoint).setData(startFeature);
        this.map.getSource(SourcePointId.Coverage).setData(currentCoverage);
      }
    }
  }

  private removePoint = () => {
    const startFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: []
          }
        }
      ]
    };

    const targetFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: []
          }
        }
      ]
    };

    const angleFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: []
          }
        }
      ]
    };

    const currentCoverage = {
      type: "FeatureCollection",
      features: []
    };

    if (this.map.getSource(SourcePointId.AnglePoint)) {
      this.map.getSource(SourcePointId.AnglePoint).setData(angleFeature);
      this.map.getSource(SourcePointId.TargetPoint).setData(targetFeature);
      this.map.getSource(SourcePointId.StartPoint).setData(startFeature);
      this.map.getSource(SourcePointId.Coverage).setData(currentCoverage);
    }
  };

  private removePointPreview = () => {
    const startFeature = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: []
          }
        }
      ]
    };

    const currentCoverage = {
      type: "FeatureCollection",
      features: []
    };

    if (this.map.getSource(SourcePointId.StartPointPreview)) {
      this.map.getSource(SourcePointId.StartPointPreview).setData(startFeature);
      this.map
        .getSource(SourcePointId.CoveragePreview)
        .setData(currentCoverage);
    }
  };

  private onUpStartPoint = (e: any) => {
    this.map.off("mousemove", this.onMoveStartPoint);
    this.map.off("touchmove", this.onMoveStartPoint);
    this.mapContainer.current.style.cursor = "";
  };

  private onMoveStartPoint = (e: any) => {
    const coords = e.lngLat;
    this.debounceCallGeoService(() => {
      this.setCurrentPointDataAddress(coords.lat, coords.lng);
    });
    this.mapContainer.current.style.cursor = "grabbing";
    if (this.state.pointData) {
      const pointData = this.getPointDataFromStartPoint({
        startPoint: [coords.lng, coords.lat],
        bearing: this.state.pointData.bearing,
        angle: this.state.pointData.angle,
        distance: this.state.pointData.distance,
        isPtz: this.state.pointData.isPtz
      });
      if (pointData) {
        this.setState({
          pointData
        });
      }
    }
  };

  private onMoveTargetPoint = (e: any) => {
    const coords = e.lngLat;
    this.mapContainer.current.style.cursor = "grabbing";
    if (this.state.pointData) {
      const pointData = this.getPointDataFromStartPoint({
        startPoint: this.state.pointData.startPoint,
        destPoint: [coords.lng, coords.lat],
        bearing: this.state.pointData.bearing,
        angle: this.state.pointData.angle,
        distance: this.state.pointData.distance,
        isPtz: this.state.pointData.isPtz
      });
      if (pointData && pointData.distance !== 0) {
        this.setState({
          pointData
        });
      }
    }
  };

  private onUpTargetPoint = () => {
    this.map.off("mousemove", this.onMoveTargetPoint);
    this.map.off("touchmove", this.onMoveTargetPoint);
    this.mapContainer.current.style.cursor = "";
  };

  private onMoveAnglePoint = (e: any) => {
    if (this.state.pointData) {
      const coords = e.lngLat;
      const pointData = this.getPointDataFromAnglePoint({
        anglePoint: [coords.lng, coords.lat],
        startPoint: this.state.pointData.startPoint,
        destPoint: this.state.pointData.destPoint,
        isPtz: this.state.pointData.isPtz
      });
      if (pointData.angle !== 0) {
        this.setState({
          pointData
        });
      }
    }
  };

  private onUpAnglePoint = () => {
    this.mapContainer.current.style.cursor = "";
    this.map.off("mousemove", this.onMoveAnglePoint);
    this.map.off("touchmove", this.onMoveAnglePoint);
  };

  private onClickCreateCCTV = () => {
    if (this.props.selectedLib) {
      if (
        this.props.selectedLib.type === IPlan[IPlan.FreeTrial] &&
        this.props.totalCCTV > 0
      ) {
        this.setState({
          isOpenLimitCreateCamera: true
        });
      } else {
        this.removePointPreview();
        this.setState({
          pointDataPreview: undefined,
          pointData: undefined,
          isOpenCreate: true
        });
      }
    }
  };

  private onClickEditCCTV = () => {
    this.removePointPreview();
    this.setState({
      isOpenEdit: true
    });
  };

  private onClickBackForm = () => {
    this.setState(
      {
        pointData: undefined,
        pointDataPreview: undefined,
        isOpenCreate: false,
        isOpenEdit: false
      },
      () => {
        this.removePoint();
      }
    );
  };

  private getPointDataFromAnglePoint = (data: {
    anglePoint: number[];
    startPoint: number[];
    destPoint: number[];
    isPtz: boolean;
  }): IPointData => {
    const pointListData = getPointListBy3Point(
      pointTurf(data.startPoint).geometry,
      pointTurf(data.destPoint).geometry,
      pointTurf(data.anglePoint).geometry
    );

    const pointList = pointListData.points;

    return {
      timeModified: new Date().getTime(),
      distance: Math.round(pointListData.distance),
      angle: Math.round(pointListData.angle),
      bearing: Math.round(pointListData.bearing),
      anglePoint: pointList[2],
      destPoint: data.destPoint,
      startPoint: data.startPoint,
      coverage: [[pointList[1], pointList[2], pointList[0], pointList[1]]],
      isPtz: data.isPtz
    };
  };

  private getPointDataFromStartPoint = (data: {
    startPoint: number[];
    destPoint?: number[];
    bearing: number;
    angle: number;
    distance: number;
    isPtz: boolean;
  }): IPointData | undefined => {
    const pointData = {
      startPoint: data.startPoint,
      bearing: data.bearing,
      angle: data.angle,
      distance: data.distance,
      timeModified: new Date().getTime()
    };

    let destPointCor: number[] = [];

    if (data.destPoint) {
      destPointCor = data.destPoint;
    } else {
      const destPoint = destination(
        pointTurf(data.startPoint),
        pointData.distance,
        pointData.bearing,
        {
          units: "meters"
        }
      );

      if (destPoint.geometry) {
        destPointCor = destPoint.geometry.coordinates;
      }
    }

    if (destPointCor.length > 0) {
      const pointListData = getPointLists(
        pointData.angle,
        pointTurf(pointData.startPoint),
        pointTurf(destPointCor)
      );

      const pointList = pointListData.points;
      const angle = Math.abs(Math.round(pointListData.angle));
      return {
        ...pointData,
        distance: Math.round(pointListData.distance),
        angle: angle <= 170 ? angle : 170,
        bearing: Math.round(pointListData.bearing),
        anglePoint: pointList[2],
        destPoint: destPointCor,
        coverage: [[pointList[1], pointList[2], pointList[0], pointList[1]]],
        isPtz: data.isPtz
      };
    }

    return;
  };

  private setCurrentPointDataAddress = (lat: number, lng: number) => {
    this.setState(
      {
        pointDataAddress: ""
      },
      () => {
        const geoCoder = new GeoCodingService();
        geoCoder.reverseGeocode({ lat, lng }).then(([result]) => {
          this.setState({
            pointDataAddress:
              result && result.formatted_address ? result.formatted_address : ""
          });
        });
      }
    );
  };

  private createNewPoint = (data?: {
    startPoint: number[];
    bearing: number;
    angle: number;
    distance: number;
    isPtz: boolean;
  }) => {
    if (this.ismounted) {
      const currentCenter = this.map.getCenter();

      this.setCurrentPointDataAddress(currentCenter.lat, currentCenter.lng);

      const pointData = this.getPointDataFromStartPoint(
        data || {
          startPoint: [currentCenter.lng, currentCenter.lat],
          bearing: 0,
          angle: 60,
          distance: 100,
          isPtz: false
        }
      );

      if (pointData) {
        this.setState(
          {
            pointData
          },
          () => {
            if (this.state.pointData) {
              this.map.setCenter(this.state.pointData.startPoint);
            }
          }
        );
      }
    }
  };

  private changePointData = (data: {
    startPoint: number[];
    bearing: number;
    angle: number;
    distance: number;
    isPtz: boolean;
  }) => {
    if (this.state.pointData) {
      const newPointData = this.getPointDataFromStartPoint(data);
      if (newPointData) {
        const shouldRecenter =
          newPointData.startPoint[0] !== this.state.pointData[0] ||
          newPointData.startPoint[1] !== this.state.pointData[1];
        this.setState(
          {
            pointData: newPointData
          },
          () => {
            if (shouldRecenter && this.state.pointData) {
              this.map.setCenter(this.state.pointData.startPoint);
              this.setCurrentPointDataAddress(
                newPointData.startPoint[1],
                newPointData.startPoint[0]
              );
              this.reDrawPointData();
            }
          }
        );
      }
    }
  };

  private setPointDataPreview = ({
    type,
    startPoint,
    coverage,
    bearing,
    isPtz,
    lengthOfFOV
  }: {
    type: CameraType;
    startPoint: number[];
    coverage: number[][][];
    bearing: number;
    isPtz: boolean;
    lengthOfFOV: number;
  }) => {
    this.setState(
      {
        pointDataPreview: {
          type,
          bearing,
          startPoint,
          coverage,
          isPtz,
          timeModified: new Date().getTime(),
          lengthOfFOV
        }
      },
      () => {
        if (this.state.pointDataPreview) {
          this.map.setCenter(this.state.pointDataPreview.startPoint);
        }
      }
    );
  };

  private onClickFindPlace = (lng: number, lat: number) => {
    this.map.setCenter([lng, lat]);
    if (this.map.getSource("location") && this.state.isLoadedMap) {
      (this.map.getSource("location") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
            properties: {}
          }
        ]
      });
    }
  };

  private onClearPlace = () => {
    if (this.map.getSource("location") && this.state.isLoadedMap) {
      (this.map.getSource("location") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
    }
  };

  private onChangePointType = (type: CameraType) => {
    this.setState(
      {
        pointType: type
      },
      () => {
        this.reDrawPointData();
      }
    );
  };

  private onCloseTrial = (upgrade: boolean) => {
    if (upgrade) {
      const win = window.open(links.upgradePlan, "_blank");
      if (win) {
        win.focus();
      }
    }
    this.setState({
      isOpenLimitCreateCamera: false
    });
  };

  public render() {
    let formPointData;

    if (this.state.pointData) {
      formPointData = {
        lng: this.state.pointData.startPoint[0],
        lat: this.state.pointData.startPoint[1],
        angle: this.state.pointData.angle,
        distance: this.state.pointData.distance,
        bearing: this.state.pointData.bearing,
        coverage: this.state.pointData.coverage,
        isPtz: this.state.pointData.isPtz
      };
    }

    return (
      <div className="map">
        <div className="map-inner" ref={this.mapContainer} />
        <SideMapPopUp>
          {(this.state.isOpenCreate || this.state.isOpenEdit) && (
            <FormControlCCTV
              type={this.props.selectedLib ? this.props.selectedLib.type : ""}
              onChangePointType={this.onChangePointType}
              isOpenEdit={this.state.isOpenEdit}
              isOpenCreate={this.state.isOpenCreate}
              createPointData={this.createNewPoint}
              onChangePointData={this.changePointData}
              pointData={formPointData}
              pointDataAddress={this.state.pointDataAddress}
              onClickBack={this.onClickBackForm}
            />
          )}
          {!this.state.isOpenCreate && !this.state.isOpenEdit && (
            <ListCCTVContainer
              onClickEdit={this.onClickEditCCTV}
              onClickRow={this.setPointDataPreview}
              onClickCreate={this.onClickCreateCCTV}
            />
          )}
        </SideMapPopUp>
        <SearchLocation
          onClickResult={this.onClickFindPlace}
          onClear={this.onClearPlace}
          lat={this.state.lat}
          lng={this.state.lng}
        />
        <ConfirmDialog
          cancelText="Close"
          confirmText="Upgrade"
          title="Free trial"
          isOpen={this.state.isOpenLimitCreateCamera}
          content={`Free trial library cannot create more than 1 camera. Upgrade plan to remove the limit.`}
          onClose={this.onCloseTrial}
        />
      </div>
    );
  }
}

export default Mapbox;
