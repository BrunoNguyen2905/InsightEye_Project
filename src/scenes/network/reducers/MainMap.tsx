import { IHandleMainMapData, IHandleMainMap, IMainMapHover } from "../actions";
import {
  UPDATE_MAP_DATA,
  HANDLE_VIEWPORT,
  SETUP_AUTHENTICATION,
  HANDLE_MAIN_MAP_STATE
} from "src/constants";
import { DeckGLProperties } from "deck.gl";
import { combineReducers } from "redux";
import { ISite, ISiteAlarm } from "../types/Site";
import IGeoProperties, {
  IPointGeoJsonProperties
} from "../types/GeoProperties";
import {
  MAIN_MAP_HOVER,
  MAIN_MAP_ALARMS,
  ADD_ALARM,
  REMOVE_ALARM,
  MAIN_MAP_SITE_DETAIL,
  MAIN_MAP_DETAIL_SITE_STATE,
  MAIN_MAP_SITE_DETAIL_TAB,
  MAIN_MAP_DETAIL_SITE_TAB_CLOSE
} from "../../../constants/index";
import {
  IMainMapAlarm,
  IAddAlarm,
  IRemoveAlarm,
  IMainMapSiteDetail,
  IMainMapSiteDetailState,
  IMainMapSiteDetailTab,
  IMainMapSiteDetailTabClose,
  IHandleMainMapState
} from "../actions/MainMap";
import { ISiteDetail, ISiteDetailTab } from "../types/SiteDetail";
import IJsonVersion from "../types/JsonVersion";
import { IUpdateJsonVersion } from "../actions/JsonVersion";
import {
  UPDATE_VERSION_JSON,
  SET_CAM_POINTS,
  SET_SEARCH_RESULT_CAM_POINTS,
  SET_SEARCH_MODE_MAIN_MAP
  // UPDATE_CAM_POINTS
} from "../constants";
import {
  ICamPoints,
  ISearchMode,
  ISearchResultCamPoints,
  SearchMode
} from "../types/camPoints";
import { Point, Polygon } from "geojson";
import {
  ISetCamPoints,
  ISetSearchMode,
  ISetSearchResultCamPoints
  // IUpdateCamPoint
} from "../actions/camPoints";
import { incident } from "../components/Incident/reducers";
import { ICoverageGeoJsonProperties } from "../types/GeoProperties";
import {
  IIncidentsSearchResult,
  IPointIncidentGeoJsonProperties
} from "../types/incidents";
import {
  SET_SEARCH_STATE_INCIDENTS,
  SET_SEARCH_CONFIG_INCIDENTS,
  SET_SEARCH_RESULT_INCIDENTS
} from "../constants/incidents";
import {
  ISetSearchConfigIncidents,
  ISetSearchResultIncidents,
  ISetSearchStateIncidents
} from "../actions/incidents";
import { ISetupAuthentication } from "../../auth/actions/Auth";
import IMapState from "../../../types/MapState";

function siteData(state: ISite[] = [], action: IHandleMainMapData): ISite[] {
  switch (action.type) {
    case UPDATE_MAP_DATA:
      return action.payload;
  }
  return state;
}

const viewport = {
  width: 500,
  height: 500,
  longitude: 153.016,
  latitude: -27.7928,
  zoom: 15,
  pitch: 0,
  bearing: 0
};
function viewState(
  state: DeckGLProperties = viewport,
  action: IHandleMainMap
): DeckGLProperties {
  switch (action.type) {
    case HANDLE_VIEWPORT:
      return action.payload;
  }
  return state;
}

function hoverItem(
  state: IGeoProperties | null = null,
  action: IMainMapHover
): IGeoProperties | null {
  switch (action.type) {
    case MAIN_MAP_HOVER:
      return action.payload;
  }
  return state;
}

function detailSites(
  state: ISiteDetail | null,
  action: IMainMapSiteDetail | IMainMapSiteDetailState
): ISiteDetail | null {
  switch (action.type) {
    case MAIN_MAP_DETAIL_SITE_STATE:
      if (state) {
        const oldSite = state[action.payload.siteId];
        return {
          ...state,
          [action.payload.siteId]: {
            data: oldSite && oldSite.data ? oldSite.data : undefined,
            state: {
              loading: Boolean(action.payload.state.loading),
              notFound: Boolean(action.payload.state.notFound)
            }
          }
        };
      } else {
        return {
          [action.payload.siteId]: {
            state: {
              loading: Boolean(action.payload.state.loading),
              notFound: Boolean(action.payload.state.notFound)
            }
          }
        };
      }
    case MAIN_MAP_SITE_DETAIL:
      if (state) {
        return {
          ...state,
          [action.payload.bts.siteid]: {
            data: action.payload,
            state: {
              loading: false,
              notFound: false
            }
          }
        };
      }
      return {
        [action.payload.bts.siteid]: {
          data: action.payload,
          state: {
            loading: false,
            notFound: false
          }
        }
      };
  }
  return state || null;
}

function detailTabs(
  state: ISiteDetailTab[] = [],
  action: IMainMapSiteDetailTab | IMainMapSiteDetailTabClose
): ISiteDetailTab[] {
  switch (action.type) {
    case MAIN_MAP_SITE_DETAIL_TAB:
      const existTab = state.findIndex(tab => {
        return tab.siteid === action.payload.siteid;
      });
      if (existTab >= 0 && state[existTab].name !== action.payload.name) {
        const newState = state.slice(0);
        newState[existTab] = action.payload;
        return newState;
      } else if (existTab === -1) {
        return [...state, action.payload];
      }
      break;
    case MAIN_MAP_DETAIL_SITE_TAB_CLOSE:
      return state.filter(item => {
        return item.siteid !== action.payload;
      });
  }
  return state;
}

