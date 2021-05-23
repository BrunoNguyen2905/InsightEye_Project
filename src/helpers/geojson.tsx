import { Feature, FeatureCollection, GeometryObject } from "geojson";

export const createFeatureCollection = <T extends GeometryObject, U>(
  features: Array<Feature<T, U>>
): FeatureCollection<T, U> => ({
  type: "FeatureCollection",
  features
});
