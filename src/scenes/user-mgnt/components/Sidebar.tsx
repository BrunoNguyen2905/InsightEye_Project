import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "../../../styles/utils";

interface IProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      zIndex: 1,
      borderTop: "3px solid #0096DA",
      position: "absolute",
      top: 20,
      right: -400,
      height: "100%",
      width: 400,
      transition: theme.transitions.create(["right"], {
        duration: theme.transitions.duration.short
      })
    },

    open: {
      right: 0
    }
  });

const Sidebar = ({ children, classes, isOpen }: IProps & IStyleProps) => (
  <Paper className={`${classes.wrap} ${isOpen ? classes.open : ""}`}>
    {children}
  </Paper>
);

export default withStyles(styles)(Sidebar);
