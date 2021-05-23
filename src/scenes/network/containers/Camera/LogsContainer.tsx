import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import { LogsExternalProps } from "./LogsManagement";
import {
  DEFAULT_PAGING,
  DEFAULT_FILTER
} from "src/scenes/logs-mgnt/types/DefaultValue";
import LogsContainer from "../../components/Camera/LogsContainer";

export function mapStateToProps(
  { cameraViewManagement: { logs } }: IStoreState,
  {
    cameraId
  }: {
    cameraId: string;
  }
): LogsExternalProps {
  const logMgnt = logs[cameraId];
  if (!logMgnt) {
    return {
      pageNo: DEFAULT_PAGING.pageNo,
      pageSize: DEFAULT_PAGING.pageSize,
      filter: DEFAULT_FILTER(),
      cameraId
    };
  }
  return {
    pageNo: logMgnt.paging.pageNo,
    pageSize: logMgnt.paging.pageSize,
    filter: logMgnt.filter,
    cameraId
  };
}

export function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogsContainer);
