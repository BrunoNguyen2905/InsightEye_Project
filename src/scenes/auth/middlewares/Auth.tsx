import { Store } from "react-redux";
import { IStoreState } from "src/types";
import { Dispatch } from "redux";
import { ISetupAuthentication, ILogout } from "../actions";
import {
  SETUP_AUTHENTICATION,
  APPLICATION_INIT,
  SIGN_IN_SILENT,
  LOGOUT
} from "src/constants";
import { IApplicationInit } from "src/actions";
import * as actions from "../actions";
import { mgr } from "./userManager";
import { ISignInSilent, signInSilent } from "src/actions";
import { getListLibs, selectLib, setListLibs } from "../../lib/actions/libs";
import localStorageKey from "../../../localStorageKey";
const SILENT_TIME_OUT: number = 300000; // 10 minutes

export const saveAccount2LocalStorage = (store: Store<IStoreState>) => (
  next: Dispatch<ISetupAuthentication>
) => (action: ISetupAuthentication) => {
  switch (action.type) {
    case SETUP_AUTHENTICATION: {
      localStorage.setItem(
        localStorageKey.account,
        JSON.stringify(action.payload || {})
      );
    }
  }

  return next(action);
};

export const setupSignIn = (store: Store<IStoreState>) => (
  next: Dispatch<IApplicationInit>
) => (action: IApplicationInit) => {
  switch (action.type) {
    case APPLICATION_INIT: {
      mgr.getUser().then(user => {
        if (user) {
          const time = new Date().getTime();
          if (time < user.expires_at * 1000) {
            store.dispatch(actions.setupAuthentication(user));
            store.dispatch(signInSilent(user.expires_at * 1000 - time));
          }
        } else {
          if (window.location.href.indexOf("#/callback#") === -1) {
            console.log("User not logged in");
          }
        }
        store.dispatch(actions.checkingAuthentication(false));
      });
    }
  }

  return next(action);
};

export const setupSignInSilent = (store: Store<IStoreState>) => (
  next: Dispatch<ISignInSilent>
) => (action: ISignInSilent) => {
  switch (action.type) {
    case SIGN_IN_SILENT: {
      let timeout: number = action.payload - SILENT_TIME_OUT;
      if (timeout < 0) {
        timeout = 100;
      }
      console.log(timeout);
      setTimeout(() => {
        mgr.startSilentRenew();
        mgr.signinSilentCallback();
        mgr.signinSilent().then(el => {
          store.dispatch(actions.setupAuthentication(el));
        });
      }, timeout);
    }
  }

  return next(action);
};

export const logout = (store: Store<IStoreState>) => (
  next: Dispatch<ILogout>
) => (action: ILogout) => {
  switch (action.type) {
    case LOGOUT: {
      mgr.signoutRedirect();
    }
  }
  return next(action);
};

export const recheckAuthentication = (store: Store<IStoreState>) => (
  next: Dispatch<ISetupAuthentication>
) => (action: ISetupAuthentication) => {
  switch (action.type) {
    case SETUP_AUTHENTICATION: {
      if (!action.payload) {
        localStorage.removeItem(localStorageKey.libs);
        localStorage.removeItem(localStorageKey.currentLib);
        localStorage.removeItem(localStorageKey.currentLibSelectedBy);
      } else {
        const currentLib = localStorage.getItem(localStorageKey.currentLib);
        const libs = localStorage.getItem(localStorageKey.libs);
        const selectedBy = localStorage.getItem(
          localStorageKey.currentLibSelectedBy
        );
        if (
          currentLib &&
          libs &&
          selectedBy &&
          selectedBy === action.payload.profile.email
        ) {
          store.dispatch(setListLibs(JSON.parse(libs)));
          store.dispatch(selectLib(currentLib));
          store.dispatch(getListLibs());
        }
      }
    }
  }

  return next(action);
};
