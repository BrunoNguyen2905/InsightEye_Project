import { MANAGEMENT_CCTV_SET_CCTV } from "../constants";
import { IDetailCCTVState } from "../types/listCCTV";
import { ISetDetailCCTV } from "../actions/detailCCTV";

export function detailCCTVState(
  state: IDetailCCTVState = {
    data: null,
    isFailed: false,
    isLoading: false
  },
  action: ISetDetailCCTV
): IDetailCCTVState {
  switch (action.type) {
    case MANAGEMENT_CCTV_SET_CCTV:
      if (action.payload) {
        return {
          isFailed:
            typeof action.payload.isFailed !== "undefined"
              ? action.payload.isFailed
              : state.isFailed,
          isLoading:
            typeof action.payload.isLoading !== "undefined"
              ? action.payload.isLoading
              : state.isLoading,
          data: action.payload.data ? action.payload.data : null
        };
      }
      break;
  }
  return state;
}