function alarms(
  state: ISiteAlarm[] = [],
  action: IMainMapAlarm | IAddAlarm | IRemoveAlarm
): ISiteAlarm[] {
  switch (action.type) {
    case MAIN_MAP_ALARMS:
      return action.payload;
    case ADD_ALARM:
      return state.concat(action.payload);
    case REMOVE_ALARM:
      return state.filter(x => x.siteId !== action.payload[0].siteId);
  }
  return state;
}

const jsonDefault = {
  CreatedDateUtc: "2018-06-29T06:46:42.663",
  PointJsonUrl: "/data/points-23.json",
  CoverageJsonUrl: "/data/coverages-23.json",
  VersionId: "b4987d14-e71f-496e-9e3c-4a5e3451f46a"
};

function jsonVersion(
  state: IJsonVersion = jsonDefault,
  action: IUpdateJsonVersion
): IJsonVersion {
  switch (action.type) {
    case UPDATE_VERSION_JSON:
      if (state.VersionId === action.payload.VersionId) {
        break;
      }
      return action.payload;
  }
  return state;
}

const GEO_CAM_DEFAULT: GeoJSON.FeatureCollection<
  Point,
  IPointGeoJsonProperties
> = {
  type: "FeatureCollection",
  features: []
};

const GEO_COV_DEFAULT: GeoJSON.FeatureCollection<
  Polygon,
  ICoverageGeoJsonProperties
> = {
  type: "FeatureCollection",
  features: []
};

const defaultStateCamPoints: ICamPoints = {
  coverages: GEO_COV_DEFAULT,
  points: GEO_CAM_DEFAULT,
  isFailed: false,
  isLoading: false,
  timeModified: new Date().getTime()
};

function camPoints(
  state: ICamPoints = defaultStateCamPoints,
  action: ISetCamPoints
): ICamPoints {
  switch (action.type) {
    case SET_CAM_POINTS: {
      return {
        ...state,
        ...action.payload
      };
    }
    // case UPDATE_CAM_POINTS: {
    //   const pointFeatures = state.points.features.map(el => {
    //     const point = action.payload.find(
    //       element => element.pointid === el.properties.pointid
    //     );
    //     if (point) {
    //       el.geometry.coordinates = [point.lon, point.lat];
    //     }
    //     return el;
    //   });
    //   return {
    //     ...state,
    //     points: {
    //       ...state.points,
    //       features: pointFeatures
    //     }
    //   };
    // }
  }
  return state;
}

const defaultStateResultCamPoint = {
  result: [],
  keyword: "",
  isWithinMap: false,
  timeModified: new Date().getTime(),
  currentPage: 1,
  limit: 10
};

function searchResultCamPoints(
  state: ISearchResultCamPoints = defaultStateResultCamPoint,
  action: ISetSearchResultCamPoints
) {
  switch (action.type) {
    case SET_SEARCH_RESULT_CAM_POINTS: {
      return {
        ...state,
        ...action.payload
      };
    }
  }
  return state;
}

function searchMode(
  state: ISearchMode = { active: false, mode: SearchMode.CCTV },
  action: ISetSearchMode | ISetupAuthentication
) {
  switch (action.type) {
    case SET_SEARCH_MODE_MAIN_MAP: {
      return {
        ...state,
        ...action.payload
      };
    }
    case SETUP_AUTHENTICATION: {
      if (!action.payload) {
        return {
          active: false,
          mode: SearchMode.CCTV
        };
      }
    }
  }
  return state;
}

const emptyFeatures: GeoJSON.FeatureCollection<
  Point,
  IPointIncidentGeoJsonProperties
> = {
  type: "FeatureCollection",
  features: []
};

const defaultSearchResultIncident = {
  result: {
    total: 0,
    data: [],
    geoJson: emptyFeatures
  },
  keyword: "",
  startDateTimeUtc: "",
  endDateTimeUtc: "",
  coordinates: [],
  isWithinMap: false,
  currentPage: 1,
  limit: 10,
  bound: [],
  timeModified: new Date().getTime(),
  state: {
    isSearching: false,
    isFailed: false
  }
};

function searchResultIncidents(
  state: IIncidentsSearchResult = defaultSearchResultIncident,
  action:
    | ISetSearchStateIncidents
    | ISetSearchConfigIncidents
    | ISetSearchResultIncidents
) {
  switch (action.type) {
    case SET_SEARCH_STATE_INCIDENTS: {
      return {
        ...state,
        state: {
          ...state.state,
          ...action.payload
        },
        timeModified: action.meta.newData
          ? new Date().getTime()
          : state.timeModified
      };
    }
    case SET_SEARCH_CONFIG_INCIDENTS: {
      return {
        ...state,
        ...action.payload
      };
    }
    case SET_SEARCH_RESULT_INCIDENTS: {
      return {
        ...state,
        result: action.payload
      };
    }
  }

  return state;
}

const MAP_STATE_DEFAULT = {
  zoom: 16
};
function mapState(
  state: IMapState = MAP_STATE_DEFAULT,
  action: IHandleMainMapState
): IMapState {
  switch (action.type) {
    case HANDLE_MAIN_MAP_STATE:
      return action.payload;
  }
  return state;
}

export const mainMap = combineReducers({
  siteData,
  viewState,
  hoverItem,
  detailSites,
  detailTabs,
  alarms,
  jsonVersion,
  incident,
  camPoints,
  searchResultCamPoints,
  searchResultIncidents,
  searchMode,
  mapState
});
