import { Dispatch, Store } from "react-redux";
import { IStoreState } from "../../../types";
import { ISetSearchMode } from "../actions/camPoints";
import { SET_SEARCH_MODE_MAIN_MAP } from "../constants/camPoints";
import { GET_SEARCH_RESULT_INCIDENTS } from "../constants/incidents";
import axios, { AxiosResponse, Canceler } from "axios";
import { SearchMode } from "../types/camPoints";
import { REACT_APP_API_URL } from "src/environment";
import {
  IGetSearchResultIncidents,
  setSearchConfigIncidents,
  setSearchResultIncidents,
  setSearchStateIncidents
} from "../actions/incidents";
import { debounce } from "lodash-es";
interface IBound {
  lon: number;
  lat: number;
}

let cancelerGetPointApi: Canceler;

const debounceCallSearchKeyword = debounce((cb: () => void) => {
  cb();
}, 250);

export const incidentMainMapMiddleware = (store: Store<IStoreState>) => (
  next: Dispatch
) => (action: ISetSearchMode | IGetSearchResultIncidents) => {
  const currentState = store.getState();
  switch (action.type) {
    case SET_SEARCH_MODE_MAIN_MAP: {
      if (
        action.payload.mode === SearchMode.INCIDENT &&
        (action.payload.active || currentState.mainMap.searchMode.active)
      ) {
        const today = new Date();
        today.setDate(today.getDate() - 3);
        store.dispatch(
          setSearchConfigIncidents({
            currentPage: 1,
            isWithinMap: false,
            keyword: "",
            bound: [],
            endDateTimeUtc: new Date().toISOString(),
            startDateTimeUtc: today.toISOString()
          })
        );
        store.dispatch(
          setSearchStateIncidents({
            isFailed: false,
            isSearching: true
          })
        );
        const newState = store.getState();
        axios
          .post(
            `${REACT_APP_API_URL}/api/v2/incident/${
              currentState.libs.selectedLib
            }/search/${currentState.mainMap.searchResultIncidents.limit}/0`,
            {
              keyword: "",
              endDateTimeUtc:
                newState.mainMap.searchResultIncidents.endDateTimeUtc,
              startDateTimeUtc:
                newState.mainMap.searchResultIncidents.startDateTimeUtc
            }
          )
          .then((data: AxiosResponse) => {
            store.dispatch(setSearchResultIncidents(data.data));
            store.dispatch(
              setSearchStateIncidents(
                {
                  isFailed: false,
                  isSearching: false
                },
                true
              )
            );
          })
          .catch(e => {
            store.dispatch(
              setSearchStateIncidents({
                isFailed: false,
                isSearching: false
              })
            );
            throw e;
          });
      }
      break;
    }
    case GET_SEARCH_RESULT_INCIDENTS: {
      debounceCallSearchKeyword(() => {
        if (cancelerGetPointApi) {
          cancelerGetPointApi();
        }
        const configCurrent = currentState.mainMap.searchResultIncidents;
        store.dispatch(
          setSearchStateIncidents({
            isFailed: false,
            isSearching: true
          })
        );
        axios
          .post(
            `${REACT_APP_API_URL}/api/v2/incident/${
              currentState.libs.selectedLib
            }/search/${configCurrent.limit}/${configCurrent.limit *
              (configCurrent.currentPage - 1)}`,
            {
              keyword: configCurrent.keyword,
              startDateTimeUtc: configCurrent.startDateTimeUtc,
              endDateTimeUtc: configCurrent.endDateTimeUtc,
              coordinates:
                configCurrent.bound.length > 0
                  ? configCurrent.bound[0].reduce(
                      (current, item) => {
                        current.push({
                          lon: item[0],
                          lat: item[1]
                        });
                        return current;
                      },
                      [] as IBound[]
                    )
                  : configCurrent.bound
            },
            {
              cancelToken: new axios.CancelToken(c => {
                cancelerGetPointApi = c;
              })
            }
          )
          .then((data: AxiosResponse) => {
            store.dispatch(setSearchResultIncidents(data.data));
            store.dispatch(
              setSearchStateIncidents(
                {
                  isFailed: false,
                  isSearching: false
                },
                true
              )
            );
          })
          .catch(e => {
            store.dispatch(
              setSearchStateIncidents({
                isFailed: false,
                isSearching: false
              })
            );
            throw e;
          });
      });
    }
  }
  return next(action);
};
