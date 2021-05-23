import * as React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ILogRequest from "../types/LogRequest";
import Grid, { GridSize } from "@material-ui/core/Grid";
import { LogType } from "../types/Log";
import { DateTimePicker } from "material-ui-pickers";
import { Moment } from "moment";
import Icon from "@material-ui/core/Icon";
import { IStyleTypeProps } from "../../../styles/utils";
import IconButton from "@material-ui/core/IconButton";
import UserFilter from "../containers/UserFilter";
import { ISelectItem, SelectFilter } from "./SelectFilter";
import { toolbarStyles } from "../styles/toolBar";

export type FILTER_NAME = "username" | "type" | "start" | "end";
export type FilterControlState = { [key in FILTER_NAME]?: boolean };

export type FilterProps = ILogRequest & {
  filterControl?: FilterControlState;
};

export interface ILogsToolBarDispatchs {
  updateFilter: (filter: Partial<ILogRequest>) => void;
}
const filterType = (updateFilter: (filter: Partial<ILogRequest>) => void) => (
  event: any
) =>
  updateFilter({
    logType: event.target.value
  });
const logTypeList: Array<ISelectItem<LogType>> = [
  LogType.ALL,
  LogType.POINT,
  LogType.CAMERA,
  LogType.ACCOUNT,
  LogType.INCIDENT,
  LogType.VIDEO_WALL
].map(type => ({
  value: type,
  label: LogType[type]
}));

const filterUserName = (
  updateFilter: (filter: Partial<ILogRequest>) => void
) => (event: any) =>
  updateFilter({
    userId: event.target.value !== "-1" ? event.target.value : ""
  });
const filterDate = (updateFilter: (filter: Partial<ILogRequest>) => void) => (
  fieldName: "startTimeUtc" | "endTimeUtc"
) => (value: Moment) =>
  updateFilter({
    [fieldName]: value.utc().toISOString()
  });
const resetFilter = (updateFilter: (filter: Partial<ILogRequest>) => void) => (
  event: any
) => updateFilter({});

const isControlEnable = (state: FilterControlState | undefined) => (
  key: FILTER_NAME
) => {
  if (!state) {
    return true;
  }
  return state[key];
};

const calcWitdh = (state: FilterControlState | undefined) => {
  const cols = Object.keys(state || {}).length || 5;

  return (width: number) => {
    return Math.round((width * 5) / (cols + 1)) as GridSize;
  };
};

const LogsToolbar = ({
  classes,
  userId,
  startTimeUtc,
  endTimeUtc,
  updateFilter,
  logType,
  filterControl
}: IStyleTypeProps<typeof toolbarStyles> &
  FilterProps &
  ILogsToolBarDispatchs) => {
  const calcColWidth = calcWitdh(filterControl);
  const isEnable = isControlEnable(filterControl);
  return (
    <div className={classes.container}>
      <Grid container={true} spacing={24}>
        {isEnable("username") && (
          <Grid item={true} xs={calcColWidth(3)}>
            <UserFilter
              label="Username"
              classes={classes}
              className={classes.formUserControl}
              type={userId || "-1"}
              change={filterUserName(updateFilter)}
            />
          </Grid>
        )}
        {isEnable("type") && (
          <Grid item={true} xs={calcColWidth(2)}>
            <SelectFilter
              label="Log Type"
              items={logTypeList}
              classes={classes}
              type={logType === undefined ? LogType.ALL : logType}
              change={filterType(updateFilter)}
            />
          </Grid>
        )}
        {isEnable("start") && (
          <Grid item={true} xs={calcColWidth(3)}>
            <DateTimePicker
              format="DD/MM/YYYY - H:mm:ss"
              name="startTimeUtc"
              onChange={filterDate(updateFilter)("startTimeUtc")}
              value={new Date(startTimeUtc)}
              label="Start Time"
              fullWidth={true}
              maxDate={new Date(endTimeUtc)}
            />
          </Grid>
        )}

        {isEnable("end") && (
          <Grid item={true} xs={calcColWidth(3)}>
            <DateTimePicker
              format="DD/MM/YYYY - H:mm:ss"
              name="endTimeUtc"
              onChange={filterDate(updateFilter)("endTimeUtc")}
              value={endTimeUtc ? new Date(endTimeUtc) : new Date()}
              label="End Time"
              fullWidth={true}
              minDate={new Date(startTimeUtc)}
            />
          </Grid>
        )}
        <Grid item={true} xs={calcColWidth(1)}>
          <IconButton
            className={classes.resetButton}
            onClick={resetFilter(updateFilter)}
          >
            <Icon>refresh</Icon>
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(toolbarStyles)(LogsToolbar);
