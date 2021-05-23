import { Dispatch, Store } from "react-redux";
import { IStoreState } from "../../../types";
import {
  IGetLibVersion,
  IGetListLibs,
  ISelectLib,
  setLibVersion,
  setListLibs,
  setListLibsState,
  getListLibs,
  setCurrentLibRole,
  ICreateLib
} from "../actions/libs";
import axios, { AxiosError, AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../../../environment";
import {
  CREATE_LIB,
  GET_LIB_VERSION,
  GET_LIST_LIBS,
  SELECT_LIB
} from "../constants/libs";
import { getMatch } from "src/helpers/url";
import RouteUri from "src/helpers/routeUri";
import paths from "../../../paths";
import { ILib, ILibVersion } from "../types/libs";
import { common, getJsonVersion } from "../../../actions";
import getErrorMessage from "../../../helpers/getErrorMessage";
import Variant from "../../../components/notification/types/variant";
import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { Action } from "redux";
import localStorageKey from "../../../localStorageKey";

type LOCATION_CHANGE = typeof LOCATION_CHANGE;
interface IPathInit extends Action<LOCATION_CHANGE> {}

export const initPathSelectLibs = (store: Store<IStoreState>) => (
  next: Dispatch<IPathInit>
) => (action: LocationChangeAction) => {
  const currentState = store.getState();
  switch (action.type) {
    case LOCATION_CHANGE: {
      if (currentState.auth.isAuth) {
        const match = getMatch(action.payload, new RouteUri(paths.lib));
        if (match) {
          store.dispatch(getListLibs());
        }
      }
    }
  }

  return next(action);
};

export const libsMiddleware = (store: Store<IStoreState>) => (
  next: Dispatch<IGetListLibs | ISelectLib | IGetLibVersion | ICreateLib>
) => (action: IGetListLibs | ISelectLib | IGetLibVersion | ICreateLib) => {
  const currentState = store.getState();
  switch (action.type) {
    case GET_LIST_LIBS: {
      store.dispatch(
        setListLibsState({
          isFailed: false,
          isLoading: true
        })
      );
      axios
        .get(`${REACT_APP_API_URL}/api/v2/library/all`)
        .then((data: AxiosResponse<ILib[]>) => {
          store.dispatch(setListLibs(data.data));
          localStorage.setItem(localStorageKey.libs, JSON.stringify(data.data));
          store.dispatch(
            setListLibsState({
              isFailed: false,
              isLoading: false
            })
          );
        })
        .catch((e: AxiosError) => {
          console.error(e);
          store.dispatch(
            setListLibsState({
              isFailed: true,
              isLoading: false
            })
          );
        });
      break;
    }

    case GET_LIB_VERSION: {
      axios
        .get(
          `${REACT_APP_API_URL}/api/Site/${
            currentState.libs.selectedLib
          }/latest`
        )
        .then((data: AxiosResponse<ILibVersion>) => {
          store.dispatch(setLibVersion(data.data));
        })
        .catch((e: AxiosError) => {
          console.error(e);
          common.fireNotification(store.dispatch)({
            message:
              e.response && e.response.data
                ? getErrorMessage(
                    e.response.data,
                    "Failed get latest library version."
                  )
                : "Failed get latest library version.",
            variant: Variant.ERROR
          });
        });
      break;
    }

    case SELECT_LIB: {
      if (currentState.auth.account) {
        localStorage.setItem(
          localStorageKey.currentLibSelectedBy,
          currentState.auth.account.profile.email
        );
      }
      localStorage.setItem(localStorageKey.currentLib, action.payload);
      localStorage.setItem(
        localStorageKey.libs,
        JSON.stringify(currentState.libs.list)
      );
      const lib = currentState.libs.list.find(l => l.id === action.payload);
      if (lib) {
        store.dispatch(setCurrentLibRole(lib.role));
      }
      getJsonVersion(store.dispatch)(action.payload);
      break;
    }

    case CREATE_LIB: {
      axios
        .post(`${REACT_APP_API_URL}/api/v2/library/new`, action.payload)
        .then((data: AxiosResponse) => {
          store.dispatch(getListLibs());
          if (action.meta.cb) {
            action.meta.cb(true);
          }
          common.fireNotification(store.dispatch)({
            message: "Create lib success.",
            variant: Variant.SUCCESS
          });
        })
        .catch((e: AxiosError) => {
          console.error(e);
          if (action.meta.cb) {
            action.meta.cb(false);
          }
          common.fireNotification(store.dispatch)({
            message:
              e.response && e.response.data
                ? getErrorMessage(e.response.data, "Failed create lib")
                : "Failed create lib",
            variant: Variant.ERROR
          });
        });
      break;
    }
  }
  return next(action);
};
