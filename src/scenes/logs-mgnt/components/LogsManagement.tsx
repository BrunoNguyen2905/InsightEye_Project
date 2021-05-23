import * as React from "react";
import * as moment from "moment";
import Paper from "@material-ui/core/Paper";
import { IStyleTypeProps } from "src/styles/utils";
import LogsToolbar from "./LogsToolBar";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { ILog } from "../types/Log";
import withStyles from "@material-ui/core/styles/withStyles";
import ILogRequest from "../types/LogRequest";
import { IPagingInfo } from "../types/LogScene";
import styles from "../styles/LogsManagement";
import PaginationMui from "src/components/Pagination";
import { videoTimeFormat } from "src/helpers/time";
import { FilterControlState } from "./LogsToolBar";

interface IColumData {
  id: string;
  label: string;
  numeric?: boolean;
}

const LogsTableHead = ({
  columnData,
  classes
}: { columnData: IColumData[] } & IStyleTypeProps<typeof styles>) => {
  return (
    <TableHead className={classes.rowHeaded}>
      <TableRow>
        {columnData.map(column => {
          return (
            <TableCell key={column.id} numeric={column.numeric}>
              {column.label}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export interface ILogsMngtProps {
  data: ILog[];
  pageNo: number;
  pageSize: number;
  total: number;
  filter: ILogRequest;
  filterControl?: FilterControlState;
}
export interface ILogsMngtDispatchs {
  handleChangePage: (paging: Partial<IPagingInfo>) => void;
  updateFilter: (filter: ILogRequest) => void;
  logsMngtPointSearch: () => void;
}

const columns: IColumData[] = [
  {
    id: "username",
    label: "Username"
  },
  {
    id: "detail",
    label: "Detail"
  },
  {
    id: "type",
    label: "Type"
  },
  {
    id: "time",
    label: "Time"
  }
];

const changePageNo = (callback: (paging: Partial<IPagingInfo>) => void) => (
  pageNo: number
) =>
  callback({
    pageNo
  });

function formatDesTime(str: string): string {
  let final = str;

  const regexs = [
    /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/gm,
    /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}\s[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}\s(AM|PM)/gm
  ];

  regexs.forEach(regex => {
    const check = regex.exec(final);
    if (check) {
      final = final.replace(
        regex,
        moment(new Date(check[0]))
          .utc(true)
          .local()
          .format("DD/MM/YYYY - H:mm:ss")
      );
    }
  });

  final = final.replace(/start-date-time-utc/gm, "start date time");
  final = final.replace(/end-date-time-utc/gm, "end date time");

  return final;
}

class LogsManagement extends React.Component<
  ILogsMngtProps & ILogsMngtDispatchs & IStyleTypeProps<typeof styles>
> {
  public componentDidMount() {
    this.props.logsMngtPointSearch();
  }
  public render() {
    const {
      classes,
      data,
      pageNo,
      pageSize,
      handleChangePage,
      total,
      filter,
      updateFilter,
      filterControl
    } = this.props;
    return (
      <div className={classes.wrap}>
        <Paper>
          <LogsToolbar
            {...filter}
            updateFilter={updateFilter}
            filterControl={filterControl}
          />
        </Paper>
        <Paper>
          <Table>
            <LogsTableHead columnData={columns} classes={classes} />
            <TableBody>
              {data.map((n, idx) => {
                return (
                  <TableRow tabIndex={-1} key={idx} className={classes.row}>
                    <TableCell component="th" scope="row">
                      {n.username}
                    </TableCell>
                    <TableCell>{formatDesTime(n.description)}</TableCell>
                    <TableCell>{n.type}</TableCell>
                    <TableCell className={classes.timeCell}>
                      {videoTimeFormat(n.createdDateUtc)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className={classes.paging}>
            <PaginationMui
              onChangePage={changePageNo(handleChangePage)}
              start={pageNo}
              display={5}
              total={Math.ceil(total / pageSize)}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(LogsManagement);
