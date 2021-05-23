import { LogType } from "./Log";

export default interface ILogRequest {
  userId?: string;
  logType?: LogType;
  startTimeUtc: string;
  endTimeUtc: string;
}
