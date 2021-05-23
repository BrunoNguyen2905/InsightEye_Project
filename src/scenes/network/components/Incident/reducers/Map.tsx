import { IIncidentMapRouteChange } from "../actions/Map";
import { INCIDENT_MAP_ROUTE_CHANGE } from "../constants/Map";

export function showRoute(
  state: boolean = true,
  action: IIncidentMapRouteChange
): boolean {
  switch (action.type) {
    case INCIDENT_MAP_ROUTE_CHANGE:
      return action.payload;
  }
  return state;
}
