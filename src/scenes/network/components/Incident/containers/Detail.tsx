import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import Incident, { IDispatchs, IProps } from "../components";
import * as actions from "../actions";
import {
  IIncidentDeleteNoteOptions,
  IIncidentDeleteNotePayload,
  IIncidentEditNoteOptions,
  IIncidentEditNotePayload,
  IIncidentSaveNoteOptions,
  IIncidentSaveNotePayload
} from "../actions";
import { IIcdClip, IIncidentPostInfo } from "../types/IncidentInfo";
import { mappingDispatch } from "../../../../../helpers/mappingRedux";
import ICmrClipPost from "../../Camera/ICmrClipPost";
import { ILoadRecordVideo, loadRecordCamera } from "src/actions";
import { store } from "../../../../../index";
import { UserLibRole } from "../../../../../helpers/permission";

export interface IIncidentExtenalProps {
  id: string;
}

export function mapStateToProps(
  { mainMap: { incident }, auth, libs }: IStoreState,
  { id }: IIncidentExtenalProps
): IProps {
  const key = id;
  if (!incident.data[key]) {
    return {
      tabIdx: 0,
      route: {
        type: "FeatureCollection",
        features: []
      },
      cams: [],
      showRoute: true,
      id: key
    };
  }

  const hasClipCams = (incident.data[key].clips || []).reduce(
    (res, clip) => ({
      ...res,
      [clip.pointId]: true
    }),
    {}
  );

  return {
    tabIdx: incident.currentTab[key],
    route: incident.data[key].paths,
    cams:
      auth.account && libs.currentRole === UserLibRole.BaseUser
        ? []
        : incident.data[key].cameras.map(cam => ({
            ...cam,
            active:
              hasClipCams[cam.id] ||
              incident.inactives[key][cam.id] === undefined
                ? true
                : !incident.inactives[key][cam.id]
          })),
    showRoute: incident.showRoute[key],
    incident: incident.data[key],
    id: key,
    clips: incident.data[key].clips,
    playingClip: incident.playingClip[key]
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | actions.IIncidentChangeTab
    | actions.IIncidentMapRouteChange
    | actions.IIncidentToggleCam
    | actions.IIncidentSaveData
    | actions.IIncidentGetDetail
    | actions.IIncidentSaveClip
    | ILoadRecordVideo
    | actions.IIncidentPlayClip
    | actions.IIncidentReleasePlayingClip
    | actions.IIncidentSaveNote
    | actions.IIncidentEditNote
    | actions.IIncidentDeleteNote
  >,
  props: IIncidentExtenalProps
): IDispatchs {
  dispatch = mappingDispatch(dispatch, props.id);
  actions.incidentGetInfo(dispatch)(props.id);
  return {
    handleChange: (idx: number, pointId?: string) => {
      if (pointId) {
        dispatch(loadRecordCamera(pointId, 0));
      }
      actions.incidentChangeTab(dispatch)(idx);
    },
    onRouteShowChange: (next: boolean) => {
      actions.incidentMapRouteChange(dispatch)(next);
    },
    onCamVisibleChange: (camId: string) => {
      actions.incidentToggleCam(dispatch)(camId);
    },
    onSaveIncident: (info: IIncidentPostInfo) => {
      actions.incidentSaveData(store)(dispatch)(info);
    },
    createIncidentClip: (clip: ICmrClipPost) => {
      actions.incidentSaveClip(store)(dispatch)({
        ...clip,
        incidentId: props.id
      });
    },
    openClip: (clip: IIcdClip, idx: number) => {
      if (idx) {
        dispatch(loadRecordCamera(clip.pointId, 0));
        actions.incidentChangeTab(dispatch)(idx);
      }
      actions.incidentPlayClip(dispatch)(clip);
    },
    releasePlayingClip: () => {
      actions.incidentReleasePlayClip(dispatch)();
    },
    createIncidentNote: (
      payload: IIncidentSaveNotePayload,
      options: IIncidentSaveNoteOptions
    ) => {
      dispatch(actions.incidentSaveNote(payload, options));
    },
    editIncidentNote: (
      payload: IIncidentEditNotePayload,
      options: IIncidentEditNoteOptions
    ) => {
      dispatch(actions.incidentEditNote(payload, options));
    },
    deleteIncidentNote: (
      payload: IIncidentDeleteNotePayload,
      options: IIncidentDeleteNoteOptions
    ) => {
      dispatch(actions.incidentDeleteNote(payload, options));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{}>(Incident);
