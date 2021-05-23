import * as React from "react";
import {
  Theme,
  withStyles,
  Switch,
  ListItemSecondaryAction,
  ListSubheader
} from "@material-ui/core";
import IStyleProps from "src/styles/utils";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import MapBox from "./Mapbox";
import { IMapBoxOptions } from "./Mapbox";
import * as classNames from "classnames";
import {
  Polygon,
  Point,
  Feature,
  GeoJsonProperties,
  LineString
} from "geojson";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ICamera from "../types/Camera";
import { createFeatureCollection as createFC } from "src/helpers/geojson";
import InfoForm from "../containers/InfoForm";
import IIncidentTransferData from "../types/IncidentTransferData";
import { IIncidentNote, IIncidentPostInfo } from "../types/IncidentInfo";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as moment from "moment";
import {
  IIncidentDeleteNoteOptions,
  IIncidentDeleteNotePayload,
  IIncidentEditNoteOptions,
  IIncidentEditNotePayload,
  IIncidentSaveNoteOptions,
  IIncidentSaveNotePayload
} from "../actions";
import { CameraType } from "../../../../../types/Camera";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  root: {
    padding: theme.spacing.unit
  },

  paper: {
    padding: theme.spacing.unit,
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit
  },

  paperMap: {
    height: 500
  },
  showRouteButton: {
    position: "absolute",
    top: 0,
    right: 0
  }
});

export interface ICameraProp extends ICamera {
  active?: boolean;
}

export interface IMapProps {
  route: GeoJSON.FeatureCollection<Polygon | LineString, GeoJsonProperties>;
  cameras: ICameraProp[];
  showRoute: boolean;
  incident: IIncidentTransferData;
  id: string;
}
export interface IMapDispatchs {
  createIncidentNote: (
    payload: IIncidentSaveNotePayload,
    options: IIncidentSaveNoteOptions
  ) => void;
  editIncidentNote: (
    payload: IIncidentEditNotePayload,
    options: IIncidentEditNoteOptions
  ) => void;
  onRouteShowChange: (current: boolean) => void;
  onCamVisibleChange: (camId: string) => void;
  onSaveIncident: (info: IIncidentPostInfo) => void;
  deleteIncidentNote: (
    payload: IIncidentDeleteNotePayload,
    options: IIncidentDeleteNoteOptions
  ) => void;
}

const createFeatureCollection = (
  features: Array<Feature<Point | Polygon>>
): GeoJSON.FeatureCollection<Point | Polygon, GeoJsonProperties> => ({
  type: "FeatureCollection",
  features
});

const Map = ({
  classes,
  route,
  cameras,
  showRoute,
  onRouteShowChange,
  onCamVisibleChange,
  incident,
  onSaveIncident,
  createIncidentNote,
  editIncidentNote,
  deleteIncidentNote,
  id
}: IStyleProps & IMapProps & IMapDispatchs) => {
  const activeCams = cameras.filter(cam => cam.active);
  const cameraPoints = createFeatureCollection(
    activeCams.map(cam => cam.point)
  );
  const cameraCoverages = createFeatureCollection(
    activeCams.map(cam => cam.coverage)
  );

  const paths = showRoute
    ? route
    : {
        ...route,
        features: []
      };

  const data = {
    route_polygon: createFC(
      paths.features.filter(feature => feature.geometry.type === "Polygon")
    ),
    route_line: createFC(
      paths.features.filter(feature => feature.geometry.type === "LineString")
    )
  };

  const mapOptions: IMapBoxOptions = {
    center: {
      lng: incident.lnglat[0],
      lat: incident.lnglat[1]
    },
    zoom: 16,
    data: {
      ...data,
      camraIcon: cameraPoints,
      camraIconCreate: cameraPoints,
      cameraCoverage: cameraCoverages
    },
    layers: [
      {
        id: "route_polygon",
        type: "fill",
        paint: {
          "fill-color": "#D20C0C",
          "fill-outline-color": "#D20C0C",
          "fill-opacity": 0.1
        }
      },
      {
        id: "route_line",
        type: "line",
        paint: {
          "line-color": "#D20C0C",
          "line-width": 1
        }
      },
      {
        id: "cameraCoverage",
        type: "fill",
        layout: {},
        paint: {
          "fill-color": "#3388ff",
          "fill-opacity": 0.2
        }
      },
      {
        id: `camraIcon`,
        type: "symbol",
        filter: ["has", "pointDeviceType"],
        layout: {
          "icon-rotate": {
            type: "identity",
            property: "bearing"
          },
          "icon-image": {
            type: "interval",
            property: "pointDeviceType",
            stops: [
              [CameraType.CCTV, "camera"],
              [CameraType.Vehicle, "camera-vehicle"],
              [CameraType.B360, "camera-360"]
            ]
          },
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-rotation-alignment": "map"
        }
      },
      {
        id: `camraIconCreate`,
        type: "symbol",
        filter: ["has", "pointdevicetype"],
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
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-rotation-alignment": "map"
        }
      }
    ]
  };

  const routeShowChange = () => {
    onRouteShowChange(!showRoute);
  };

  const visibleChange = (camId: string) => () => {
    onCamVisibleChange(camId);
  };

  const submitCallback = ({
    address,
    name,
    note
  }: {
    address: { value: string };
    name: { value: string };
    note: { value: string };
  }) => {
    onSaveIncident({
      id,
      address: address.value,
      name: name.value,
      note: note.value,
      shareUserIds: incident.shares || [],
      incidentDateTimeUtc:
        incident.incidentDateTimeUtc || moment.utc().toISOString(),
      pointWithIndexes: cameras.map((cam, idx) => ({
        pointId: cam.id,
        index: idx,
        isShow: cam.active || false
      })),
      lat: incident.lnglat[1],
      lon: incident.lnglat[0],
      jsonStringForRouteOrPolygon: JSON.stringify(paths)
    });
  };
  return (
    <div className={classes.root}>
      <Grid container={true}>
        <Grid item={true} xs={8}>
          <Paper className={classNames(classes.paper, classes.paperMap)}>
            <MapBox
              {...mapOptions}
              onSaveDrawText={createIncidentNote}
              onEditDrawText={editIncidentNote}
              onDeleteDrawText={deleteIncidentNote}
              incidentId={id}
              notes={incident.notes || ([] as IIncidentNote[])}
            >
              <FormControlLabel
                className={classes.showRouteButton}
                control={
                  <Switch
                    checked={showRoute}
                    onChange={routeShowChange}
                    value="checkedB"
                    color="primary"
                  />
                }
                label={`Route ${showRoute ? "Showed" : "Hidden"}`}
              />
            </MapBox>
          </Paper>
        </Grid>
        <Grid item={true} xs={4}>
          <Paper className={classes.paper}>
            <List subheader={<ListSubheader>Camera List</ListSubheader>}>
              {cameras.map(cam => (
                <ListItem key={cam.id}>
                  <ListItemText primary={cam.name} />
                  <ListItemSecondaryAction>
                    <Switch
                      onChange={visibleChange(cam.id)}
                      checked={cam.active}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper className={classes.paper}>
            <InfoForm
              address={incident.address}
              submitCallback={submitCallback}
              id={id}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Map);
