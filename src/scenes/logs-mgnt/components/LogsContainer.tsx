import * as React from "react";
import LogsManagement, {
  LogsExternalProps
} from "../containers/LogsManagement";
import { Component } from "react";
import ILogRequest from "../types/LogRequest";

interface IProps extends LogsExternalProps {
  selectedLib: string;
  resetFilter: () => void;
  getListUser: () => void;
  searchLog: (
    opt: {
      pageNo: number;
      pageSize: number;
      filter: ILogRequest;
    }
  ) => void;
}

class LogsContainer extends Component<IProps> {
  public componentDidMount() {
    this.props.getListUser();
  }

  public componentDidUpdate(prev: IProps) {
    if (prev.selectedLib !== this.props.selectedLib) {
      const { filter, pageSize, pageNo } = this.props;
      this.props.resetFilter();
      this.props.getListUser();
      this.props.searchLog({
        filter,
        pageSize,
        pageNo
      });
    }
  }

  public render() {
    const { filter, pageSize, pageNo } = this.props;
    return (
      <LogsManagement pageNo={pageNo} pageSize={pageSize} filter={filter} />
    );
  }
}

export default LogsContainer;
