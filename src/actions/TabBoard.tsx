import { SET_TAB_ID } from "../constants/TabBoard";
import { Action } from "redux";

export interface ISetTabId extends Action<SET_TAB_ID> {
  payload: string;
}

export function setTabId(tabId: string): ISetTabId {
  return {
    payload: tabId,
    type: SET_TAB_ID
  };
}
