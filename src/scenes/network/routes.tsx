import * as Loadable from "react-loadable";
import SectionLoading from "../../components/SectionLoading";
import * as React from "react";
import {
  IStartBoardComponent,
  IStartIncidentComponent
} from "./actions/MainMap";
import * as actions from "./actions";
import { IRoutes } from "src/components/TabRoute/types/Routes";
import { Dispatch } from "redux";
import { ILoadCameraView } from "./actions/CameraView";
import paths from "src/paths";
// import { CameraViewType } from "./types/CameraView";

const LoadableMapBoard = Loadable({
  loader: () => import("./containers/MapBoard"),
  loading: SectionLoading
});

const LoadableIncident = Loadable({
  loader: () => import("./components/Incident"),
  loading: SectionLoading
});

const LoadableIncidentDetail = Loadable({
  loader: () => import("./components/Incident/containers/Detail"),
  loading: SectionLoading
});
const LoadableCamera = Loadable({
  loader: () => import("./containers/Camera/CameraView"),
  loading: SectionLoading
});
const LoadableCamera360 = Loadable({
  loader: () => import("./components/Camera360"),
  loading: SectionLoading
});

const networkRoutes: IRoutes<
  IStartBoardComponent | IStartIncidentComponent | ILoadCameraView
> = [
  {
    isAlways: true,
    exact: true,
    tabName: "Network",
    uri: paths.board,
    component: () => <LoadableMapBoard />,
    startAction: actions.startBoardComponent
  },
  {
    exact: true,
    tabName: "New Job",
    uri: paths.incident,
    component: () => <LoadableIncident />,
    startAction: actions.startIncidentComponent
  },
  {
    exact: true,
    tabName: "Job Detail",
    uri: paths.incidentDetail,
    component: ({ match }: { match: { params: { id: string } } }) => (
      <LoadableIncidentDetail id={match.params.id} />
    ),
    startAction: actions.startIncidentComponent
  },
  {
    exact: false,
    tabName: "Camera",
    uri: paths.boardCameraView,
    component: ({ match }: { match: { params: { id: string } } }) => (
      <LoadableCamera pointId={match.params.id} />
    ),
    startAction: (dispatch: Dispatch<ILoadCameraView>) => ({
      match
    }: {
      match: { params: { id: string } };
    }) => {
      // dispatch(
      //    actions.loadCameraView(match.params.id, CameraViewType.CAMERA_VIEW)
      // )
    }
  },
  {
    exact: false,
    tabName: "Camera 360",
    uri: paths.boardCamera360,
    component: ({ match }: { match: { params: { id: string } } }) => (
      <LoadableCamera360 />
    ),
    startAction: (dispatch: Dispatch<ILoadCameraView>) => ({
      match
    }: {
      match: { params: { id: string } };
    }) => {
      console.log("LoadableCamera360 start");
    }
  }
];

export default networkRoutes;
