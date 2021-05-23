import axios, { AxiosResponse, AxiosError } from "axios";
import { Dispatch } from "redux";
import {
  common,
  IApplicationInit,
  setLibActive,
  ISetLibActive,
  userBanned,
  IUserBanned
} from "../actions";
import { IUpdateNotification } from "../components/notification/action";
import Variant from "../components/notification/types/variant";
import { Store } from "react-redux";
import { IStoreState } from "../types";
import {
  APPLICATION_INIT,
  SETUP_AUTHENTICATION,
  USER_BANNED
} from "src/constants";
import {
  ISetupAuthentication,
  setupAuthentication
} from "../scenes/auth/actions";
// import IAccount from "../types/Account";
import { UNIQUE_ID } from "../helpers/sessionId";
// import RouteUri from "../helpers/routeUri";
import { User } from "oidc-client";
import {
  ISetApiLoading,
  IUnsetApiLoading,
  setApiLoading,
  unsetApiLoading
} from "../actions/loading";

// const USER_TIME_OUT: number = 600000; // 10 minutes
enum ERROR_MESSAGE {
  LIBRARY_NOT_INACTIVE = "library_is_not_inactive",
  BANNED = "user_is_banned"
}

const initAxiosInterceptor = (
  dispatch: Dispatch<
    | IUpdateNotification
    | ISetupAuthentication
    | ISetLibActive
    | IUserBanned
    | ISetApiLoading
    | IUnsetApiLoading
  >,
  store: Store<IStoreState>
) => {
  // let userTimeOut: any;
  // function initUserTimeOut() {
  //   if (!store.getState().currentUri.equal(new RouteUri("/video-wall"))) {
  //     userTimeOut = setTimeout(() => {
  //       dispatch(setupAuthentication());
  //     }, USER_TIME_OUT);
  //   }
  // }
  axios.interceptors.request.use(
    config => {
      if (config.url) {
        dispatch(setApiLoading(config.url));
      }
      config.headers.eyeview_ssid = UNIQUE_ID;
      return config;
    },
    error => Promise.reject(error)
  );
  axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      if (response.config.url) {
        dispatch(unsetApiLoading(response.config.url));
      }
      // clearTimeout(userTimeOut);
      // initUserTimeOut();
      return response;
    },
    (error: AxiosError) => {
      if (!axios.isCancel(error)) {
        console.log({ ...error });
        switch (error.response ? error.response.status : 0) {
          case 0: {
            common.fireNotification(dispatch)({
              message: `Fail to request server`,
              variant: Variant.ERROR
            });
            break;
          }
          case 400: {
            if (
              error.response &&
              error.response.data &&
              error.response.data.Message === ERROR_MESSAGE.LIBRARY_NOT_INACTIVE
            ) {
              dispatch(setLibActive(false));
            }

            if (
              error.response &&
              (error.response.data === ERROR_MESSAGE.BANNED ||
                (error.response.data.Message &&
                  error.response.data.Message === ERROR_MESSAGE.BANNED) ||
                (error.response.data.message &&
                  error.response.data.message === ERROR_MESSAGE.BANNED))
            ) {
              dispatch(userBanned());
            }
            break;
          }
          case 401: {
            common.fireNotification(dispatch)({
              message: `${error.request.responseURL}: Authentication Fail`,
              variant: Variant.ERROR
            });
            dispatch(setupAuthentication());
            break;
          }
          case 500: {
            common.fireNotification(dispatch)({
              message: `${error.request.responseURL}: Internal Server Error`,
              variant: Variant.ERROR
            });
            break;
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

let interceptorsRquestId = 0;

const setupAuthenforAxios = (account: User) => {
  if (interceptorsRquestId) {
    axios.interceptors.request.eject(interceptorsRquestId);
  }
  interceptorsRquestId = axios.interceptors.request.use(
    config => {
      config.headers.authorization = `${account.token_type} ${
        account.access_token
      }`;
      return config;
    },
    error => Promise.reject(error)
  );
};

export const initAxios = (store: Store<IStoreState>) => (
  next: Dispatch<IApplicationInit | ISetupAuthentication | IUserBanned>
) => (action: IApplicationInit | ISetupAuthentication | IUserBanned) => {
  switch (action.type) {
    case APPLICATION_INIT:
      {
        initAxiosInterceptor(store.dispatch, store);
      }
      break;
    case SETUP_AUTHENTICATION:
      {
        if (action.payload) {
          setupAuthenforAxios(action.payload);
        }
      }
      break;
    case USER_BANNED: {
      const state = store.getState();
      const lib = state.libs.list.find(s => s.id === state.libs.selectedLib);
      common.fireNotification(store.dispatch)({
        message: `You have been banned from using current library ${
          lib ? lib.name : ""
        }. Please change library or contact library owner.`,
        variant: Variant.ERROR
      });

      break;
    }
  }

  return next(action);
};
