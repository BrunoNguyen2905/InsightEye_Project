import * as React from "react";
import * as Loadable from "react-loadable";
import SectionLoading from "src/components/SectionLoading";
import TabControl, { IDynamicTab } from "src/components/TabControl";
import { Polygon, LineString, GeoJsonProperties } from "geojson";
import { IMapProps, IMapDispatchs, ICameraProp } from "./Map";
import IIncidentTransferData from "../types/IncidentTransferData";
import { IIncidentPostInfo, IIcdClip } from "../types/IncidentInfo";
import ClipTable from "./ClipTable";
import ICmrClipPost from "../../Camera/ICmrClipPost";
import { CameraViewScope } from "../../Camera/CameraView";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { IMyMixisOptions } from "src/withRoot";
import { IStyleTypeProps } from "src/styles/utils";
import {
  IIncidentDeleteNoteOptions,
  IIncidentDeleteNotePayload,
  IIncidentEditNoteOptions,
  IIncidentEditNotePayload,
  IIncidentSaveNoteOptions,
  IIncidentSaveNotePayload
} from "../actions";

const styles = (theme: Theme) =>
  createStyles({
    content: {
      height:
        (theme.mixins as IMyMixisOptions).windowHeight -
        (8 + 6 + 6) * theme.spacing.unit,
      overflow: "auto"
    }
  });

const LoadableMap = Loadable({
  loader: () => import("../components/Map"),
  loading: SectionLoading
});

const LoadableCam = Loadable({
  loader: () => import("../containers/Cam"),
  loading: SectionLoading
});

export interface IProps {
  tabIdx: number;
  cams: ICameraProp[];
  showRoute: boolean;
  route: GeoJSON.FeatureCollection<Polygon | LineString, GeoJsonProperties>;
  incident?: IIncidentTransferData;
  id: string;
  clips?: IIcdClip[];
  playingClip?: IIcdClip;
}

export interface IDispatchs {
  handleChange: (tabIdx: number, pointId?: string) => void;
  onRouteShowChange: (current: boolean) => void;
  onCamVisibleChange: (camId: string) => void;
  onSaveIncident: (info: IIncidentPostInfo) => void;
  createIncidentClip?: (clip: ICmrClipPost) => void;
  openClip?: (clip: IIcdClip, idx?: number) => void;
  releasePlayingClip?: () => void;
  createIncidentNote: (
    payload: IIncidentSaveNotePayload,
    options: IIncidentSaveNoteOptions
  ) => void;
  editIncidentNote: (
    payload: IIncidentEditNotePayload,
    options: IIncidentEditNoteOptions
  ) => void;
  deleteIncidentNote: (
    payload: IIncidentDeleteNotePayload,
    options: IIncidentDeleteNoteOptions
  ) => void;
}

const Incident = ({
  tabIdx,
  route,
  cams,
  showRoute,
  handleChange,
  onRouteShowChange,
  onCamVisibleChange,
  incident,
  onSaveIncident,
  id,
  clips,
  createIncidentClip,
  playingClip,
  openClip,
  releasePlayingClip,
  classes,
  createIncidentNote,
  editIncidentNote,
  deleteIncidentNote
}: IStyleTypeProps<typeof styles> & IProps & IDispatchs) => {
  let tabs: IDynamicTab[] = [
    // {
    //   label: "Info",
    //   component: () => <LoadableInfo />
    // }
  ];
  if (!incident) {
    return <div>Loading</div>;
  }

  const mapOptions: IMapProps & IMapDispatchs = {
    route,
    cameras: cams,
    showRoute,
    onRouteShowChange,
    onCamVisibleChange,
    createIncidentNote,
    incident,
    onSaveIncident,
    editIncidentNote,
    deleteIncidentNote,
    id
  };

  tabs.push({
    label: "Map",
    component: () => <LoadableMap {...mapOptions} />
  });

  const activeCams = cams.filter(cam => cam.active);

  if (activeCams.length > 0) {
    tabs = [
      ...tabs,
      ...activeCams.map(cam => ({
        label: cam.name,
        component: () => {
          const clip =
            !playingClip || playingClip.pointId !== cam.id
              ? undefined
              : playingClip;
          return (
            <LoadableCam
              pointId={cam.id}
              createIncidentClip={createIncidentClip}
              scope={CameraViewScope.INCIDENT}
              playingClip={clip}
              releasePlayingClip={releasePlayingClip}
            />
          );
        }
      }))
    ];
  }

  const tabChange = (idx: number) => {
    if (!idx) {
      handleChange(idx);
    } else {
      const pointId = activeCams[idx - 1].id;
      handleChange(idx, pointId);
    }
  };

  const openTabClip = (clip: IIcdClip) => {
    if (!openClip) {
      return;
    }
    const tabClipIdx = activeCams.findIndex(cam => cam.id === clip.pointId);
    openClip(clip, tabIdx !== tabClipIdx + 1 ? tabClipIdx + 1 : undefined);
  };

  return (
    <TabControl
      value={tabIdx === -1 ? 0 : tabIdx}
      tabs={tabs}
      changeTab={tabChange}
      extendClasses={classes}
    >
      {openClip && <ClipTable clips={clips || []} openClip={openTabClip} />}
    </TabControl>
  );
};

export default withStyles(styles, { withTheme: true })(Incident);
