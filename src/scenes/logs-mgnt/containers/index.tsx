import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import LogsContainer from "../components/LogsContainer";
import { getAllListUser } from "../../../actions/ALLUserList";
import { store } from "../../../index";
import { logsMngtSearch, logsMngtUpdateFilter } from "../actions";
import ILogRequest from "../types/LogRequest";
import { DEFAULT_FILTER } from "../types/DefaultValue";

export function mapStateToProps({ logMgnt, libs }: IStoreState) {
  return {
    selectedLib: libs.selectedLib,
    pageNo: logMgnt.paging.pageNo,
    pageSize: logMgnt.paging.pageSize,
    filter: logMgnt.filter
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getListUser: () => {
      getAllListUser(store)(dispatch)();
    },
    resetFilter: () => {
      logsMngtUpdateFilter(dispatch)({
        ...DEFAULT_FILTER,
        logType: -1,
        userId: ""
      });
    },
    searchLog: (opt: {
      pageNo: number;
      pageSize: number;
      filter: ILogRequest;
    }) => {
      logsMngtSearch(store)(dispatch)(opt.pageSize, opt.pageNo, opt.filter);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogsContainer);
