import * as JsonData from "./bart.geo.json";
import { FeatureCollection, Feature, Point } from "geojson";

const geoGen = (isGen: boolean): FeatureCollection => {
  if (!isGen) {
    return { ...JsonData } as FeatureCollection;
  }
  return geoMax();
};
const geoMax = () => {
  const GeoJsonData = { ...JsonData } as FeatureCollection;

  const featuresPoint = GeoJsonData.features.filter(feature => {
    return feature.geometry.type === "Point";
  }) as Array<Feature<Point>>;

  // console.log('hello featuresPoint');
  const features: any[] = [];
  for (let idx = 0; idx < 100; idx++) {
    const step = idx / 1000;

    [
      [0, 1],
      [1, 1],
      [1, 0],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [1, -1]
    ].forEach(([mLat, mLon]) => {
      features.push(
        featuresPoint.map(feature => {
          const [lat, lon] = feature.geometry.coordinates;
          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: [lat + mLat * step, lon + mLon * step]
            }
          };
        })
      );
    });
  }
  // console.log('hello bart');
  GeoJsonData.features = GeoJsonData.features.concat(
    features.reduce((res, args) => res.concat(args), [])
  );
  return GeoJsonData;
};
export default geoGen;
