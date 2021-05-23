import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import SelectCCTV from "../components/SelectCCTV";
import { getListCCTV, setListCCTVState } from "../actions/listCCTV";
import { getDetailCCTV } from "../actions/formCCTV";

function mapStateToProps({ CCTVManagement, libs }: IStoreState) {
  return {
    selectLib: libs.selectedLib,
    isLoading: CCTVManagement.listState.isLoading,
    listCCTV: CCTVManagement.listCTTV,
    isFailed: CCTVManagement.listState.isFailed,
    totalCCTV: CCTVManagement.listState.total,
    searchKeyword: CCTVManagement.listState.keyword,
    pagingCCTV: {
      skip: CCTVManagement.listState.skip,
      current: CCTVManagement.listState.currentPage
    }
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getList: () => {
      dispatch(getListCCTV());
    },
    getDetailCCTV: (pointid: string) => {
      dispatch(getDetailCCTV(pointid));
    },
    onChangePage: (current: number, skip: number, keyword: string) => (
      page: number
    ) => {
      if (current !== page) {
        dispatch(getListCCTV({ page, skip, keyword }));
      }
    },
    onChangeSearchKeyword: (keyword: string) => {
      dispatch(
        setListCCTVState({
          keyword
        })
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectCCTV);
