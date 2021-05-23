import * as moment from "moment";

export const VIDEO_TIME_FORMAT = "DD/MM/YYYY - H:mm:ss";
export const videoTimeFormat = (
  timeUtc: number | string,
  addition: number = 0
) =>
  moment
    .utc(timeUtc)
    .add(addition)
    .local()
    .format(VIDEO_TIME_FORMAT);
