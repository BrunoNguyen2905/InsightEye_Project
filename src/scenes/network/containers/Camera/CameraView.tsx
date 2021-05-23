import { connect, Dispatch } from "react-redux";
// import * as actions from "src/actions/index";
import CameraView from "../../components/Camera/CameraView";
import {
  ILoadCameraView,
  ILoadRecordVideo,
  IRecordVideo,
  loadCameraView,
  loadRecordCamera,
  saveVideo,
  loadRecordCameraLogs,
  ILoadRecordVideoLogs
} from "../../actions/CameraView";
import { IStoreState } from "src/types";
import {
  IOpenFloatingVideo,
  openFloatingVideo
} from "../../../../actions/video/FloatingVideo";
import {
  ILoadVideoWalls,
  loadVideoWalls
} from "src/scenes/video-wall/actions/index";
import {
  ISetCameraId,
  IShowDialog,
  setCameraId,
  showDialog
} from "../../actions/AddVideoWallDialog";
import { CameraViewType } from "../../types/CameraView";
import { CameraType } from "../../../../types/Camera";

export function mapStateToProps(
  {
    cameraViewManagement: { listCameraView, listRecordVideo, cameraLogs },
    auth,
    libs
  }: IStoreState,
  props: { pointId: string }
) {
  return {
    role: libs.currentRole,
    cameraView: listCameraView.find(cam => cam.pointId === props.pointId),
    listCameraView,
    listRecordVideo,
    auth,
    cameraLogs
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | ILoadRecordVideo
    | IRecordVideo
    | IOpenFloatingVideo
    | IShowDialog
    | ILoadVideoWalls
    | ISetCameraId
    | ILoadCameraView
    | ILoadRecordVideoLogs
  >
) {
  return {
    loadCameraView: (pointId: string, isCameraView: boolean) => {
      if (isCameraView) {
        dispatch(loadCameraView(pointId, CameraViewType.CAMERA_VIEW));
      } else {
        dispatch(loadCameraView(pointId, CameraViewType.INCIDENT_VIEW));
      }
    },

    loadRecordCameraLogs: (videoId: string) => {
      dispatch(loadRecordCameraLogs(videoId));
    },

    searchRecordVideo: (pointId: string, start?: string, end?: string) => (
      page: number
    ) => {
      if (start && end) {
        dispatch(loadRecordCamera(pointId, (page - 1) * 10, start, end));
      }
    },

    saveVideo: (pointId: string) => {
      dispatch(saveVideo(pointId));
    },

    quickView: (
      src: string,
      name: string,
      type: string,
      cameraType: CameraType
    ) => {
      if (cameraType === CameraType.B360) {
        type = type + "360";
      }
      dispatch(openFloatingVideo(src, name, type));
    },

    openAddVideoWall: (cameraId: string) => {
      dispatch(loadVideoWalls());
      dispatch(setCameraId(cameraId));
      dispatch(showDialog());
    },

    searchRecordVideoWithKeyword: (
      pointId: string,
      start?: string,
      end?: string
    ) => {
      dispatch(loadRecordCamera(pointId, 0, start, end));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraView);
