declare module "*.json" {
    import { FeatureCollection } from 'geojson';
    const value: FeatureCollection;
    export default FeatureCollection;
}