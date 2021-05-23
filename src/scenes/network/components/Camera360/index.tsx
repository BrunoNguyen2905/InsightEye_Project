import * as React from "react";
import Player360 from "../../../../components/Player360";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { IStyleTypeProps } from "src/styles/utils";
const src = "http://eyeview.city:1935/live/insta360pro/playlist.m3u8";

const styles = (theme: Theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});
const Player360Component = ({ classes }: IStyleTypeProps<typeof styles>) => (
  <Paper elevation={1} className={classes.root}>
    <Typography variant="h5" component="h3">
      Player360Component
    </Typography>

    <div style={{ height: "300px", width: "100%", position: "relative" }}>
      <Player360 src={src} />
    </div>
  </Paper>
);

export default withStyles(styles)(Player360Component);
