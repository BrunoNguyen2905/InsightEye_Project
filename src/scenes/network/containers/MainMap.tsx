import { connect, Dispatch } from "react-redux";
import * as actions from "src/actions/video/FloatingVideo";
import {
  getCamPoints,
  IGetCamPoints,
  ISetSearchMode,
  setSearchMode
} from "../actions/camPoints";
import {
  ILoadCameraView,
  loadCameraView,
  loadRecordCamera,
  ILoadRecordVideo,
  openCameraView
} from "../actions/CameraView";
import MapBox from "../components/MapBox";
import { IStoreState } from "../../../types";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { SearchMode } from "../types/camPoints";
import IIncidentTransferData from "../components/Incident/types/IncidentTransferData";
import paths from "src/paths";
import {
  IIncidentSetupData,
  handleMainMapState,
  IHandleMainMapState,
  getJsonVersion,
  IUpdateJsonVersion
} from "../actions";
import { incidentSetupData } from "../components/Incident/actions/index";
import { CameraViewType } from "../types/CameraView";
import {
  loadVideoWalls,
  ILoadVideoWalls
} from "src/scenes/video-wall/actions/index";
import {
  showDialog,
  IShowDialog,
  ISetCameraId,
  setListCameraId,
  ISetListCameraId
} from "../actions/AddVideoWallDialog";
import IMapState from "src/types/MapState";
import { User } from "oidc-client";
import { CameraType } from "../../../types/Camera";

export function mapStateToProps({
  libs,
  mainMap: {
    jsonVersion,
    camPoints,
    searchResultCamPoints,
    searchMode,
    searchResultIncidents,
    mapState
  },
  auth
}: IStoreState) {
  return {
    selectedLib: libs.selectedLib,
    role: libs.currentRole,
    account: auth.account as User,
    jsonVersion,
    camPoints,
    searchResultCamPoints,
    searchMode,
    searchResultIncidents,
    mapState
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | actions.IOpenFloatingVideo
    | ILoadCameraView
    | ISetSearchMode
    | actions.IOpenFloatingVideo
    | IGetCamPoints
    | ILoadRecordVideo
    | IIncidentSetupData
    | ILoadVideoWalls
    | IShowDialog
    | ISetCameraId
    | ISetListCameraId
    | IHandleMainMapState
    | IUpdateJsonVersion
  >,
  props: RouteComponentProps<any>
) {
  const switchNavigate = (url: string) => {
    props.history.push(url);
    // dispatch(navigateToUri(new RouteUri(url)));
  };
  return {
    changeUrl: (url: string) => {
      props.history.push(url);
    },
    openFloatingVideo: (url: string, name: string, type?: string) => {
      dispatch(actions.openFloatingVideo(url, name, type ? type : "stream"));
    },
    openQuickVideo: (pointId: string) => {
      dispatch(loadCameraView(pointId, CameraViewType.FLOATING_VIDEO));
    },
    loadCameraView: (pointId: string) => {
      dispatch(loadCameraView(pointId, CameraViewType.CAMERA_VIEW));
      dispatch(loadRecordCamera(pointId, 0));
      // dispatch(loadCameraView(pointId));
      switchNavigate(paths.boardCameraView.replace(":id", pointId));
    },
    loadCamera360: (
      pointId: string,
      cameraName: string,
      url: string,
      address: string
    ) => {
      // dispatch(loadCameraView(pointId, CameraViewType.CAMERA_VIEW));
      // dispatch(loadRecordCamera(pointId, 0));
      // dispatch(loadCameraView(pointId));
      openCameraView({
        pointId,
        cameraName,
        pointDeviceType: CameraType.B360,
        liveStreamUrl: url,
        address,
        cameraId: ""
      });
      switchNavigate(paths.boardCameraView.replace(":id", pointId));
    },
    openIncidentTab: (data: IIncidentTransferData) => {
      incidentSetupData(dispatch)(data);
      switchNavigate(paths.incident);
    },
    loadCamPoints: () => {
      dispatch(getCamPoints());
    },
    loadJsonVersion: (libId: string) => {
      getJsonVersion(dispatch)(libId);
    },
    setSearchMode: (data: { active?: boolean; mode?: SearchMode }) => {
      dispatch(setSearchMode(data));
    },
    openAddVideoWall: (listCameraId: string[]) => {
      dispatch(loadVideoWalls());
      dispatch(setListCameraId(listCameraId));
      dispatch(showDialog());
    },
    handleMainMapState: (mapState: IMapState) => {
      handleMainMapState(dispatch)(mapState);
    }
  };
}

export default withRouter<
  RouteComponentProps<any> & {
    width: number;
    height: number;
  }
>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )<{
    width: number;
    height: number;
  }>(MapBox)
);
