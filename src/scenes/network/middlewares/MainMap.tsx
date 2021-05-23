import { Store } from "react-redux";
import { IStoreState } from "src/types";
import { Dispatch } from "redux";
import { APPLICATION_INIT, HANDLE_MAIN_MAP_STATE } from "src/constants";
import { IApplicationInit } from "src/actions";
import * as actions from "../actions";
import { IHandleMainMapState } from "../actions/MainMap";

const localKey = "mainMapState";
export const saveMainMapState2LocalStorage = (store: Store<IStoreState>) => (
  next: Dispatch<IHandleMainMapState>
) => (action: IHandleMainMapState) => {
  switch (action.type) {
    case HANDLE_MAIN_MAP_STATE: {
      localStorage.setItem(localKey, JSON.stringify(action.payload || {}));
    }
  }

  return next(action);
};

export const exportMainMapStateFromLocalStorage = (
  store: Store<IStoreState>
) => (next: Dispatch<IApplicationInit>) => (action: IApplicationInit) => {
  switch (action.type) {
    case APPLICATION_INIT: {
      const stateStr = localStorage.getItem(localKey);

      if (stateStr) {
        const mapState = stateStr ? JSON.parse(stateStr) : {};
        if (Object.keys(mapState).length) {
          actions.handleMainMapState(store.dispatch)(mapState);
        }
      }
    }
  }

  return next(action);
};
