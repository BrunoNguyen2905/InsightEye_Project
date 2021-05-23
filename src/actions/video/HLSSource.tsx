import { Action } from "redux";
import { VIDEO_CONTROL } from "../../constants/VideoConstants";

export interface IVideoControlData {
  address: string;
  username: string;
  password: string;
  direction: {
    x: number;
    y: number;
    z: number;
  };
  timeout: number;
}

export interface IVideoControl extends Action<VIDEO_CONTROL> {
  payload: IVideoControlData;
}

export function videoControl(data: IVideoControlData): IVideoControl {
  return {
    type: VIDEO_CONTROL,
    payload: data
  };
}
