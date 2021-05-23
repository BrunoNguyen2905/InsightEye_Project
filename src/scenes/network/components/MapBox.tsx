import * as React from "react";
import "../styles/mapbox.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import { LngLat } from "mapbox-gl";
import MapboxDraw, {
  DrawEventCreate,
  DrawEventDelete,
  DrawEventModeChange,
  DrawEventUpdate,
  DrawFeature,
  DrawFeatureGeometryLineString,
  DrawFeatureGeometryPolygon
} from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Feature, LineString, Point, Polygon, Position } from "geojson";
// import { isEqualWith, after } from "lodash-es";
import supercluster, { BBox, Supercluster } from "supercluster";
import polygonIntersect from "@turf/intersect";
import lineIntersect from "@turf/line-intersect";
import turfCircle from "@turf/circle";
import { lineString, polygon } from "@turf/helpers";
import { DrawResult } from "./MapSidebar";
import SearchSidebar from "../containers/SearchSidebar";
import SearchLocation from "src/components/SearchLocation";
import IStyleProps from "../../../styles/utils";
import IJsonVersion from "../types/JsonVersion";
import { RealtimeEvent, socket } from "../../../middlewares/realtime";
import {
  IPointGeoJsonProperties,
  IPointLocation,
  IVehicleProperties
  // PointType
} from "../types/GeoProperties";
import {
  ICamPoints,
  ISearchMode,
  ISearchResultCamPoints,
  SearchMode
} from "../types/camPoints";
import { GeoCodingService } from "../../../helpers/GeoCodingService";
import {
  IIncidentLngLat,
  IIncidnetOpenIncidentTab
} from "./Incident/types/IncidentTransferData";
import ICamera from "./Incident/types/Camera";
import { createFeatureCollection } from "src/helpers/geojson";
import { IIncidentsSearchResult } from "../types/incidents";
import IMapState from "src/types/MapState";
import { User } from "oidc-client";
import { UserLibRole } from "../../../helpers/permission";
import { debounce } from "lodash-es";
import { CameraType } from "../../../types/Camera";

function getTimeToSaveVideoTypes(time: number, type: string): string {
  switch (type) {
    case "day": {
      return time === 1 ? "day" : "days";
    }

    case "week": {
      return time === 1 ? "week" : "weeks";
    }

    case "month": {
      return time === 1 ? "month" : "months";
    }
  }

  return "";
}

interface IProps {
  selectedLib: string;
  role: UserLibRole;
  account: User;
  width: number;
  height: number;
  jsonVersion: IJsonVersion;
  openQuickVideo: (pointId: string) => void;
  openFloatingVideo: (url: string, name: string, type?: string) => void;
  loadCameraView: (pointId: string) => void;
  loadCamera360: (
    pointId: string,
    cameraName: string,
    url: string,
    address: string
  ) => void;
  openIncidentTab: (data: IIncidnetOpenIncidentTab) => void;
  loadCamPoints: () => void;
  loadJsonVersion: (libId: string) => void;
  camPoints: ICamPoints;
  searchResultCamPoints: ISearchResultCamPoints;
  searchResultIncidents: IIncidentsSearchResult;
  setSearchMode: (data: { active?: boolean; mode?: SearchMode }) => void;
  searchMode: ISearchMode;
  changeUrl: (url: string) => void;
  openAddVideoWall: (listCameraId: string[]) => void;
  mapState: IMapState;
  handleMainMapState: (mapState: IMapState) => void;
}

interface IIncidentTempData {
  address: string;
  lnglat: IIncidentLngLat;
}

interface IState {
  isOpenDrawResult: boolean;
  isLoadedMap: boolean;
  isLoadedMapDataOnce: boolean;
  lat: number;
  lng: number;
  zoom: number;
  drawPolygonResults: {
    result: string[];
    feature: DrawFeature;
  } | null;
  step: number;
  popupContextMenu: mapboxgl.Popup | null;
  incident: IIncidentTempData;
}
const INCIDENT_MAKER_ID = "INCIDENT_MAKER_ID";

const getIncidentMarker = (
  id: string,
  lnglat: [number, number]
): Feature<Point> => ({
  id,
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: lnglat
  },
  properties: {
    "marker-color": "#3bb2d0",
    "marker-size": "large",
    "marker-symbol": "rocket"
  }
});

class MapBox extends React.Component<IProps & IStyleProps, IState> {
  private mapContainer: any;
  private searchSidebar: any;
  private ismounted: boolean;
  private map: mapboxgl.Map;
  private popup: mapboxgl.Popup;
  private draw: MapboxDraw;
  private marker: mapboxgl.Marker;
  private isAboutCenter: boolean;
  private indexCluster: Supercluster;
  constructor(props: any) {
    super(props);
    const self = this;
    this.indexCluster = supercluster({
      radius: 40,
      maxZoom: 18,
      minZoom: 4,
      log: false
    });
    this.mapContainer = React.createRef();
    this.searchSidebar = React.createRef();
    this.ismounted = true;
    this.state = {
      isOpenDrawResult: false,
      drawPolygonResults: null,
      isLoadedMap: false,
      isLoadedMapDataOnce: false,
      lng: props.mapState.lng,
      lat: props.mapState.lat,
      zoom: props.mapState.zoom,
      popupContextMenu: null,
      step: 0,
      incident: {
        address: "",
        lnglat: [0, 0]
      }
    };

    socket.on(RealtimeEvent.CLIENT_LOCATION, (listPoints: IPointLocation) => {
      console.log(listPoints);
      if (!self.map) {
        return;
      }

      const featuresPoints = self.props.camPoints.points.features.map(f => {
        const changePoint = listPoints[f.properties.id];
        if (changePoint) {
          f.geometry.coordinates = [changePoint.lon, changePoint.lat];
        }
        return f;
      });

      self.indexCluster.load(featuresPoints);

      self.buildRectanglesGeoJSON();
    });
  }

