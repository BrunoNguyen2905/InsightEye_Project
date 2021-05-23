import * as React from "react";

import DeckGL, {
  MapController,
  DeckGLProperties,
  EventInfo,
  ScatterplotLayer
} from "deck.gl";
import MapGL, { Viewport, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FeatureCollection, Feature, Point } from "geojson";
// import MapControls from './reacr-map';
// import { experimental } from 'react-map-gl';
import IGeoProperties from "../types/GeoProperties";
import { ISiteAlarm } from "../types/Site";
import AlarmPopup from "./AlarmPopup";
import { History } from "history";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2hhZGVsIiwiYSI6ImNqaDgyYnQycTBlYTYyd21oZmt5dzlzNjEifQ.rMpNQ-93xRtbtdfJlEplxQ";

export interface IMapProps {
  pathname: string | null;
  viewState: DeckGLProperties;
  onViewportChange?: (viewState: Viewport) => void;
  width: number;
  height: number;
  geoJsonData: FeatureCollection;
  rightClickHandle?: (data: any) => void;
  hoverData?: Feature;
  onHover?: (item: IGeoProperties | null) => void;
  onClick?: (item: IGeoProperties, history: History) => void;
}

// class MainMapController extends experimental.MapControls {
//   constructor() {
//     super();
//     // subscribe to additional events
//     this.events = ['click'];
//   }

//   // Override the default handler in MapControls
//   public handleEvent(event: any){
//     console.log(event);
//     if (event.type === 'click') {
//       console.log('hi');
//     }
//     return super.handleEvent(event);
//   }
// }
export interface IRouteProps extends RouteComponentProps<any>, IMapProps {}

function MainMap({
  pathname,
  width,
  height,
  viewState,
  onViewportChange,
  geoJsonData,
  hoverData,
  rightClickHandle,
  onHover,
  onClick,
  history
}: IMapProps & IRouteProps) {
  // const onLayerClick = (info: any, pickedInfos: any, mouseEvent: any) => {
  //   console.log(info, pickedInfos, mouseEvent);
  // }
  viewState = {
    ...viewState,
    width,
    height
  };

  // const geoLayer = new GeoJsonLayer<FeatureCollection, Feature>({
  //   id: 'geojson-layer',
  //   data: geoJsonData,
  //   pickable: true,
  //   stroked: false,
  //   filled: true,
  //   extruded: true,
  //   lineWidthScale: 5,
  //   lineWidthMinPixels: 0.1,
  //   getFillColor: d => {
  //     if ((d.properties as IGeoProperties).type === "alarm") {
  //       return [255, 0, 0, 200];
  //     }
  //     return [0, 255, 0, 200]
  //   },
  //   getLineColor: d => [0, 255, 0, 200],
  //   getRadius: d => {
  //     if ((d.properties as IGeoProperties).type === "alarm") {
  //       return 300/// (viewState.zoom * viewState.zoom * viewState.zoom);
  //     }
  //     return 500/// (viewState.zoom * viewState.zoom* viewState.zoom)
  //   },
  //   getLineWidth: d => 1,
  //   getElevation: d => 5,
  //   onHover: (event: EventInfo<Feature>) => {
  //     // console.log('onHover', event);
  //     if (onHover) {
  //       if (event.object) {
  //         const properties = event.object.properties as IGeoProperties;
  //         onHover(properties);
  //       } else {
  //         onHover(null);
  //       }
  //     }
  //     return true;
  //   },
  //   onClick: (event: EventInfo<Feature>) => {
  //     // console.log('onClick', event);
  //     if (!!onClick && !!event.object && event.object.properties) {
  //       const properties = event.object.properties as IGeoProperties;
  //       onClick(properties);
  //     }
  //     return true;
  //   },
  // });

  const scaletLayer = new ScatterplotLayer<Feature>({
    id: "geojson-layer",
    data: geoJsonData.features,
    pickable: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    getPosition: d => (d.geometry as Point).coordinates as [number, number],
    getColor: d => {
      if ((d.properties as IGeoProperties).type === "alarm") {
        return [255, 0, 0, 200];
      }
      return [0, 255, 0, 200];
    },
    getRadius: d => {
      if ((d.properties as IGeoProperties).type === "alarm") {
        return 30; /// (viewState.zoom * viewState.zoom * viewState.zoom);
      }
      return 50; /// (viewState.zoom * viewState.zoom* viewState.zoom)
    },
    onHover: (event: EventInfo<Feature>) => {
      // console.log('onHover', event);
      if (onHover) {
        if (event.object) {
          const properties = event.object.properties as IGeoProperties;
          onHover(properties);
        } else {
          onHover(null);
        }
      }
      return true;
    },
    onClick: (event: EventInfo<Feature>) => {
      if (!!onClick && !!event.object && event.object.properties) {
        const properties = event.object.properties as IGeoProperties;
        onClick(properties, history);
      }
      return true;
    }
  });

  let popup = null;
  if (hoverData) {
    const [lon, lat] = (hoverData.geometry as Point).coordinates;
    const geoProp = hoverData.properties as IGeoProperties<ISiteAlarm>;
    popup = (
      <Popup
        latitude={lat}
        longitude={lon}
        closeButton={false}
        closeOnClick={false}
        anchor="top"
      >
        <div>{(hoverData.properties as IGeoProperties).name}</div>
        {geoProp.type === "alarm" && geoProp.data ? (
          <AlarmPopup data={geoProp.data} />
        ) : null}
      </Popup>
    );
  }
  return (
    <MapGL
      {...viewState}
      mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      onViewportChange={onViewportChange}
    >
      <DeckGL
        controller={MapController}
        {...viewState}
        layers={[scaletLayer]}
      />
      {popup}
    </MapGL>
  );
}

export default withRouter<IRouteProps>(MainMap);
