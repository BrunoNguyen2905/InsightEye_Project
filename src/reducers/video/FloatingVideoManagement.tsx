import { combineReducers } from "redux";
import {
  CLOSE_FLOATING_VIDEO,
  OPEN_FLOATING_VIDEO
} from "../../constants/VideoConstants";
import {
  ICloseFloatingVideo,
  IOpenFloatingVideo
} from "../../actions/video/FloatingVideo";
import IFloatingVideo from "../../types/FloatingVideo";
const numberOfVideos = 4;
function listFloatingVideo(
  state: IFloatingVideo[] = [],
  action: ICloseFloatingVideo | IOpenFloatingVideo
): IFloatingVideo[] {
  switch (action.type) {
    case CLOSE_FLOATING_VIDEO: {
      return state.filter(x => x.index !== action.payload);
    }
    case OPEN_FLOATING_VIDEO: {
      if (state.length < 4) {
        for (let i = 1; i <= numberOfVideos; i++) {
          const floatingVideo = state.find(e => {
            return e.index === i;
          });
          if (!floatingVideo) {
            const newFloatingView: IFloatingVideo = {
              index: i,
              src: action.payload.src,
              name: action.payload.name,
              type: action.payload.type
            };
            return state.concat(newFloatingView);
          }
        }
      }
    }
  }
  return state;
}

export const floatingVideoManagement = combineReducers({
  listFloatingVideo
});