  public componentWillUnmount() {
    this.ismounted = false;
  }

  private onHoverPoints = (e: any) => {
    if (e.features.length > 0) {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const prop = e.features[0].properties as IPointGeoJsonProperties;
      const tagName = prop.pointname
        ? `<tr><td>Name</td><td>${prop.pointname}</td><tr>`
        : "";
      let tagDeviceType = "";
      if (prop.pointdevicetype !== null || prop.pointdevicetype !== undefined) {
        switch (prop.pointdevicetype) {
          case CameraType.B360:
            tagDeviceType = `<tr><td>Device Type</td><td>B360</td><tr>`;
            break;
          case CameraType.Vehicle:
            tagDeviceType = `<tr><td>Device Type</td><td>Vehicle</td><tr>`;
            break;
          default:
            tagDeviceType = `<tr><td>Device Type</td><td>CCTV</td><tr>`;
            break;
        }
      }

      const tagAddress = prop.address
        ? `<tr><td>Address</td><td>${prop.address}</td><tr>`
        : "";
      const tagBearing = prop.bearing
        ? `<tr><td>Bearing</td><td>${prop.bearing}</td><tr>`
        : "";
      const tagFOVLength = prop.lengthoffov
        ? `<tr><td>FOV length</td><td>${prop.lengthoffov}</td><tr>`
        : "";
      const tagFOVAngle = prop.fieldofview
        ? `<tr><td>FOV angle</td><td>${prop.fieldofview}</td><tr>`
        : "";
      const tagHeight = prop.heightofcamera
        ? `<tr><td>Height</td><td>${prop.heightofcamera}</td><tr>`
        : "";
      const tagBusiness = prop.businessname
        ? `<tr><td>Business Name</td><td>${prop.businessname}</td><tr>`
        : "";
      const tagOwner = prop.ownername
        ? `<tr><td>Owner</td><td>${prop.ownername}</td><tr>`
        : "";
      const tagContact = prop.contactphonenumber
        ? `<tr><td>Contact</td><td>${prop.contactphonenumber}</td><tr>`
        : "";
      const dest = `
        <table>
          ${tagName}
          ${tagDeviceType}
          ${tagAddress}
          ${tagBearing}
          ${tagFOVLength}
          ${tagFOVAngle}
          ${tagHeight}
          ${tagBusiness}
          ${tagOwner}
          ${tagContact}
          <tr><td>Time to save</td><td>${
            prop.timetosavevideo
          } ${getTimeToSaveVideoTypes(
        prop.timetosavevideo,
        prop.timetosavevideotype
      )}</td><tr>
        </table>
      `;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      this.popup
        .setLngLat(coordinates)
        .setHTML(dest)
        .addTo(this.map);
    }
  };

  private onHoverVehiclePoints = (e: any) => {
    if (e.features.length > 0) {
      // Change the cursor style as a UI indicator.
      this.map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const prop = e.features[0].properties as IVehicleProperties;
      const dest = `
        <table>
            <tr><td>Name</td><td>${prop.streamName}</td></tr>
            <tr><td>Mac Address</td><td>${prop.macAddress}</td></tr>
            <tr><td>Lon</td><td>${prop.lon}</td></tr>
            <tr><td>Lat</td><td>${prop.lat}</td></tr>
        </table>
      `;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      this.popup
        .setLngLat(coordinates)
        .setHTML(dest)
        .addTo(this.map);
    }
  };

  private onLeavePoints = () => {
    this.map.getCanvas().style.cursor = "";
    this.popup.remove();
  };

