import { combineReducers } from "redux";
import { SET_TAB_ID } from "../constants/TabBoard";
import { ISetTabId } from "../actions/TabBoard";

function tabId(state: string = "/board", action: ISetTabId): string {
  switch (action.type) {
    case SET_TAB_ID: {
      return action.payload;
    }
  }
  return state;
}

export const tabBoardManagement = combineReducers({
  tabId
});
