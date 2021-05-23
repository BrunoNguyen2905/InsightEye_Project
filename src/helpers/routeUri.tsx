import RouteUrl from "./routeUrl";
import { REACT_APP_ROUTE_HASH } from "../environment";

export default class RouteUri {
  constructor(private uri: string) {}

  get value() {
    return this.uri;
  }

  public equal(uri: RouteUri) {
    return this.uri === uri.value;
  }
  public toUrl(): RouteUrl {
    if (!REACT_APP_ROUTE_HASH) {
      return new RouteUrl(this.uri);
    }
    return new RouteUrl(`/#${this.uri}`);
  }
}
