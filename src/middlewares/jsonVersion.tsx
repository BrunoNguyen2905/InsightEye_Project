import { Store, Dispatch } from "react-redux";
import { IStoreState } from "../types";
import { APPLICATION_INIT } from "../constants";
import { IApplicationInit } from "../actions";

export const initJsonVersion = (store: Store<IStoreState>) => (
  next: Dispatch<IApplicationInit>
) => (action: IApplicationInit) => {
  switch (action.type) {
    case APPLICATION_INIT: {
      // getJsonVersion(store)(store.dispatch)();
    }
  }

  return next(action);
};
