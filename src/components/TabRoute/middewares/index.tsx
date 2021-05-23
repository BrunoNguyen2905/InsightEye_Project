import { Store, Dispatch } from "react-redux";
import { LOCATION_CHANGE, LocationChangeAction } from "react-router-redux";
import { IStoreState } from "src/types";
import { Action } from "redux";
import { getMatch, getCurrentUri } from "src/helpers/url";
import RouteUri from "src/helpers/routeUri";
import { switchTab } from "../actions";
import finalRoutes, { FinalRouteKey } from "src/routes";
import { IRoute } from "../types/Routes";

type LOCATION_CHANGE = typeof LOCATION_CHANGE;

interface IPathInit extends Action<LOCATION_CHANGE> {}

export const initTabRoutePath = (store: Store<IStoreState>) => (
  next: Dispatch<IPathInit>
) => (action: LocationChangeAction) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      let routeMatch: IRoute | null = null;
      let matchKey: FinalRouteKey | null = null;
      const isFound = (Object.keys(finalRoutes) as FinalRouteKey[]).some(
        routeKey => {
          const matchFinal = finalRoutes[routeKey].find(route => {
            const match = getMatch(
              action.payload,
              new RouteUri(route.uri),
              route.exact
            );

            return !!match;
          });
          if (!!matchFinal) {
            routeMatch = matchFinal;
            matchKey = routeKey;
          }
          return !!matchFinal;
        }
      );

      console.log(routeMatch);

      if (isFound && matchKey && routeMatch) {
        const route = routeMatch as IRoute;
        switchTab(store.dispatch)(matchKey, {
          id: getCurrentUri(action.payload).value,
          name: route.tabName || "",
          isAlways: route.isAlways || false
        });
        if (!action.payload.props) {
          const match = getMatch(
            action.payload,
            new RouteUri(route.uri),
            route.exact
          );
          route.startAction(store.dispatch)({ match });
        } else {
          route.startAction(store.dispatch)(action.payload.props);
        }
      }
    }
  }

  return next(action);
};
