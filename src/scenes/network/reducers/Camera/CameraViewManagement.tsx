import { combineReducers } from "redux";
import {
  CLOSE_CAMERA_VIEW,
  OPEN_CAMERA_VIEW,
  SET_RECORD_VIDEO,
  SET_RECORD_VIDEO_LOGS
} from "../../constants/CameraView";
import {
  ICloseCameraView,
  IOpenCameraView,
  ISetRecordVideo,
  ISetRecordVideoLogs
} from "../../actions/CameraView";
import {
  ICameraView,
  ICamereRecordVideo,
  CLONE_KEY_CAMERA_VIEW,
  ICameraLocation
} from "../../types/CameraView";
// import { VideoUtils } from "src/helpers/videoUrlCreator";
import { cloneReducer, mappingReducer } from "../../../../helpers/mappingRedux";
import { logMgnt } from "src/scenes/logs-mgnt/reducers";
import ILogScene from "../../../logs-mgnt/types/LogScene";

function listCameraView(
  state: ICameraView[] = [],
  action: ICloseCameraView | IOpenCameraView
): ICameraView[] {
  switch (action.type) {
    case CLOSE_CAMERA_VIEW: {
      return state.filter(x => x.pointId !== action.payload);
    }
    case OPEN_CAMERA_VIEW: {
      for (let i = 0; i <= state.length; i++) {
        const cameraView = state.find(e => {
          return e.pointId === action.payload.pointId;
        });
        if (!cameraView) {
          return state.concat(action.payload);
        }
      }
    }
  }
  return state;
}

function listRecordVideo(
  state: ICamereRecordVideo = {
    total: 0,
    recordedVideos: []
  },
  action: ISetRecordVideo
): ICamereRecordVideo {
  switch (action.type) {
    case SET_RECORD_VIDEO: {
      return {
        ...action.payload,
        recordedVideos: action.payload.recordedVideos.map(record => ({
          ...record,
          videoSrc: record.videoSrc
        }))
      };
    }
  }
  return state;
}

function cameraLogs(
  state: ICameraLocation[] = [],
  action: ISetRecordVideoLogs
): ICameraLocation[] {
  switch (action.type) {
    case SET_RECORD_VIDEO_LOGS: {
      return action.payload;
    }
  }
  return state;
}

const logs = cloneReducer<ILogScene>(CLONE_KEY_CAMERA_VIEW)(logMgnt);

export const cameraViewManagement = combineReducers({
  listCameraView,
  listRecordVideo,
  cameraLogs,
  logs: mappingReducer(logs)
});
