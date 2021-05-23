import { IIcdClip } from "../types/IncidentInfo";
import Paper from "@material-ui/core/Paper";
import IStyleProps from "src/styles/utils";
import * as React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core";
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { videoTimeFormat } from "src/helpers/time";

interface IClipTableProps {
  clips: IIcdClip[];
  openClip: (clip: IIcdClip) => void;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    color: "rgba(0, 0, 0, 0.54)",
    padding: 8
  },
  panel: {
    padding: 8
  },
  table: {
    minWidth: 700
  }
});

const onClick = (callback: (clip: IIcdClip) => void) => (clip: IIcdClip) => (
  event: any
) => {
  callback({ ...clip });
};
const ClipTable = ({
  clips,
  classes,
  openClip
}: IClipTableProps & IStyleProps) => (
  <div className={classes.root}>
    <Paper className={classes.panel}>
      <Typography variant="h5">Clips</Typography>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Point Name</TableCell>
            <TableCell numeric={true}>Start Time</TableCell>
            <TableCell numeric={true}>End Time</TableCell>
            <TableCell>Desciption</TableCell>
            <TableCell>.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clips.map((n, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {n.pointName}
                </TableCell>
                <TableCell numeric={true}>
                  {videoTimeFormat(n.videoStartTimeUtc, n.startTime * 1000)}
                </TableCell>
                <TableCell numeric={true}>
                  {videoTimeFormat(n.videoStartTimeUtc, n.endTime * 1000)}
                </TableCell>
                <TableCell>{n.description}</TableCell>
                <TableCell>
                  <Button onClick={onClick(openClip)(n)}>Link</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  </div>
);

export default withStyles(styles, { withTheme: true })(ClipTable);
