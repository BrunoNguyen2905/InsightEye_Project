import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import Incident, { IProps, IDispatchs } from "../components";
import * as actions from "../actions";
import { IIncidentPostInfo } from "../types/IncidentInfo";
import { NEW_KEY, mappingDispatch } from "../../../../../helpers/mappingRedux";
import { loadRecordCamera, ILoadRecordVideo } from "src/actions";
import { IIncidentSaveNoteOptions, IIncidentSaveNotePayload } from "../actions";
import { IIncidentEditNotePayload } from "../actions";
import { IIncidentDeleteNotePayload } from "../actions";
import { IIncidentDeleteNoteOptions } from "../actions";
import { IIncidentEditNoteOptions } from "../actions";
import * as React from "react";
import { Redirect } from "react-router";
import paths from "src/paths";
import {
  ICloseTab,
  closeTab
} from "../../../../../components/TabRoute/actions/index";
import { store } from "../../../../../index";

export function mapStateToProps({
  mainMap: { incident }
}: IStoreState): IProps {
  const key = NEW_KEY;
  const savedData = incident.saveStatus[key].data;
  const id = savedData && savedData.id ? savedData.id : key;
  return {
    tabIdx: incident.currentTab[key],
    route: incident.data[key].paths,
    cams: incident.data[key].cameras.map(cam => ({
      ...cam,
      active:
        incident.inactives[key][cam.id] === undefined
          ? true
          : !incident.inactives[key][cam.id]
    })),
    showRoute: incident.showRoute[key],
    incident: incident.data[key],
    id
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | actions.IIncidentChangeTab
    | actions.IIncidentMapRouteChange
    | actions.IIncidentToggleCam
    | actions.IIncidentSaveData
    | actions.IIncidentEditNote
    | actions.IIncidentSaveNote
    | actions.IIncidentDeleteNote
    | ILoadRecordVideo
  >
): IDispatchs {
  dispatch = mappingDispatch(dispatch);
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

function mapStateToPropsWrap({  }: IStoreState, props: IProps): IProps {
  return props;
}

function mapDispatchToPropsWrap(
  dispatch: Dispatch<ICloseTab>,
  { id, route }: IProps
) {
  if (id !== NEW_KEY || !route.features.length) {
    closeTab(dispatch)("networkRoutes", {
      id: paths.incident,
      name: "",
      isAlways: false
    });
  }
  return {};
}

const wrapIncident = ({ id, route, ...props }: IProps & IDispatchs) => {
  if (id === NEW_KEY) {
    if (!route.features.length) {
      return <Redirect to={paths.board} />;
    }
    return <Incident id={id} route={route} {...props} />;
  }
  return <Redirect to={paths.incidentDetail.replace(":id", id)} />;
};
const wrapper = connect(
  mapStateToPropsWrap,
  mapDispatchToPropsWrap
)<IProps>(wrapIncident);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{}>(wrapper);
