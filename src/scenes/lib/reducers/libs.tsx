import { combineReducers } from "redux";
import {
  ILib,
  ILibJobQuery,
  ILibsState,
  ILibUser,
  ILibVersion,
  ISearchJobResult
} from "../types/libs";
import {
  ISelectLib,
  ISetJobQuery,
  ISetLibTemplate,
  ISetLibUsers,
  ISetLibVersion,
  ISetListJob,
  ISetListLibs,
  ISetListLibsState
} from "../actions/libs";
import {
  SELECT_LIB,
  SET_JOB_QUERY,
  SET_LIB_USERS,
  SET_LIB_VERSION,
  SET_LIST_JOB,
  SET_LIST_LIBS,
  SET_LIST_LIBS_STATE,
  SET_CURRENT_LIB_ROLE,
  SET_LIB_TEMPLATE
} from "../constants/libs";
import { UserLibRole } from "../../../helpers/permission";
import { ISetCurrentLibRole } from "../actions/libs";

function list(state: ILib[] = [] as ILib[], action: ISetListLibs) {
  switch (action.type) {
    case SET_LIST_LIBS: {
      return action.payload;
    }
  }
  return state;
}

function listState(
  state: ILibsState = {
    isFailed: false,
    isLoading: false
  },
  action: ISetListLibsState
) {
  switch (action.type) {
    case SET_LIST_LIBS_STATE: {
      return {
        ...state,
        ...action.payload
      };
    }
  }
  return state;
}

function selectedLib(state = "", action: ISelectLib) {
  switch (action.type) {
    case SELECT_LIB: {
      return action.payload;
    }
  }
  return state;
}

function selectedLibVersion(
  state: ILibVersion | null = null,
  action: ISetLibVersion
) {
  switch (action.type) {
    case SET_LIB_VERSION: {
      return action.payload;
    }
  }
  return state;
}

function users(state: ILibUser[] = [] as ILibUser[], action: ISetLibUsers) {
  switch (action.type) {
    case SET_LIB_USERS: {
      return action.payload;
    }
  }
  return state;
}

function jobQuery(
  state: ILibJobQuery = {
    assigneeId: "",
    jobStatus: -1,
    keyword: "",
    take: 10,
    skip: 0,
    isLoading: false,
    isFailed: false,
    polygonCoordinates: []
  },
  action: ISetJobQuery
) {
  switch (action.type) {
    case SET_JOB_QUERY: {
      return {
        ...state,
        ...action.payload
      };
    }
  }
  return state;
}

function jobSearchResult(
  state: ISearchJobResult = {
    jobs: [],
    total: 0,
    lastUpdated: new Date().getTime()
  },
  action: ISetListJob
) {
  switch (action.type) {
    case SET_LIST_JOB: {
      return {
        ...action.payload,
        lastUpdated: new Date().getTime()
      };
    }
  }
  return state;
}

function currentRole(
  state: UserLibRole = UserLibRole.BaseUser,
  action: ISetCurrentLibRole
) {
  switch (action.type) {
    case SET_CURRENT_LIB_ROLE: {
      return action.payload;
    }
  }
  return state;
}

function template(state: string = "", action: ISetLibTemplate) {
  switch (action.type) {
    case SET_LIB_TEMPLATE: {
      return action.payload;
    }
  }
  return state;
}

export const libs = combineReducers({
  list,
  listState,
  selectedLib,
  selectedLibVersion,
  users,
  jobQuery,
  jobSearchResult,
  currentRole,
  template
});
