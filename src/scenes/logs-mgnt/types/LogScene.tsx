import { ILog } from "./Log";
import ILogRequest from "./LogRequest";

export interface IPagingInfo {
  pageSize: number;
  pageNo: number;
  total?: number;
}

export default interface ILogScene {
  paging: IPagingInfo;
  logs: ILog[];
  filter: ILogRequest;
}
