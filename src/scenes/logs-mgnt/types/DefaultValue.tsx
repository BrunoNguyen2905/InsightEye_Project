import { IPagingInfo } from "./LogScene";
import ILogRequest from "./LogRequest";
import { ILog } from "./Log";
import * as moment from "moment";

export const DEFAULT_PAGING: IPagingInfo = {
  pageSize: 10,
  pageNo: 1
};

export const DEFAULT_FILTER: () => ILogRequest = () => ({
  startTimeUtc: moment()
    .subtract(3, "days")
    .utc()
    .toISOString(),
  endTimeUtc: moment()
    .utc()
    .toISOString()
});

export const DEFAULT_LOGS: ILog[] = [];
