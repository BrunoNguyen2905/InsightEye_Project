export enum LogType {
  ALL = -1,
  POINT = 0,
  CAMERA = 1,
  ACCOUNT = 3,
  INCIDENT = 5,
  VIDEO_WALL = 6
}

export interface ILog {
  username: string;
  description: string;
  type: string;
  createdDateUtc: string;
}
