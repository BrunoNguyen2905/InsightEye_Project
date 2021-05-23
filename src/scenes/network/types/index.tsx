import { DeckGLProperties } from "deck.gl";
import { ISite, ISiteAlarm } from "./Site";
import IGeoProperties from "./GeoProperties";
import { ISiteDetail, ISiteDetailTab } from "./SiteDetail";
import IJsonVersion from "./JsonVersion";
import { ICamPoints, ISearchMode, ISearchResultCamPoints } from "./camPoints";
import IIncident from "../components/Incident/types";
import { IIncidentsSearchResult } from "./incidents";
import IMapState from "src/types/MapState";

export default interface INetwork {
  viewState: DeckGLProperties;
  siteData: ISite[];
  hoverItem: IGeoProperties | null;
  detailSites: ISiteDetail | null;
  detailTabs: ISiteDetailTab[];
  alarms: ISiteAlarm[];
  jsonVersion: IJsonVersion;
  incident: IIncident;
  camPoints: ICamPoints;
  searchResultCamPoints: ISearchResultCamPoints;
  searchMode: ISearchMode;
  searchResultIncidents: IIncidentsSearchResult;
  mapState: IMapState;
  // tabs: ITabsInfo;
}
