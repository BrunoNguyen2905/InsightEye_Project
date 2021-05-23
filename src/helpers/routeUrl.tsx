import RouteUri from "src/helpers/routeUri";
export default class RouteUrl {
  constructor(private url: string) {}
  get value() {
    return this.url;
  }

  public equal(target: RouteUrl) {
    return this.url === target.value;
  }

  public toUri() {
    return new RouteUri(this.url.replace("/#/", "/"));
  }
}
