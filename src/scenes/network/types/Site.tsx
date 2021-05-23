export interface ISitePosition {
  lat: number;
  lon: number;
}

interface IOptionalField {
  key: string;
  value: number;
}
interface ISiteBts {
  type: number;
  countBts: number;
  btsid: string;
  btsname: string;
  carriername: string;
  networkname: string;
  operatorid: string;
  jobid: string;
  siteid: string;
  uploadid: string | null;
  location: ISitePosition;
  totalmsg: number;
  optionalFields: IOptionalField[];
}

export interface ISiteAlarm {
  createdDateUtc: string;
  slogan: string;
  attribute: string;
  moInstance: string;
  moClass: string;
  localCellId: string;
  cellName: string;
  siteId: string;
  serialNumber: string;
  ceasedDateUtc: string;
  status: string;
}

export interface ISiteCell {
  alarms: ISiteAlarm[];
  totalAlarm: number;
  cellid: string;
  btsname: string;
  azimuth: number;
  sector: number;
  technology: string;
  cellname: string;
  uploadid: string;
  operatorid: string;
  siteid: string;
  jobid: string;
  location: ISitePosition;
  antennatype: string;
  frequencytechnologyband: number;
  totalmsg: number;
  optionalFields: IOptionalField[];
}

export interface ISite {
  bts: ISiteBts;
  cells: ISiteCell[];
}
