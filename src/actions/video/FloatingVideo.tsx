import {
  CLOSE_FLOATING_VIDEO,
  OPEN_FLOATING_VIDEO
} from "src/constants/VideoConstants";
import { Action } from "redux";
import IFloatingVideo from "../../types/FloatingVideo";

export interface ICloseFloatingVideo extends Action<CLOSE_FLOATING_VIDEO> {
  payload: number;
}

export interface IOpenFloatingVideo extends Action<OPEN_FLOATING_VIDEO> {
  payload: IFloatingVideo;
}

export function closeFloatingVideo(uuid: number): ICloseFloatingVideo {
  return {
    payload: uuid,
    type: CLOSE_FLOATING_VIDEO
  };
}
export function openFloatingVideo(
  src: string,
  name: string,
  type: string
): IOpenFloatingVideo {
  return {
    payload: {
      src,
      name,
      type
    },
    type: OPEN_FLOATING_VIDEO
  };
}