  private onContextMenu = (e: any) => {
    if (UserLibRole.BaseUser !== this.props.role) {
      // right click on site tower
      const {
        loadCameraView,
        openQuickVideo,
        openFloatingVideo
        // loadCamera360
      } = this.props;
      const features = this.map.queryRenderedFeatures(e.point);
      const checkCamPointFeature = features.filter(
        (p: any) =>
          p.layer.id === "camPointsFiltered" ||
          p.layer.id === "camPointsVehicle"
      );
      const checkVehiclePointFeature = features.filter(
        (p: any) => p.layer.id === "vehicle"
      );
      if (this.state.popupContextMenu) {
        this.state.popupContextMenu.remove();
      }
      // vehicle
      if (checkVehiclePointFeature[0] !== undefined) {
        const properties = checkVehiclePointFeature[0]
          .properties as IVehicleProperties;
        if (!properties) {
          return;
        }
        // right click on cam
        const streamURL = `http://eyeview.city:1935/live/${
          properties.streamName
        }/playlist.m3u8`;
        const pointName = properties.macAddress; // @todo get from properties;
        const oldPopups = window.document.getElementsByClassName(
          "mapboxgl-popup"
        );
        if (oldPopups.length === 1) {
          // remove old popup
          oldPopups[0].remove();
        }
        const ul = window.document.createElement("ul");
        ul.className = "popup-ul";
        const liCam = window.document.createElement("li");

        const liFloatVideo = window.document.createElement("li");
        liFloatVideo.innerHTML = "Quick view " + pointName;
        liFloatVideo.onclick = () => {
          openFloatingVideo(streamURL, pointName);
          if (this.state.popupContextMenu) {
            this.state.popupContextMenu.remove();
          }
          // openFloatingVideo(
          //   "http://eyeview.world:1935/live/_definst_/cctv_b6fd61a1-7283-4fc2-a9b2-b4ab5a6490f1.stream/playlist.m3u8?wowzatokenstarttime=1530322048&wowzatokenendtime=1531186048&wowzatokenCid=7dfbc339-15ec-4719-b963-be005bcef1b7&wowzatokenhash=RKYEPUg5h0x-oGYfkdXjMT9ZKeLj5p41GFhigWEoGQI=",
          //   "Testing"
          // );
        };
        liFloatVideo.className = "popup-li";

        ul.appendChild(liCam);
        ul.appendChild(liFloatVideo);
        const popup = new mapboxgl.Popup({
          closeButton: false,
          anchor: "left"
        })
          .setLngLat(e.lngLat)
          .setDOMContent(ul)
          .addTo(this.map);
        this.setState({
          popupContextMenu: popup
        });
        popup.on("close", () => {
          this.setState({
            popupContextMenu: null
          });
        });
        return;
      }
      // cam point
      if (checkCamPointFeature[0] !== undefined) {
        const properties = checkCamPointFeature[0]
          .properties as IPointGeoJsonProperties;
        if (!properties) {
          return;
        }
        // right click on cam
        const pointId = properties.pointid;
        const pointName = ""; // @todo get from properties;
        const oldPopups = window.document.getElementsByClassName(
          "mapboxgl-popup"
        );
        if (oldPopups.length === 1) {
          // remove old popup
          oldPopups[0].remove();
        }
        const ul = window.document.createElement("ul");
        ul.className = "popup-ul";
        const liCam = window.document.createElement("li");
        liCam.innerHTML = "View camera " + pointName;
        liCam.onclick = () => {
          loadCameraView(pointId);
          if (this.state.popupContextMenu) {
            this.state.popupContextMenu.remove();
          }
          console.log("view cam"); // @todo open new tab to view cam
        };
        liCam.className = "popup-li";

        const liFloatVideo = window.document.createElement("li");
        liFloatVideo.innerHTML = "Quick view " + pointName;
        liFloatVideo.onclick = () => {
          // if (properties.pointdevicetype === CameraType.B360) {
          //   openFloatingVideo(
          //     "http://eyeview.city:1935/live/rt_6b7e7401-535a-47d2-8e32-f31c31a749e3/playlist.m3u8",
          //     pointName,
          //     "360"
          //   );
          // } else {
          openQuickVideo(pointId);
          // }
          if (this.state.popupContextMenu) {
            this.state.popupContextMenu.remove();
          }
          // openFloatingVideo(
          //   "http://eyeview.world:1935/live/_definst_/cctv_b6fd61a1-7283-4fc2-a9b2-b4ab5a6490f1.stream/playlist.m3u8?wowzatokenstarttime=1530322048&wowzatokenendtime=1531186048&wowzatokenCid=7dfbc339-15ec-4719-b963-be005bcef1b7&wowzatokenhash=RKYEPUg5h0x-oGYfkdXjMT9ZKeLj5p41GFhigWEoGQI=",
          //   "Testing"
          // );
        };
        liFloatVideo.className = "popup-li";

        // const liCam360 = window.document.createElement("li");
        // liCam360.innerHTML = "View camera 360 " + pointName;
        // liCam360.onclick = () => {
        //   loadCamera360(pointId);
        //   if (this.state.popupContextMenu) {
        //     this.state.popupContextMenu.remove();
        //   }
        //   console.log("view cam"); // @todo open new tab to view cam
        // };
        // liCam360.className = "popup-li";

        ul.appendChild(liFloatVideo);
        // if (properties.type === PointType.CAMERA360) {
        //   ul.appendChild(liCam360);
        // } else {
        ul.appendChild(liCam);
        // }
        const popup = new mapboxgl.Popup({
          closeButton: false,
          anchor: "left"
        })
          .setLngLat(e.lngLat)
          .setDOMContent(ul)
          .addTo(this.map);
        this.setState({
          popupContextMenu: popup
        });
        popup.on("close", () => {
          this.setState({
            popupContextMenu: null
          });
        });
        return;
      }
    }
  };

