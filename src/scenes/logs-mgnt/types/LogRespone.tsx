import { ILog } from "./Log";

export default interface ILogResponse {
  total: number;
  logs: ILog[];
}
