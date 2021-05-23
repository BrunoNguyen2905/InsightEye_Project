import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CCTVSearch from "./SearchSidebar/CCTVSearch";
import IncidentSearch from "./SearchSidebar/IncidentSearch";
import SearchSidebarTemplate from "./SearchSidebar/SearchSidebarTemplate";
import {
  ICamPoints,
  ISearchResultCamPoints,
  SearchMode
} from "../../types/camPoints";
import { ICoverageProperties } from "../../types/GeoProperties";
import { IIncidentsSearchResult } from "../../types/incidents";
import paths from "../../../../paths";

interface IProps {
  getMapBound: () => number[][][];
  setSearchResult: (
    data: {
      isWithinMap: boolean;
      result: string[];
      keyword: string;
      currentPage: number;
      limit: number;
    }
  ) => void;
  isOpen: boolean;
  camPoints: ICamPoints;
  onClickToggle: () => void;
  onSelectCamera: (id: string) => () => void;
  onSelectIncident: (id: string) => () => void;
  checkPointInBound: (coveCoor: number[][][]) => boolean;
  searchResult: ISearchResultCamPoints;
  onChangeTab: (event: React.ChangeEvent<{}>, value: string) => void;
  currentTab: SearchMode;
  searchResultIncidents: IIncidentsSearchResult;
  changeUrl: (url: string) => void;
  setConfigSearchIncidents: (
    data: {
      keyword?: string;
      startDateTimeUtc?: string;
      endDateTimeUtc?: string;
      coordinates?: number[][];
      isWithinMap?: boolean;
      currentPage?: number;
      limit?: number;
      bound?: number[][][];
    }
  ) => void;
}

class SearchSidebar extends React.Component<IProps> {
  public reSearchCCTV = (reset: boolean = false) => {
    this.props.setSearchResult({
      result: this.getResult(
        reset ? "" : this.props.searchResult.keyword,
        reset ? false : this.props.searchResult.isWithinMap
      ),
      keyword: reset ? "" : this.props.searchResult.keyword,
      isWithinMap: reset ? false : this.props.searchResult.isWithinMap,
      currentPage: reset ? 1 : this.props.searchResult.currentPage,
      limit: this.props.searchResult.limit
    });
  };

  public reSearchIncidents = () => {
    this.props.setConfigSearchIncidents({
      bound: this.props.getMapBound()
    });
  };

  private onChangePageSearchCCTV = (page: number) => {
    const { limit, keyword, result, isWithinMap } = this.props.searchResult;
    this.props.setSearchResult({
      ...{
        limit,
        keyword,
        result,
        isWithinMap
      },
      currentPage: page
    });
  };

  private getResult = (keyword: string, isWithinMap: boolean) => {
    return this.props.camPoints.points.features
      .filter(feat => {
        if (isWithinMap) {
          const co = this.props.camPoints.coverages.features.find(cov => {
            const props = cov.properties as ICoverageProperties;
            return props.pointid === feat.properties.pointid;
          });
          return (
            co &&
            this.props.checkPointInBound(co.geometry.coordinates) &&
            (feat.properties.pointname
              .toLowerCase()
              .indexOf(this.props.searchResult.keyword) >= 0 ||
              feat.properties.address
                .toLowerCase()
                .indexOf(this.props.searchResult.keyword) >= 0)
          );
        }
        return (
          feat.properties.pointname.toLowerCase().indexOf(keyword) >= 0 ||
          feat.properties.address.toLowerCase().indexOf(keyword) >= 0
        );
      })
      .reduce(
        (current, feat) => {
          current.push(feat.properties.pointid);
          return current;
        },
        [] as string[]
      );
  };

  private callSearchKeyword = (keyword: string) => {
    this.props.setSearchResult({
      result: this.getResult(keyword, this.props.searchResult.isWithinMap),
      keyword,
      isWithinMap: this.props.searchResult.isWithinMap,
      currentPage: 1,
      limit: this.props.searchResult.limit
    });
  };

  private callSearchKeywordIncident = (keyword: string) => {
    this.props.setConfigSearchIncidents({
      keyword,
      currentPage: 1
    });
  };