  private checkCameraInPolygon = (coordinates: Position[][]): string[] => {
    const result: string[] = [];
    this.props.camPoints.points.features.forEach(feature => {
      let coveragePoints: Feature<Polygon> | null = null;
      if (feature.properties.isPtz) {
        coveragePoints = turfCircle(
          feature.geometry.coordinates,
          feature.properties.lengthoffov,
          {
            steps: 64,
            units: "meters",
            properties: feature.properties
          }
        ) as Feature<Polygon>;
      } else {
        const point = this.props.camPoints.coverages.features.find(
          el => el.properties.pointid === feature.properties.pointid
        );
        if (point) {
          coveragePoints = point;
        }
      }
      if (
        coveragePoints &&
        polygonIntersect(
          polygon(coveragePoints.geometry.coordinates),
          polygon(coordinates)
        ) &&
        feature.properties
      ) {
        result.push(feature.properties.id);
      }
    });
    return result;
  };

  private checkCameraInLineString = (coordinates: Position[]): string[] => {
    const result: string[] = [];
    const listPoints = this.props.camPoints.points;
    listPoints.features.forEach(feature => {
      let coveragePoints: Feature<Polygon> | null = null;
      if (feature.properties.isPtz) {
        coveragePoints = turfCircle(
          feature.geometry.coordinates,
          feature.properties.lengthoffov,
          {
            steps: 64,
            units: "meters",
            properties: feature.properties
          }
        ) as Feature<Polygon>;
      } else {
        const point = this.props.camPoints.coverages.features.find(
          el => el.properties.pointid === feature.properties.pointid
        );
        if (point) {
          coveragePoints = point;
        }
      }
      if (coveragePoints) {
        const find = lineIntersect(
          polygon(coveragePoints.geometry.coordinates),
          lineString(coordinates)
        );
        if (find && find.features.length > 0 && feature.properties) {
          result.push(feature.properties.id);
        }
      }
    });

    return result;
  };

  private onDraw = (e: DrawEventCreate) => {
    if (this.props.searchMode.active) {
      this.props.setSearchMode({
        active: false
      });
    }
    if (
      this.props.camPoints.points.features.length &&
      this.props.camPoints.coverages.features.length
    ) {
      const feature = e.features[0];
      if (feature.geometry.type === "Polygon") {
        const event = e as DrawEventCreate<DrawFeatureGeometryPolygon>;
        this.setState(prevState => ({
          isOpenDrawResult: true,
          step: 0,
          drawPolygonResults: {
            result: this.checkCameraInPolygon(
              event.features[0].geometry.coordinates
            ),
            feature
          }
        }));
      }

      if (feature.geometry.type === "LineString") {
        const event = e as DrawEventCreate<DrawFeatureGeometryLineString>;
        this.setState(prevState => ({
          isOpenDrawResult: true,
          drawPolygonResults: {
            result: this.checkCameraInLineString(
              event.features[0].geometry.coordinates
            ),
            feature
          }
        }));
      }
    }
  };

  private onDrawChange = (e: DrawEventUpdate) => {
    const feature = e.features[0];
    const type = feature.geometry.type;

    if (type === "Polygon") {
      const featurePolygon = feature as DrawFeature<DrawFeatureGeometryPolygon>;
      this.setState(() => ({
        isOpenDrawResult: true,
        drawPolygonResults: {
          result: this.checkCameraInPolygon(
            featurePolygon.geometry.coordinates
          ),
          feature
        }
      }));
    }

    if (type === "LineString") {
      const featurePolygon = feature as DrawFeature<
        DrawFeatureGeometryLineString
      >;
      this.setState(() => ({
        isOpenDrawResult: true,
        drawPolygonResults: {
          result: this.checkCameraInLineString(
            featurePolygon.geometry.coordinates
          ),
          feature
        }
      }));
    }
  };

  private onSelectDrawChange = (e: DrawEventModeChange) => {
    if (
      (e.mode === "draw_polygon" || e.mode === "draw_line_string") &&
      this.state.drawPolygonResults
    ) {
      this.draw.delete(this.state.drawPolygonResults.feature.id);
      this.setState({
        isOpenDrawResult: false,
        drawPolygonResults: null
      });
    }
  };

  private onDeleteDraw = (e: DrawEventDelete) => {
    if (e.features.length > 0) {
      this.setState({
        isOpenDrawResult: false,
        drawPolygonResults: null
      });
    }
  };

  private closeDrawResult = () => {
    if (this.state.drawPolygonResults) {
      this.draw.delete(this.state.drawPolygonResults.feature.id);
    }
    if (this.marker) {
      this.marker.remove();
    }
    this.setState({
      step: 0,
      isOpenDrawResult: false,
      drawPolygonResults: null
    });
  };

  private onSelectResultCamera = (id: string) => {
    return () => {
      if (this.props.camPoints.points.features.length) {
        const point = this.props.camPoints.points.features.find(feature => {
          if (feature.properties) {
            return feature.properties.id === id;
          }
          return false;
        });
        if (point) {
          this.isAboutCenter = true;
          this.map.setCenter(point.geometry.coordinates);

          const searchBar = this.searchSidebar.current.getWrappedInstance();

          if (
            !this.isAboutCenter &&
            this.props.searchMode.active &&
            this.props.searchMode.mode === SearchMode.CCTV &&
            searchBar
          ) {
            searchBar.reSearchCCTV();
          }
        }
      }
    };
  };

  private onSelectResultIncident = (id: string) => {
    return () => {
      if (this.props.searchResultIncidents.result.data.length) {
        const point = this.props.searchResultIncidents.result.data.find(inc => {
          return inc.incidentId === id;
        });
        if (point) {
          this.isAboutCenter = true;
          this.map.setCenter([point.lon, point.lat]);
        }
      }
    };
  };

