import axios, { AxiosResponse } from "axios";
const GOOGLE_API_KEY = "AIzaSyDBCIvuishTvgmkiA4mL7IQ69CB4MU-0eQ";
const GOOGLE_API_PLACE_KEY = "AIzaSyCaGsMciSH2zyGv6PEdze1Zq1MgMrPGNgY";
export class GeoCodingService {
  // private geoCoder: GoogleMapsClient;

  public constructor(options?: { withApi?: boolean }) {
    // this.geoCoder = createClient({
    //   key: GOOGLE_API_KEY
    // });

    if (options && options.withApi) {
      this.loadApi();
    }
  }

  public loadApi = () => {
    const oldBlock = document.getElementById("google-map-api");
    if (!oldBlock) {
      const s = document.createElement("script");
      s.id = "google-map-api";
      s.type = "text/javascript";
      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_PLACE_KEY}&libraries=places`;
      document.getElementsByTagName("head")[0].appendChild(s);

      const div = document.createElement("div");
      div.id = "gmap";
      document.body.appendChild(div);
    }
  };

  public reverseGeocode(
    latlng: google.maps.LatLngLiteral
  ): Promise<google.maps.GeocoderResult[]> {
    // const request = {
    //   latlng
    // };
    return new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      axios
        .create()
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
            latlng.lat
          },${latlng.lng}&key=${GOOGLE_API_KEY}`
        )
        .then((resp: AxiosResponse<{ results: any[] }>) => {
          resolve(resp.data.results);
        })
        .catch(error => reject(error));
    });
  }

  public textSearch(text: string, lat: number, lng: number) {
    const mapCenter = new google.maps.LatLng(lat, lng);
    const autoService = new google.maps.places.AutocompleteService();
    return new Promise<google.maps.places.QueryAutocompletePrediction[]>(
      resolve => {
        autoService.getQueryPredictions(
          {
            input: text,
            location: mapCenter,
            radius: 500
          },
          (res: any, status: any) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(res);
            }
          }
        );
      }
    );
  }

  public getPlace(placeId: string) {
    const map = new google.maps.Map(document.getElementById("gmap"), {});
    const placeService = new google.maps.places.PlacesService(map);
    return new Promise<google.maps.places.PlaceResult>(resolve => {
      placeService.getDetails(
        {
          placeId
        },
        (res: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(res);
          }
        }
      );
    });
  }
}
