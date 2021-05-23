import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import LogsManagement, {
  ILogsMngtProps,
  ILogsMngtDispatchs
} from "src/scenes/logs-mgnt/components/LogsManagement";
import {
  ILogsMngtSetPage,
  ILogsMngtSearch,
  ILogsMngtUpdateFilter,
  logsMngtSetPage,
  logsMngtUpdateFilter
} from "src/scenes/logs-mgnt/actions";
import { IPagingInfo } from "src/scenes/logs-mgnt/types/LogScene";
import ILogRequest from "src/scenes/logs-mgnt/types/LogRequest";
import {
  mappingDispatch,
  cloneDispatch
} from "../../../../helpers/mappingRedux";
import { CLONE_KEY_CAMERA_VIEW } from "../../types/CameraView";
import { logsMngtPointSearch } from "src/actions";
import { store } from "../../../../index";

export function mapStateToProps(
  { cameraViewManagement: { logs } }: IStoreState,
  props: LogsExternalProps
): Pick<ILogsMngtProps, "data" | "total"> {
  const logsData = logs[props.cameraId];
  if (!logsData) {
    return {
      data: [],
      total: 0
    };
  }
  return {
    data: logsData.logs,
    total: logsData.paging.total || 0
  };
}
export type LogsExternalProps = Pick<
  ILogsMngtProps,
  Exclude<keyof ILogsMngtProps, "data" | "total">
> & {
  cameraId: string;
};

type ActionType = ILogsMngtSetPage | ILogsMngtSearch | ILogsMngtUpdateFilter;
export function mapDispatchToProps(
  dispatch: Dispatch<ActionType>,
  props: LogsExternalProps
): ILogsMngtDispatchs {
  const clone = cloneDispatch<ActionType>(CLONE_KEY_CAMERA_VIEW)(dispatch);
  const mapDispatch = mappingDispatch(clone, props.cameraId);
  return {
    logsMngtPointSearch: () => {
      logsMngtPointSearch(store)(mapDispatch)(
        props.pageSize,
        props.pageNo,
        props.filter,
        props.cameraId
      );
    },
    handleChangePage: (paging: IPagingInfo) => {
      logsMngtSetPage(mapDispatch)(paging);
    },
    updateFilter: (filter: ILogRequest) => {
      logsMngtUpdateFilter(mapDispatch)(filter);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogsManagement);
