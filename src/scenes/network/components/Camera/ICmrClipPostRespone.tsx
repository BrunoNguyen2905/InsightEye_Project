export default interface ICmrClipPostRespone {
  incidentId: string;
  videoRecordId: string;
  videoSrc: string;
  startTime: number;
  endTime: number;
  videoStartTimeUtc: string;
  videoStartTimeUtcEpoch: number;
  formattedStartTime: string;
  formattedEndTime: string;
  description: string;
  incidentDetailId: string;
  pointName: string;
  pointId: string;
}