  private onChangeCheckSearchCCTVInBound = (check: boolean) => {
    this.props.setSearchResult({
      result: this.getResult(this.props.searchResult.keyword, check),
      keyword: this.props.searchResult.keyword,
      isWithinMap: check,
      currentPage: 1,
      limit: this.props.searchResult.limit
    });
  };

  private onChangeCheckSearchIncidentInBound = (check: boolean) => {
    this.props.setConfigSearchIncidents({
      isWithinMap: check,
      bound: check ? this.props.getMapBound() : [],
      currentPage: 1
    });
  };

  private onChangePageSearchIncident = (page: number) => {
    this.props.setConfigSearchIncidents({
      currentPage: page
    });
  };

  private onChangeDateIncident = (date: Date, name: string) => {
    if (name === "startTime") {
      this.props.setConfigSearchIncidents({
        startDateTimeUtc: date.toISOString()
      });
    }

    if (name === "endTime") {
      this.props.setConfigSearchIncidents({
        endDateTimeUtc: date.toISOString()
      });
    }
  };

  private viewDetailIncident = (id: string) => {
    return () => {
      this.props.changeUrl(paths.incidentDetail.replace(":id", id));
    };
  };

  public render() {
    const {
      searchResult,
      isOpen,
      onClickToggle,
      camPoints,
      onSelectCamera,
      currentTab,
      onChangeTab,
      searchResultIncidents,
      onSelectIncident
    } = this.props;

    const list = camPoints.points.features.filter(feat => {
      return searchResult.result.indexOf(feat.properties.pointid) >= 0;
    });

    const resultCurrentPage = list.slice(
      (searchResult.currentPage - 1) * searchResult.limit,
      searchResult.currentPage * searchResult.limit
    );

    const totalSearchCCTVPage =
      list.length <= searchResult.limit
        ? 1
        : Math.ceil(list.length / searchResult.limit);

    const totalSearchIncidentsPage =
      searchResultIncidents.result.total <= searchResultIncidents.limit
        ? 1
        : Math.ceil(
            searchResultIncidents.result.total / searchResultIncidents.limit
          );

    return (
      <SearchSidebarTemplate isOpen={isOpen} onClickToggle={onClickToggle}>
        <Tabs
          onChange={onChangeTab}
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          fullWidth={true}
        >
          <Tab value={SearchMode.CCTV} label="CCTV" />
          <Tab value={SearchMode.INCIDENT} label="Job" />
        </Tabs>
        <Divider />
        {currentTab === SearchMode.CCTV && (
          <CCTVSearch
            isSearchInBound={searchResult.isWithinMap}
            onChangeCheckSearchBound={this.onChangeCheckSearchCCTVInBound}
            onSelectResult={onSelectCamera}
            result={resultCurrentPage}
            onChangeKeyword={this.callSearchKeyword}
            onChangePage={this.onChangePageSearchCCTV}
            totalPage={totalSearchCCTVPage}
            currentPage={searchResult.currentPage}
            isLoading={camPoints.isLoading}
          />
        )}
        {currentTab === SearchMode.INCIDENT && (
          <IncidentSearch
            viewDetail={this.viewDetailIncident}
            config={{
              keyword: searchResultIncidents.keyword,
              startTime: searchResultIncidents.startDateTimeUtc,
              endTime: searchResultIncidents.endDateTimeUtc
            }}
            onChangeDate={this.onChangeDateIncident}
            onChangeKeyword={this.callSearchKeywordIncident}
            onSelectResult={onSelectIncident}
            onChangePage={this.onChangePageSearchIncident}
            onChangeCheckSearchBound={this.onChangeCheckSearchIncidentInBound}
            isSearchInBound={searchResultIncidents.isWithinMap}
            currentPage={searchResultIncidents.currentPage}
            totalPage={totalSearchIncidentsPage}
            isLoading={searchResultIncidents.state.isSearching}
            result={searchResultIncidents.result.data}
          />
        )}
      </SearchSidebarTemplate>
    );
  }
}

export default SearchSidebar;
