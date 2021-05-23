import { Point, Polygon, Feature } from "geojson";

export default interface ICamera {
  id: string;
  name: string;
  point: Feature<Point>;
  coverage: Feature<Polygon>;
}
