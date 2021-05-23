import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import LogsManagement, { ILogsMngtProps } from "../components/LogsManagement";
import { ILogsMngtDispatchs } from "../components/LogsManagement";
import { ILogsMngtSetPage, logsMngtSetPage } from "../actions";
import {
  ILogsMngtSearch,
  logsMngtSearch,
  logsMngtUpdateFilter,
  ILogsMngtUpdateFilter
} from "../actions/index";
import { IPagingInfo } from "../types/LogScene";
import ILogRequest from "../types/LogRequest";
import { store } from "../../../index";

export function mapStateToProps({
  logMgnt
}: IStoreState): Pick<ILogsMngtProps, "data" | "total"> {
  return {
    data: logMgnt.logs,
    total: logMgnt.paging.total || 0
  };
}
export type LogsExternalProps = Pick<
  ILogsMngtProps,
  Exclude<keyof ILogsMngtProps, "data" | "total">
>;

export function mapDispatchToProps(
  dispatch: Dispatch<
    ILogsMngtSetPage | ILogsMngtSearch | ILogsMngtUpdateFilter
  >,
  props: LogsExternalProps
): ILogsMngtDispatchs {
  return {
    logsMngtPointSearch: () => {
      logsMngtSearch(store)(dispatch)(
        props.pageSize,
        props.pageNo,
        props.filter
      );
    },
    handleChangePage: (paging: IPagingInfo) => {
      logsMngtSetPage(dispatch)(paging);
    },
    updateFilter: (filter: ILogRequest) => {
      logsMngtUpdateFilter(dispatch)(filter);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogsManagement);
