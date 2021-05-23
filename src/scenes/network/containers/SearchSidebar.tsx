import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import SearchSidebar from "../components/MapSidebar/SearchSidebar";
import { setSearchResultCamPoints } from "../actions/camPoints";
import {
  getSearchResultIncidents,
  setSearchConfigIncidents
} from "../actions/incidents";

function mapStateToProps({
  mainMap: { camPoints, searchResultCamPoints, searchResultIncidents }
}: IStoreState) {
  return {
    camPoints,
    searchResult: searchResultCamPoints,
    searchResultIncidents
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setSearchResult: (data: {
      isWithinMap: boolean;
      result: string[];
      keyword: string;
      currentPage: number;
      limit: number;
    }) => {
      dispatch(setSearchResultCamPoints(data, true));
    },
    setConfigSearchIncidents: (data: {
      keyword?: string;
      startDateTimeUtc?: string;
      endDateTimeUtc?: string;
      coordinates?: number[][];
      isWithinMap?: boolean;
      currentPage?: number;
      limit?: number;
      bound?: number[][][];
    }) => {
      dispatch(setSearchConfigIncidents(data));
      dispatch(getSearchResultIncidents());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(SearchSidebar);
