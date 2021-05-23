import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IStyleProps from "src/styles/utils";

const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      borderTop: "3px solid #0096DA",
      position: "absolute",
      zIndex: 1,
      top: 10,
      right: 10,
      width: 550,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
      bottom: 75,
      transition: theme.transitions.create(["right"], {
        duration: theme.transitions.duration.short
      })
    }
  });

interface Iprops {
  children?: React.ReactNode;
}

const SideMapPopUp = ({ classes, children }: Iprops & IStyleProps) => (
  <Paper className={classes.wrap}>{children}</Paper>
);

export default withStyles(styles)(SideMapPopUp);
