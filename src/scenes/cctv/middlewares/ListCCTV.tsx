import { Store, Dispatch } from "react-redux";
import { LOCATION_CHANGE } from "react-router-redux";
import { IStoreState } from "src/types";
import { Action } from "redux";
import axios, {
  AxiosError,
  AxiosPromise,
  AxiosResponse,
  CancelToken,
  Canceler
} from "axios";
import { debounce } from "lodash-es";
import {
  setListCCTV,
  IGetListCCTV,
  setListCCTVState,
  ISetListCCTVState
} from "../actions/listCCTV";
import {
  MANAGEMENT_CCTV_GET_LIST_CCTV,
  MANAGEMENT_CCTV_SET_LIST_CCTV_STATE
} from "../constants";
import { REACT_APP_API_URL } from "../../../environment";
import { ICCTV } from "../types/listCCTV";

export type LOCATION_CHANGE = typeof LOCATION_CHANGE;

export interface IPathInit extends Action<LOCATION_CHANGE> {}

interface IListCCTVResponse {
  data: ICCTV[];
  total: number;
}

function pointsSearch(
  {
    token,
    skip,
    skipped = 0,
    keyword = ""
  }: {
    token: string;
    keyword?: string;
    skip: number;
    skipped?: number;
  },
  libraryId: string,
  tokenCancel?: CancelToken
): AxiosPromise {
  return axios.post(
    `${REACT_APP_API_URL}/api/v2/point/${libraryId}/mgnt/search/${skip}/${skipped}`,
    {
      keyword
    },
    {
      cancelToken: tokenCancel ? tokenCancel : undefined
    }
  );
}

const debounceCallSearchKeyword = debounce((cb: () => void) => {
  cb();
}, 250);

let cancelerGetPointApi: Canceler;

export const listCCTV = (store: Store<IStoreState>) => (next: Dispatch) => (
  action: IGetListCCTV | ISetListCCTVState
) => {
  const currentState = store.getState();
  const account = currentState.auth.account;
  const token = account ? account.access_token : "";

  switch (action.type) {
    case MANAGEMENT_CCTV_GET_LIST_CCTV: {
      if (cancelerGetPointApi) {
        cancelerGetPointApi();
      }
      store.dispatch(setListCCTVState({ isLoading: true, isFailed: false }));
      const keyword =
        action.payload && action.payload.keyword ? action.payload.keyword : "";
      const page =
        action.payload && action.payload.page ? action.payload.page - 1 : 0;
      const skip = currentState.CCTVManagement.listState.skip;
      pointsSearch(
        { token, skip, skipped: page * skip, keyword },
        currentState.libs.selectedLib,
        new axios.CancelToken(c => {
          cancelerGetPointApi = c;
        })
      )
        .then((response: AxiosResponse<IListCCTVResponse>) => {
          store.dispatch(setListCCTV(response.data.data));
          store.dispatch(
            setListCCTVState({
              isLoading: false,
              total: response.data.total,
              currentPage: page + 1
            })
          );
        })
        .catch(() => {
          store.dispatch(
            setListCCTVState({ isLoading: false, isFailed: true })
          );
        });
      break;
    }
    case MANAGEMENT_CCTV_SET_LIST_CCTV_STATE: {
      if (
        (action.payload.keyword &&
          action.payload.keyword !==
            currentState.CCTVManagement.listState.keyword) ||
        (currentState.CCTVManagement.listState.keyword !== "" &&
          action.payload.keyword === "")
      ) {
        debounceCallSearchKeyword(() => {
          if (cancelerGetPointApi) {
            cancelerGetPointApi();
          }
          store.dispatch(
            setListCCTVState({
              isLoading: true,
              isFailed: false
            })
          );
          pointsSearch(
            {
              token,
              keyword: action.payload.keyword,
              skip: currentState.CCTVManagement.listState.skip
            },
            currentState.libs.selectedLib,
            new axios.CancelToken(c => {
              cancelerGetPointApi = c;
            })
          )
            .then((response: AxiosResponse<IListCCTVResponse>) => {
              store.dispatch(setListCCTV(response.data.data));
              store.dispatch(
                setListCCTVState({
                  currentPage: 1,
                  isLoading: false,
                  isFailed: false,
                  total: response.data.total
                })
              );
            })
            .catch((e: AxiosError) => {
              if (!axios.isCancel(e)) {
                store.dispatch(
                  setListCCTVState({ isLoading: false, isFailed: true })
                );
              }
            });
        });
        break;
      }
    }
  }
  return next(action);
};
