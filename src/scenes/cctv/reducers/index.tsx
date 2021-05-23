import { combineReducers } from "redux";
import { detailCCTVState } from "./detailCCTV";
import { listCTTV, listState } from "./listCCTV";

export const CCTVManagement = combineReducers({
  listCTTV,
  listState,
  detailCCTVState
});
