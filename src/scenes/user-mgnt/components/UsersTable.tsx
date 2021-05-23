import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { IUser } from "../types/users";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "../../../styles/utils";

interface IProps {
  users: IUser[];
  onClickRow: (id: string) => () => void;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    row: {
      cursor: "pointer",
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.divider
      }
    },
    rowHeaded: {
      backgroundColor: "#181A1F",

      "& th": {
        color: theme.palette.common.white
      }
    },
    paging: {
      paddingTop: theme.spacing.unit * 2,
      textAlign: "center"
    }
  });

const UsersTable = ({ users, classes, onClickRow }: IProps & IStyleProps) => (
  <Table>
    <TableHead>
      <TableRow className={classes.rowHeaded}>
        <TableCell>Role name</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>First name</TableCell>
        <TableCell>Last name</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {users.map(user => (
        <TableRow
          className={classes.row}
          key={user.id}
          onClick={onClickRow(user.id)}
        >
          <TableCell>{user.roleName}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.firstName}</TableCell>
          <TableCell>{user.lastName}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default withStyles(styles)(UsersTable);
