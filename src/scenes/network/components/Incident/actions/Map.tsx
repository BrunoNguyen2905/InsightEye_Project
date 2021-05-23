import { Action } from "redux";
import { INCIDENT_MAP_ROUTE_CHANGE } from "../constants";
import { Dispatch } from "react-redux";

export interface IIncidentMapRouteChange
  extends Action<INCIDENT_MAP_ROUTE_CHANGE> {
  payload: boolean;
}

export const incidentMapRouteChange = (
  dispatch: Dispatch<IIncidentMapRouteChange>
) => (value: boolean) => {
  dispatch({
    type: INCIDENT_MAP_ROUTE_CHANGE,
    payload: value
  });
};
