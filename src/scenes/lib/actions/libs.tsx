import {
  GET_JOB,
  GET_LIB_VERSION,
  GET_LIST_LIBS,
  SAVE_JOB,
  SELECT_LIB,
  SET_JOB_QUERY,
  SET_LIB_USERS,
  SET_LIB_VERSION,
  SET_LIST_JOB,
  SET_LIST_LIBS,
  SET_LIST_LIBS_STATE,
  SET_CURRENT_LIB_ROLE,
  UPLOAD_LIB,
  GET_LIB_TEMPLATE,
  SET_LIB_TEMPLATE,
  CREATE_LIB
} from "../constants/libs";
import { Action } from "redux";
import { UserLibRole } from "../../../helpers/permission";
import {
  ILib,
  ILibJobQuery,
  ILibsState,
  ILibUser,
  ILibVersion,
  IPlan,
  IResponseSearchJob,
  ISaveJobData,
  ISiteData
} from "../types/libs";

export interface IGetListLibs extends Action<GET_LIST_LIBS> {}

export function getListLibs(): IGetListLibs {
  return {
    type: GET_LIST_LIBS
  };
}

export interface ISetListLibs extends Action<SET_LIST_LIBS> {
  payload: ILib[];
}

export function setListLibs(data: ILib[]): ISetListLibs {
  return {
    type: SET_LIST_LIBS,
    payload: data
  };
}

export interface ISetListLibsState extends Action<SET_LIST_LIBS_STATE> {
  payload: Partial<ILibsState>;
}

export function setListLibsState(data: Partial<ILibsState>): ISetListLibsState {
  return {
    type: SET_LIST_LIBS_STATE,
    payload: data
  };
}

export interface ISelectLib extends Action<SELECT_LIB> {
  payload: string;
}

export function selectLib(id: string): ISelectLib {
  return {
    type: SELECT_LIB,
    payload: id
  };
}

export interface IGetLibVersion extends Action<GET_LIB_VERSION> {}

export function getLibVersion(): IGetLibVersion {
  return {
    type: GET_LIB_VERSION
  };
}

export interface ISetLibVersion extends Action<SET_LIB_VERSION> {
  payload: ILibVersion;
}

export function setLibVersion(data: ILibVersion): ISetLibVersion {
  return {
    type: SET_LIB_VERSION,
    payload: data
  };
}

export interface ISetLibUsers extends Action<SET_LIB_USERS> {
  payload: ILibUser[];
}

export function setLibUsers(data: ILibUser[]): ISetLibUsers {
  return {
    type: SET_LIB_USERS,
    payload: data
  };
}

export interface ISaveJob extends Action<SAVE_JOB> {
  payload: ISaveJobData;
  meta: {
    done: (reset: boolean) => void;
  };
}

export function saveJob(
  data: ISaveJobData,
  done: (reset: boolean) => void
): ISaveJob {
  return {
    type: SAVE_JOB,
    payload: data,
    meta: {
      done
    }
  };
}

export interface IUploadLib extends Action<UPLOAD_LIB> {
  payload: {
    libId: string;
    data: ISiteData[];
  };
  meta: {
    done: (reset: boolean) => void;
  };
}

export function uploadLib(
  data: {
    libId: string;
    data: ISiteData[];
  },
  done: (reset: boolean) => void
): IUploadLib {
  return {
    type: UPLOAD_LIB,
    payload: data,
    meta: {
      done
    }
  };
}

export interface IGetJob extends Action<GET_JOB> {
  payload?: string;
}

export function getJob(id?: string) {
  return {
    payload: id,
    type: GET_JOB
  };
}

export interface ISetJobQuery extends Action<SET_JOB_QUERY> {
  payload: Partial<ILibJobQuery>;
}

export function setJobQuery(data: Partial<ILibJobQuery>): ISetJobQuery {
  return {
    payload: data,
    type: SET_JOB_QUERY
  };
}

export interface ISetListJob extends Action<SET_LIST_JOB> {
  payload: IResponseSearchJob;
}

export function setListJob(data: IResponseSearchJob): ISetListJob {
  return {
    payload: data,
    type: SET_LIST_JOB
  };
}

export interface ISetCurrentLibRole extends Action<SET_CURRENT_LIB_ROLE> {
  payload: UserLibRole;
}

export function setCurrentLibRole(role: UserLibRole): ISetCurrentLibRole {
  return {
    payload: role,
    type: SET_CURRENT_LIB_ROLE
  };
}

export interface IGetLibTemplate extends Action<GET_LIB_TEMPLATE> {
  payload: string;
}

export function getLibTemplate(id: string): IGetLibTemplate {
  return {
    type: GET_LIB_TEMPLATE,
    payload: id
  };
}

export interface ISetLibTemplate extends Action<SET_LIB_TEMPLATE> {
  payload: string;
}

export function setLibTemplate(url: string): ISetLibTemplate {
  return {
    type: SET_LIB_TEMPLATE,
    payload: url
  };
}

export interface ICreateLibData {
  name: string;
  type: IPlan;
}

export interface ICreateLib extends Action<CREATE_LIB> {
  payload: ICreateLibData;
  meta: {
    cb?: (success: boolean) => void;
  };
}

export function createLib(
  payload: ICreateLibData,
  cb?: (success: boolean) => void
): ICreateLib {
  return {
    type: CREATE_LIB,
    payload,
    meta: {
      cb
    }
  };
}
