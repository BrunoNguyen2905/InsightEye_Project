declare module "@mapbox/mapbox-gl-geocoder" {
  interface options {
    accessToken: string;
  }
  class MapboxGeocoder {
    constructor(options: options);
  }
  export default MapboxGeocoder;
}
