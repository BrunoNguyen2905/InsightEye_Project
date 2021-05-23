import { ISite, ISiteCell, ISiteAlarm } from "./types/Site";
import { FeatureCollection, Feature } from "geojson";

export const siteDatas2GeoCollection = (sites: ISite[]): FeatureCollection => ({
  type: "FeatureCollection",
  features: sites
    .map(siteData2Feature)
    .reduce((features, items) => [...features, ...items], [])
});

export const siteData2Feature = (site: ISite): Feature[] => [
  siteData2PointFeature(site),
  ...siteData2AlarmPointFeature(site)
];

const siteData2PointFeature = (site: ISite): Feature => ({
  type: "Feature",
  properties: {
    siteId: site.bts.siteid,
    id: site.bts.btsid,
    name: site.bts.btsname,
    type: "site"
  },
  geometry: {
    type: "Point",
    coordinates: [site.bts.location.lon, site.bts.location.lat]
  }
});

const siteData2AlarmPointFeature = (site: ISite): Feature[] =>
  site.cells
    .map(cell => cell.alarms.map(alarm => sca2PointFeature(site, cell, alarm)))
    .reduce((siteAlarms, cellAlarms) => [...siteAlarms, ...cellAlarms], []);

const LOCATION_DELTA = 3 / 1000;
const SECTORS = [[1, 1], [1, 0], [0, 1]];

const sca2PointFeature = (
  site: ISite,
  cell: ISiteCell,
  alarm: ISiteAlarm
): Feature => ({
  type: "Feature",
  properties: {
    siteId: site.bts.siteid,
    id: `${site.bts.btsid}_${alarm.serialNumber}`,
    name: `${site.bts.btsname}_${alarm.status}`,
    type: "alarm"
  },
  geometry: {
    type: "Point",
    coordinates: sampleLocation(
      [cell.location.lon, cell.location.lat],
      cell.sector
    )
  }
});

const sampleLocation = (
  [lon, lat]: [number, number],
  sector: number
): [number, number] => {
  return [
    SECTORS[sector][0] * LOCATION_DELTA + lon,
    SECTORS[sector][1] * LOCATION_DELTA + lat
  ];
};

export const alarm2GeoCollection = (
  alarms: ISiteAlarm[],
  sites: ISite[]
): FeatureCollection => ({
  type: "FeatureCollection",
  features: alarms
    .map<[ISiteAlarm, ISite | undefined]>(alarm => {
      return [alarm, sites.find(site => site.bts.siteid === alarm.siteId)];
    })
    .filter(([alarm, site]) => !!site)
    .map(([alarm, site]) => {
      if (!site) {
        throw new Error("exxxx");
      }
      return alarm2Feature(alarm, site);
    })
});

const alarm2Feature = (alarm: ISiteAlarm, site: ISite): Feature => ({
  type: "Feature",
  properties: {
    siteId: site.bts.siteid,
    id: `${site.bts.btsid}_${alarm.serialNumber}`,
    name: `${site.bts.btsname}_${alarm.status}`,
    type: "alarm",
    data: alarm
  },
  geometry: {
    type: "Point",
    coordinates: sampleLocation(
      [site.bts.location.lon, site.bts.location.lat],
      2
    )
  }
});

export const mergeCollection = (
  col1: FeatureCollection,
  col2: FeatureCollection
): FeatureCollection => ({
  type: "FeatureCollection",
  features: [...col1.features, ...col2.features]
});
