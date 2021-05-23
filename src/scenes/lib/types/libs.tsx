import { UserLibRole } from "../../../helpers/permission";

export interface ILib {
  active: boolean;
  id: string;
  name: string;
  ownerId: string;
  status: number;
  role: UserLibRole;
  type: string;
}

export enum LibActiveStatusText {
  ACTIVE = "Active",
  INACTIVE = "Inactive"
}

export interface ILibsState {
  isLoading: boolean;
  isFailed: boolean;
}

export interface ILibVersion {
  createdDatetimeUtc: string;
  versionId: number;
  siteJsonUrl: string;
}

export interface ILibUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ILibQueryPoint {
  lat: number;
  lon: number;
}

export interface ILibJobQuery {
  keyword: string;
  jobStatus: number;
  assigneeId: string;
  take: number;
  skip: number;
  isLoading: boolean;
  isFailed: boolean;
  polygonCoordinates: ILibQueryPoint[];
}

export interface ILibsStore {
  list: ILib[];
  listState: ILibsState;
  selectedLib: string;
  selectedLibVersion: ILibVersion | null;
  users: ILibUser[];
  jobQuery: ILibJobQuery;
  jobSearchResult: ISearchJobResult;
  currentRole: UserLibRole;
  template: string;
}

export enum LibStatus {
  NOT_IMPORT = 0,
  IMPORTING,
  SUCCESS,
  FAILED
}

export enum LibStatusText {
  NOT_IMPORT = "Not import",
  IMPORTING = "Importing",
  SUCCESS = "Imported",
  FAILED = "Failed import"
}

export interface ISiteData {
  latitude: string;
  longitude: string;
  networkname: string;
  siteid: string;
  sitename: string;
}

export interface ISaveJobData {
  jobName: string;
  address: string;
  lon: number;
  lat: number;
  recommendHeight: number;
  frequency: number;
  candidates: IJobCandidate[];
  engineerId: string;
}

export interface IJobCandidate {
  bendId: string;
  bendSiteName: string;
  lon: number;
  lat: number;
  displayOrder: number;
  recommendHeight: number;
}

export interface IResponseSearchJob {
  total: number;
  jobs: IJob[];
}

export interface ISearchJobResult extends IResponseSearchJob {
  lastUpdated: number;
}

export interface IJob {
  name: string;
  jobStatus: number;
  lat: number;
  lon: number;
  id: string;
  address: string;
}

export enum JobStatus {
  Created = 0,
  Processing = 10,
  Finished = 20
}

export enum IPlan {
  FreeTrial = 0,
  PayAsYouGo = 10,
  Enterprise = 100
}

export enum IPlanText {
  FreeTrial = "Free Trial",
  PayAsYouGo = "Pay As You Go",
  Enterprise = "Enterprise"
}
