import { Location } from "history";
import { matchPath, match } from "react-router-dom";
import { REACT_APP_ROUTE_HASH } from "src/environment";
import RouteUri from "./routeUri";
import RouteUrl from "./routeUrl";
import { push } from "react-router-redux";

const getPath = (location: Location | null): string =>
  !REACT_APP_ROUTE_HASH
    ? location
      ? location.pathname
      : "/"
    : location
      ? "/" + location.hash
      : "/#/";

export const routeMatch = (location: Location, uri: RouteUri): boolean => {
  return getMatch(location, uri) != null;
};

export const getMatch = (
  location: Location,
  uri: RouteUri,
  exact: boolean = false
): match<any> | null => {
  const pathName = getPath(location);
  const realUrl = uri.toUrl().value;

  return matchPath(pathName, {
    path: realUrl,
    exact
  });
};

export const getCurrentUri = (location: Location | null): RouteUri =>
  new RouteUrl(getPath(location)).toUri();

export const buildUrl = (
  route: string,
  params?: { [key: string]: string }
): RouteUrl => {
  return buildRouteUri(route, params).toUrl();
};

export const buildRouteUri = (
  route: string,
  params?: { [key: string]: string }
): RouteUri => {
  const paramObj = params || {};
  const uri = route.replace(
    /:([a-zA-Z0-9]*)/g,
    (value1, urlKey: string) => paramObj[urlKey]
  );
  return new RouteUri(uri);
};

export const navigateToUri = (uri: RouteUri) => push(uri.toUrl().value);
