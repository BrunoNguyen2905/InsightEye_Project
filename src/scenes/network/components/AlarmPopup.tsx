import * as React from "react";
import { ISiteAlarm } from "../types/Site";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import styles from "../styles/AlarmPopup";
import IStyleProps from "../../../styles/utils";

export interface IAlarmPopupProps {
  data: ISiteAlarm;
}

const AlarmPopup = ({ data, classes }: IAlarmPopupProps & IStyleProps) => {
  return (
    <Table>
      <TableBody>
        {Object.keys(data).map(key => (
          <TableRow className={classes.row}>
            <TableCell component="th" scope="row">
              {key}
            </TableCell>
            <TableCell component="th" scope="row">
              {data[key]}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default withStyles(styles)(AlarmPopup);
