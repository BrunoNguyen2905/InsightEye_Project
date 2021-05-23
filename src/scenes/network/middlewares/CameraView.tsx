import { Store, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import axios, { AxiosResponse } from "axios";
import { ILoadCameraView } from "../actions/CameraView";
import { setTabId } from "src/actions/TabBoard";
import * as actions from "../actions/CameraView";
import { openFloatingVideo } from "src/actions/video/FloatingVideo";
import {
  LOAD_CAMERA_VIEW,
  LOAD_RECORD_VIDEO,
  SAVE_RECORD_VIDEO,
  LOAD_RECORD_VIDEO_LOGS,
  UPDATE_TAB_CAMERA_VIEW
} from "../constants/CameraView";
import {
  ICameraView,
  ICamereRecordVideo,
  ICameraLocation,
  ICameraLocationJSON
} from "../types/CameraView";
import { buildRouteUri } from "../../../helpers/url";
import RouteUri from "../../../helpers/routeUri";
import paths from "src/paths";
import { updateTab } from "src/components/TabRoute/actions";
import { CameraType } from "../../../types/Camera";
import * as Temp from "./log.json";
const tempData = { ...Temp } as {
  data: ICameraLocationJSON[];
};
export const loadCameraView = (store: Store<IStoreState>) => (
  next: Dispatch<ILoadCameraView>
) => (action: ILoadCameraView) => {
  const currentState = store.getState();
  switch (action.type) {
    case LOAD_CAMERA_VIEW: {
      if (action.payload.type === "camera-view") {
        const route: RouteUri = buildRouteUri(paths.boardCameraView, {
          id: action.payload.pointId
        });
        store.dispatch(setTabId(route.value));
      }
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/V2/point/${
            currentState.libs.selectedLib
          }/${action.payload.pointId}/cameras`
        )
        .then((data: AxiosResponse<ICameraView>) => {
          // store.dispatch(navigateToUri());
          switch (action.payload.type) {
            case "incident-view":
              store.dispatch(
                actions.openCameraView({
                  ...data.data,
                  pointId: action.payload.pointId
                })
              );
              break;
            case "camera-view":
              store.dispatch(
                actions.openCameraView({
                  ...data.data,
                  pointId: action.payload.pointId
                })
              );
              store.dispatch(
                actions.updateTabCameraView({
                  ...data.data,
                  pointId: action.payload.pointId
                })
              );
              break;
            case "floating-video":
              if (data.data.pointDeviceType === CameraType.B360) {
                store.dispatch(
                  openFloatingVideo(
                    data.data.liveStreamUrl,
                    data.data.cameraName,
                    "stream360"
                  )
                );
              } else {
                store.dispatch(
                  openFloatingVideo(
                    data.data.liveStreamUrl,
                    data.data.cameraName,
                    "stream"
                  )
                );
              }
              break;
            default:
              break;
          }
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const loadCameraRecordVideo = (store: Store<IStoreState>) => (
  next: Dispatch<actions.ILoadRecordVideo>
) => (action: actions.ILoadRecordVideo) => {
  const currentState = store.getState();
  switch (action.type) {
    case LOAD_RECORD_VIDEO: {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/V2/point/${
            currentState.libs.selectedLib
          }/${action.payload.pointId}/recordvideo/10/${action.payload.skip}`,
          {
            keyword: "",
            startDateUTC: action.payload.start,
            endDateUTC: action.payload.end
          }
        )
        .then((data: AxiosResponse<ICamereRecordVideo>) => {
          store.dispatch(actions.setRecordCamera({ ...data.data }));
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const loadCameraRecordVideoLogs = (store: Store<IStoreState>) => (
  next: Dispatch<actions.ILoadRecordVideoLogs>
) => (action: actions.ILoadRecordVideoLogs) => {
  switch (action.type) {
    case LOAD_RECORD_VIDEO_LOGS: {
      const data: ICameraLocation[] = tempData.data.map(el => ({
        time: parseFloat(el.time),
        lon: parseFloat(el.lon),
        lat: parseFloat(el.lat)
      }));
      store.dispatch(actions.setRecordCameraLogs(data));
    }
  }

  return next(action);
};

export const recordVideo = (store: Store<IStoreState>) => (
  next: Dispatch<actions.IRecordVideo>
) => (action: actions.IRecordVideo) => {
  const currentState = store.getState();
  switch (action.type) {
    case SAVE_RECORD_VIDEO: {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/V2/point/${
            currentState.libs.selectedLib
          }/${action.payload}/forcesaverecord`
        )
        .then((data: AxiosResponse<any>) => {
          store.dispatch(actions.loadRecordCamera(action.payload, 0));
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const updateCameraViewName = (store: Store<IStoreState>) => (
  next: Dispatch<actions.IUpdateTabCameraView>
) => (action: actions.IUpdateTabCameraView) => {
  switch (action.type) {
    case UPDATE_TAB_CAMERA_VIEW: {
      const cameraView = action.payload;

      updateTab(store.dispatch)("networkRoutes", {
        id: paths.boardCameraView.replace(":id", cameraView.pointId),
        name: `Camera: ${cameraView.cameraName}`,
        isAlways: false
      });
    }
  }

  return next(action);
};
