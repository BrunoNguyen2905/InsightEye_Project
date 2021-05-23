import * as React from "react";
import LogsManagement, {
  LogsExternalProps
} from "../../containers/Camera/LogsManagement";

const LogsContainer = (props: LogsExternalProps) => (
  <LogsManagement {...props} filterControl={{ start: true, end: true }} />
);
export default LogsContainer;
