import { Dispatch, Store } from "react-redux";
import { IStoreState } from "src/types";
import {
  IIncidentSetDetail,
  IIncidentGetDetail,
  IIncidentSaveClip,
  IIncidentSaveData
} from "../actions/index";
import {
  INCIDENT_SET_DETAIL,
  INCIDENT_GET_DETAIL,
  INCIDENT_SAVE_CLIP,
  INCIDENT_SAVE_DATA
} from "../constants/index";
import * as actions from "../actions";
import IIncidentTransferData from "../types/IncidentTransferData";
import {
  IMappingAction,
  mappingDispatch,
  reduxMappingMove,
  reduxMappingRemove
} from "../../../../../helpers/mappingRedux";
import {
  IIncidentResponseInfo,
  IIcdCamPointResp,
  IIcdCamCoverageResp,
  IPointDisplay
} from "../types/IncidentInfo";
import { Feature, Point, Polygon } from "geojson";
import ICamera from "../types/Camera";
import { updateTab, ICloseTab } from "src/components/TabRoute/actions";
import paths from "src/paths";
import * as moment from "moment";
import { common } from "../../../../../actions";
import Variant from "../../../../../components/notification/types/variant";
import { SAVE_STATUS } from "../types";
import { CLOSE_TAB } from "src/components/TabRoute/constants";

const getCameraFromDetail = (detail: IIncidentResponseInfo): ICamera[] => {
  const pres: {
    [key: string]: {
      id: string;
      feature: Feature<Point, IIcdCamPointResp>;
    };
  } = detail.pointGeoJson.features.reduce((res, feature) => {
    res[feature.properties.pointId] = {
      id: feature.properties.pointId,
      feature
    };
    return res;
  }, {});

  const cres: {
    [key: string]: {
      id: string;
      feature: Feature<Polygon, IIcdCamCoverageResp>;
    };
  } = detail.coverageGeoJson.features.reduce((res, feature) => {
    res[feature.properties.pointid] = {
      id: feature.properties.pointid,
      feature
    };
    return res;
  }, {});

  const cameraShows: {
    [key: string]: IPointDisplay;
  } = detail.pointWithIndex.reduce((res, point) => {
    return {
      ...res,
      [point.pointId]: point
    };
  }, {});

  return Object.keys(cameraShows).map(key => ({
    id: key,
    name: cameraShows[key].pointName || "",
    point: pres[key].feature,
    coverage: cres[key].feature,
    active: cameraShows[key].isShow
  }));
};

export const incidentSetDetailMiddleware = (store: Store<IStoreState>) => (
  next: Dispatch
) => (
  action: IMappingAction<
    IIncidentSetDetail | IIncidentGetDetail | IIncidentSaveData | ICloseTab
  >
) => {
  switch (action.type) {
    case INCIDENT_SET_DETAIL:
      {
        const dispatch = mappingDispatch(store.dispatch, action.key);
        const detail = action.payload;
        const transferData: IIncidentTransferData = {
          cameras: getCameraFromDetail(detail),
          paths: JSON.parse(detail.jsonStringForRouteOrPolygon),
          address: detail.address,
          lnglat: [detail.lon, detail.lat],
          incidentDateTimeUtc: moment.utc(detail.incidentDateUtc).toISOString(),
          name: detail.title,
          notes: detail.notes,
          note: detail.note,
          shares: detail.sharedUsers.map(user => user.id),
          clips: detail.clips
        };

        actions.incidentSetupData(dispatch)(transferData);
        detail.pointWithIndex.filter(point => !point.isShow).forEach(point => {
          actions.incidentToggleCam(dispatch)(point.pointId);
        });

        updateTab(dispatch)("networkRoutes", {
          id: paths.incidentDetail.replace(":id", detail.id),
          name: `Job: ${detail.title}`,
          isAlways: false
        });
      }
      break;

    case INCIDENT_GET_DETAIL:
      {
        incidentGetDetail(action.payload, store, action.key);
      }
      break;
    case INCIDENT_SAVE_DATA:
      {
        const { saveStatus, data } = action.payload;

        if (
          saveStatus === SAVE_STATUS.SAVED &&
          data.id &&
          action.key !== data.id
        ) {
          store.dispatch(reduxMappingMove("INCIDENT", action.key, data.id));
          store.dispatch({
            ...action,
            key: data.id
          });
        }
      }
      break;
    case CLOSE_TAB:
      {
        const tabId = action.payload.tab.id;
        const rgxStr = paths.incidentDetail.replace(":id", "([a-zA-Z0-9-]*$)");
        const rgx = new RegExp(rgxStr);
        const matcher = tabId.match(rgx);
        if (matcher) {
          const iId = matcher[1];
          if (iId) {
            store.dispatch(reduxMappingRemove("INCIDENT", iId));
          }
        }
      }
      break;
  }
  return next(action);
};

const incidentGetDetail = (
  id: string,
  store: Store<IStoreState>,
  dispatchKey: string
) => {
  const dispatch = mappingDispatch(store.dispatch, dispatchKey);
  actions.incidentRequestInfo(store)(dispatch)(id);
};

export const incidentSaveClipMiddleware = (store: Store<IStoreState>) => (
  next: Dispatch
) => (action: IMappingAction<IIncidentSaveClip>) => {
  switch (action.type) {
    case INCIDENT_SAVE_CLIP:
      {
        common.fireNotification(store.dispatch)({
          variant: Variant.SUCCESS,
          message: `Clip create success`
        });
      }
      break;
  }
  return next(action);
};

export * from "./incidentNotes";