  private loadMapData = () => {
    this.props.loadCamPoints();
  };

  private updateMapData = (camPoints?: ICamPoints) => {
    if (
      this.state.isLoadedMap &&
      this.props.searchMode.mode !== SearchMode.INCIDENT
    ) {
      let featuresPoints = camPoints
        ? camPoints.points.features
        : this.props.camPoints.points.features;

      if (
        this.props.searchMode.mode === SearchMode.CCTV &&
        this.props.searchMode.active
      ) {
        const { currentPage, limit, result } = this.props.searchResultCamPoints;

        featuresPoints = featuresPoints.filter(feat => {
          return result.indexOf(feat.properties.pointid) >= 0;
        });

        featuresPoints = featuresPoints.slice(
          (currentPage - 1) * limit,
          currentPage * limit
        );
      }

      // this.indexCluster.load(
      //   featuresPoints.filter(f => {
      //     return f.properties.pointdevicetype !== CameraType.Vehicle;
      //   })
      // );

      this.indexCluster.load(featuresPoints);

      this.buildRectanglesGeoJSON();
    }
  };

  private clearMapDateIncidents = () => {
    if (this.map.getSource("incidents") && this.state.isLoadedMap) {
      (this.map.getSource("incidents") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
    }
  };

  private clearMapDataCCTV = () => {
    if (this.map.getSource("camCoverages") && this.state.isLoadedMap) {
      (this.map.getSource("camCoverages") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
      (this.map.getSource("camPoints") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
      (this.map.getSource(
        "camPointsVehicle"
      ) as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
      (this.map.getSource(
        "camPointsFiltered"
      ) as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
      (this.map.getSource("camPTZs") as mapboxgl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: []
      });
    }
  };

  private updateMapDataModeIncidents = () => {
    if (!this.map.getSource("incidents") && this.state.isLoadedMap) {
      this.map.loadImage(
        require("src/assets/images/marker/incident.png"),
        (error: any, image: HTMLImageElement) => {
          this.map.addImage("incident", image);

          this.map.addSource("incidents", {
            type: "geojson",
            data: this.props.searchResultIncidents.result.geoJson
          });

          this.map.addLayer({
            id: "incidents",
            type: "symbol",
            source: "incidents",
            layout: {
              "icon-image": "incident",
              "icon-size": 0.5,
              "icon-allow-overlap": true,
              "icon-rotation-alignment": "map"
            }
          });
        }
      );
    } else if (this.map.getSource("incidents") && this.state.isLoadedMap) {
      if (
        this.props.searchResultIncidents.result.data.length > 0 &&
        !this.props.searchResultIncidents.isWithinMap
      ) {
        this.map.setCenter([
          this.props.searchResultIncidents.result.data[0].lon,
          this.props.searchResultIncidents.result.data[0].lat
        ]);
      }

      (this.map.getSource("incidents") as mapboxgl.GeoJSONSource).setData(
        this.props.searchResultIncidents.result.geoJson
      );
    }
  };

  private loadMapAsset = (link: string, name: string): Promise<string> => {
    return new Promise(resolve => {
      this.map.loadImage(link, (error: any, image: HTMLImageElement) => {
        this.map.addImage(name, image);
        resolve(name);
      });
    });
  };

  private setupMap = (
    camPointsData: GeoJSON.FeatureCollection<Point, IPointGeoJsonProperties>
  ) => {
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
            "icon-size": 1,
            "icon-allow-overlap": true,
            "icon-rotation-alignment": "map"
          }
        });
      }
    );
    this.map.addSource("vehicle", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    this.map.addLayer({
      id: "vehicle",
      type: "circle",
      source: "vehicle",
      paint: {
        "circle-color": "#000000",
        "circle-radius": 10
      }
    });

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
      const empty = {
        type: "FeatureCollection",
        features: []
      } as GeoJSON.FeatureCollection;

      this.map.addSource("camCoverages", {
        type: "geojson",
        data: empty
      });

      this.map.addSource("camPoints", {
        type: "geojson",
        data: empty
      });

      this.map.addSource("camPointsFiltered", {
        type: "geojson",
        data: empty
      });

      this.map.addSource("camPointsVehicle", {
        type: "geojson",
        data: empty
      });

      this.map.addSource("camPTZs", {
        type: "geojson",
        data: empty
      });

      this.indexCluster.load(camPointsData.features);

      this.map.addLayer({
        id: "clusters-site",
        type: "circle",
        source: "camPoints",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": {
            property: "point_count",
            type: "interval",
            stops: [[0, "#51bbd6"], [100, "#f1f075"], [750, "#f28cb1"]]
          },
          "circle-radius": {
            property: "point_count",
            type: "interval",
            stops: [[0, 20], [100, 30], [750, 40]]
          }
        }
      });

      this.map.addLayer({
        id: "clusters-site-count",
        type: "symbol",
        source: "camPoints",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Klokantech Noto Sans Regular"],
          "text-size": 15
        }
      });

      this.map.addLayer({
        id: "camCoverages",
        type: "fill",
        source: "camCoverages",
        layout: {},
        paint: {
          "fill-color": "#3388ff",
          "fill-opacity": 0.2
        }
      });

      this.map.addLayer({
        id: "camPointsFiltered",
        type: "symbol",
        source: "camPointsFiltered",
        filter: ["all", ["!has", "point_count"]],
        layout: {
          "icon-rotate": {
            type: "identity",
            property: "bearing"
          },
          "icon-image": {
            type: "interval",
            property: "pointdevicetype",
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
        id: "camPointsVehicle",
        type: "symbol",
        source: "camPointsVehicle",
        filter: ["all", ["!has", "point_count"]],
        layout: {
          "icon-rotate": {
            type: "identity",
            property: "bearing"
          },
          "icon-image": "camera-vehicle",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-rotation-alignment": "map"
        }
      });

      // this.map.addLayer({
      //   id: "camPTZs",
      //   type: "circle",
      //   source: "camPoints",
      //   filter: ["==", "type", 0],
      //   paint: {
      //     "circle-color": "#3388ff",
      //     "circle-radius": 50,
      //     "circle-opacity": 0.2
      //   }
      // });

      this.map.on("mousemove", "camPointsFiltered", this.onHoverPoints);

      this.map.on("mouseleave", "camPointsFiltered", this.onLeavePoints);

      this.map.on("mousemove", "camPointsVehicle", this.onHoverPoints);

      this.map.on("mouseleave", "camPointsVehicle", this.onLeavePoints);

      this.map.on("mousemove", "vehicle", this.onHoverVehiclePoints);

      this.map.on("mouseleave", "vehicle", this.onLeavePoints);

      this.map.on("contextmenu", this.onContextMenu);

      this.map.on("draw.create", this.onDraw);

      this.map.on("draw.update", this.onDrawChange);

      this.map.on("draw.modechange", this.onSelectDrawChange);

      this.map.on("draw.delete", this.onDeleteDraw);

      this.map.on("moveend", this.reCheckResultData);

      this.map.on("moveend", this.updateMapState);

      this.map.on("zoom", this.debounceBuildRectanglesGeoJSON);
      this.map.on("drag", this.debounceBuildRectanglesGeoJSON);
      this.map.on("pitch", this.debounceBuildRectanglesGeoJSON);
      this.map.on("rotate", this.debounceBuildRectanglesGeoJSON);

      this.setState(
        {
          isLoadedMapDataOnce: true
        },
        () => {
          let center = [0, 0];
          if (
            this.props.camPoints.points &&
            this.props.camPoints.points.features.length > 0
          ) {
            this.isAboutCenter = true;
            center = this.props.camPoints.points.features[0].geometry
              .coordinates;
          }
          if (this.state.lat) {
            center = [this.state.lng, this.state.lat];
          }
          this.map.setCenter(center);
          this.buildRectanglesGeoJSON();
        }
      );
    });
  };

  private updateMapState = (
    evt:
      | mapboxgl.MapMouseEvent
      | mapboxgl.MapTouchEvent
      | mapboxgl.MapWheelEvent
  ) => {
    const map: mapboxgl.Map =
      (evt as mapboxgl.MapTouchEvent | mapboxgl.MapWheelEvent).map ||
      (evt as mapboxgl.MapMouseEvent).target;

    const center = map.getCenter();
    const zoom = map.getZoom();

    this.props.handleMainMapState({
      lat: center.lat,
      lng: center.lng,
      zoom
    });
  };

  private buildRectanglesGeoJSON = () => {
    if (this.props.searchMode.mode !== SearchMode.INCIDENT) {
      const map = this.map;
      const canvas = map.getCanvas();
      let { width, height } = canvas;

      // workaround for retina displays
      if (window.devicePixelRatio > 1) {
        width = width * 0.5;
        height = height * 0.5;
      }

      const cUL = map.unproject([0, 0]).toArray();
      const cUR = map.unproject([width, 0]).toArray();
      const cLR = map.unproject([width, height]).toArray();
      const cLL = map.unproject([0, height]).toArray();

      const lngArr = [cUL[0], cUR[0], cLR[0], cLL[0]];
      const latArr = [cUL[1], cUR[1], cLR[1], cLL[1]];

      const minLng = Math.min.apply(Math, lngArr);
      const maxLng = Math.max.apply(Math, lngArr);

      const minLat = Math.min.apply(Math, latArr);
      const maxLat = Math.max.apply(Math, latArr);

      const s1 = [];
      s1.push(minLng);
      s1.push(minLat);

      const s2 = [];
      s2.push(maxLng);
      s2.push(minLat);

      const s3 = [];
      s3.push(maxLng);
      s3.push(maxLat);

      const s4 = [];
      s4.push(minLng);
      s4.push(maxLat);

      const bounds = map.getBounds();

      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ] as BBox;

      const zoom = parseInt(map.getZoom().toString(), 10);

      const dataCluster = this.indexCluster.getClusters(bbox, zoom);
      if (map.getSource("camPoints")) {
        (map.getSource("camPoints") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: dataCluster
        });
      }

      if (map.getSource("camPointsFiltered")) {
        (map.getSource("camPointsFiltered") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: dataCluster.filter(f => {
            const p = f.properties as IPointGeoJsonProperties;
            return p.pointdevicetype !== CameraType.Vehicle;
          })
        });
      }

      if (map.getSource("camPointsVehicle")) {
        (map.getSource("camPointsVehicle") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: dataCluster.filter(f => {
            const p = f.properties as IPointGeoJsonProperties;
            return p.pointdevicetype === CameraType.Vehicle;
          })
        });
      }

      const realPoints = dataCluster.filter(
        x => x.properties.cluster === undefined
      );
      const self = this;
      const realPointCoverages: any = realPoints
        .filter(x => {
          return x.properties.pointdevicetype !== CameraType.Vehicle;
        })
        .map(x => {
          if (
            x.properties.pointdevicetype === CameraType.B360 ||
            x.properties.isPtz
          ) {
            return turfCircle(
              x.geometry.coordinates,
              x.properties.lengthoffov,
              {
                steps: 64,
                units: "meters"
              }
            );
          } else {
            const point = self.props.camPoints.coverages.features.find(
              el => el.properties.pointid === x.properties.pointid
            );
            if (point) {
              return point;
            } else {
              return x;
            }
          }
        });
      // const checkCoverage = this.props.camPoints.coverages.features.filter(
      //   (x: any) => (realPointIds as any).includes(x.properties.id)
      // );

      // (map.getSource("camCoverages") as mapboxgl.GeoJSONSource).setData({
      //   type: "FeatureCollection",
      //   features: checkCoverage
      // });
      if (map.getSource("camCoverages")) {
        (map.getSource("camCoverages") as mapboxgl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features: realPointCoverages
        });
      }
    }
  };

  private debounceBuildRectanglesGeoJSON = debounce(
    this.buildRectanglesGeoJSON,
    100
  );

  private reCheckResultData = () => {
    if (this.searchSidebar && this.searchSidebar.current) {
      const searchBar = this.searchSidebar.current.getWrappedInstance();

      if (
        !this.isAboutCenter &&
        this.props.searchMode.active &&
        this.props.searchMode.mode === SearchMode.CCTV &&
        searchBar
      ) {
        searchBar.reSearchCCTV();
      }

      const { mode, active } = this.props.searchMode;

      if (
        mode === SearchMode.INCIDENT &&
        active &&
        this.props.searchResultIncidents.isWithinMap &&
        searchBar
      ) {
        searchBar.reSearchIncidents();
      }

      this.isAboutCenter = false;
    }
  };

  private getDataResult = (
    listId: string[],
    points: GeoJSON.FeatureCollection<Point, IPointGeoJsonProperties>
  ): Array<Feature<Point, IPointGeoJsonProperties>> => {
    if (points) {
      return listId.reduce(
        (final, current) => {
          if (points && points.features && points.features.length > 0) {
            const foundFeat = points.features.find(camFeat => {
              return camFeat && camFeat.properties
                ? camFeat.properties.id === current
                : false;
            });

            if (foundFeat) {
              final.push(foundFeat);
            }
          }
          return final;
        },
        [] as Array<Feature<Point, IPointGeoJsonProperties>>
      );
    }
    return [];
  };

  private toggleSearchSidebar = () => {
    if (!this.props.camPoints.isLoading && this.state.isLoadedMap) {
      this.props.setSearchMode({
        active: !this.props.searchMode.active,
        mode: SearchMode.CCTV
      });
      const searchBar = this.searchSidebar.current.getWrappedInstance();
      if (searchBar) {
        searchBar.reSearchCCTV(!this.props.searchMode.active);
      }
    }
  };

  private getMapBoundCoor = () => {
    const canvas = this.map.getCanvas();
    const w = canvas.width;
    const h = canvas.height;
    const cUL = this.map.unproject([0, 0]).toArray();
    const cUR = this.map.unproject([w, 0]).toArray();
    const cLR = this.map.unproject([w, h]).toArray();
    const cLL = this.map.unproject([0, h]).toArray();
    return [[cUL, cUR, cLR, cLL, cUL]];
  };

  private checkCoverageInBound = (pointCoor: number[][][]) => {
    return (
      polygonIntersect(
        {
          type: "Polygon",
          coordinates: pointCoor
        },
        {
          type: "Polygon",
          coordinates: this.getMapBoundCoor()
        }
      ) !== null
    );
  };

  private onChangeSearchTab = (
    event: React.ChangeEvent<{}>,
    value: SearchMode
  ) => {
    this.props.setSearchMode({
      mode: value
    });
  };

  public componentDidMount() {
    const { zoom } = this.state;
    this.props.loadJsonVersion(this.props.selectedLib);
    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "/3d_building_style.json",
      center: [139.4927085, -20.7255748],
      zoom
    });

    this.draw = new MapboxDraw({
      controls: {
        point: false,
        uncombine_features: false,
        combine_features: false
      }
    });

    this.map.addControl(new mapboxgl.NavigationControl(), "top-left");

    this.map.addControl(this.draw, "top-left");

    this.map.on("load", () => {
      if (this.ismounted) {
        this.setState({
          isLoadedMap: true
        });
      }
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    const {
      searchMode,
      camPoints,
      searchResultCamPoints,
      searchResultIncidents
    } = this.props;
    if (
      (!prevState.isLoadedMap &&
        this.state.isLoadedMap &&
        this.props.jsonVersion) ||
      prevProps.jsonVersion.VersionId !== this.props.jsonVersion.VersionId
    ) {
      this.loadMapData();
    }

    if (
      !prevState.isLoadedMap &&
      this.state.isLoadedMap &&
      searchMode.mode === SearchMode.INCIDENT &&
      searchMode.active
    ) {
      this.updateMapDataModeIncidents();
    }

    if (prevProps.camPoints.timeModified !== camPoints.timeModified) {
      if (this.state.isLoadedMapDataOnce) {
        this.updateMapData();
      } else {
        this.setupMap(camPoints.points);
      }
    }

    if (prevProps.searchMode.active && !searchMode.active) {
      this.clearMapDateIncidents();
    }

    if (
      prevProps.searchMode.mode !== SearchMode.INCIDENT &&
      searchMode.mode === SearchMode.INCIDENT &&
      searchMode.active
    ) {
      this.clearMapDataCCTV();
    }

    if (
      prevProps.searchMode.mode !== SearchMode.CCTV &&
      searchMode.mode === SearchMode.CCTV &&
      searchMode.active
    ) {
      this.clearMapDateIncidents();
      this.updateMapData();
    }

    if (
      prevProps.searchResultCamPoints.timeModified !==
      searchResultCamPoints.timeModified
    ) {
      this.updateMapData();
    }

    if (
      searchResultIncidents.timeModified !==
      prevProps.searchResultIncidents.timeModified
    ) {
      this.updateMapDataModeIncidents();
    }

    if (prevProps.selectedLib !== this.props.selectedLib) {
      if (this.props.searchMode.active) {
        this.toggleSearchSidebar();
      }
      this.closeDrawResult();
    }
  }

  private updateIncidentAddress = (lnglat: LngLat) => {
    const geoCoder = new GeoCodingService();
    geoCoder
      .reverseGeocode({ lat: lnglat.lat, lng: lnglat.lng })
      .then(([result]) => {
        this.setState({
          step: 1,
          incident: {
            address:
              result && result.formatted_address
                ? result.formatted_address
                : "Unknown",
            lnglat: [lnglat.lng, lnglat.lat]
          }
        });
      });
  };

  private onViewAddress = () => {
    const center = this.map.getCenter();
    this.updateIncidentAddress(center);
    const maker = getIncidentMarker(INCIDENT_MAKER_ID, [
      center.lng,
      center.lat
    ]);
    this.draw.changeMode("simple_select").add(maker);

    this.marker = new mapboxgl.Marker({
      draggable: true
    } as any).setLngLat([center.lng, center.lat]);

    this.marker.addTo(this.map);
    (this.marker as any).on("dragend", (event: any) => {
      this.updateIncidentAddress(this.marker.getLngLat());
    });
  };

  private getCamerainMap = (id: string): ICamera | null => {
    const point = this.props.camPoints.points.features.find(
      feature => feature.properties.id === id
    );
    const coverage = this.props.camPoints.coverages.features.find(
      feature => feature.properties.id === id
    );
    if (!point || !coverage) {
      return null;
    }
    return {
      id,
      name: point.properties.pointname,
      point,
      coverage
    };
  };

  private onCreateIncident = () => {
    const { openIncidentTab } = this.props;
    const { drawPolygonResults } = this.state;
    if (!drawPolygonResults) {
      return;
    }

    const cameras = drawPolygonResults.result.map(id =>
      this.getCamerainMap(id)
    );
    const features = drawPolygonResults.feature as Feature<
      Polygon | LineString
    >;

    openIncidentTab({
      cameras: cameras.filter(cam => !!cam).map(cam => cam as ICamera),
      paths: createFeatureCollection([features]),
      ...this.state.incident
    });
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

  public render() {
    const { openAddVideoWall } = this.props;
    return (
      <div className="map">
        <div className="map-inner" ref={this.mapContainer} />
        <DrawResult
          step={this.state.step}
          data={{
            address: this.state.incident.address
          }}
          result={
            this.state.drawPolygonResults && this.props.camPoints.points
              ? this.getDataResult(
                  this.state.drawPolygonResults.result,
                  this.props.camPoints.points
                )
              : []
          }
          isOpenDrawResult={this.state.isOpenDrawResult}
          onCancel={this.closeDrawResult}
          onSelectCamera={this.onSelectResultCamera}
          onViewAddress={this.onViewAddress}
          onCreateIncident={this.onCreateIncident}
          openAddVideoWall={openAddVideoWall}
        />
        <SearchSidebar
          changeUrl={this.props.changeUrl}
          getMapBound={this.getMapBoundCoor}
          onSelectIncident={this.onSelectResultIncident}
          ref={this.searchSidebar}
          currentTab={this.props.searchMode.mode}
          checkPointInBound={this.checkCoverageInBound}
          onChangeTab={this.onChangeSearchTab}
          onSelectCamera={this.onSelectResultCamera}
          onClickToggle={this.toggleSearchSidebar}
          isOpen={this.props.searchMode.active}
        />
        <SearchLocation
          onClickResult={this.onClickFindPlace}
          onClear={this.onClearPlace}
          lat={this.state.lat}
          lng={this.state.lng}
        />
      </div>
    );
  }
}

export default MapBox;
