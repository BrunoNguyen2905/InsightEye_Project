import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import * as classNames from "classnames";
import IStyleProps from "../../../../styles/utils";

const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      borderTop: "3px solid #0096DA",
      width: 300,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
      overflow: "auto",
      transition: theme.transitions.create(["right"], {
        duration: theme.transitions.duration.short
      })
    }
  });

interface Iprops {
  className?: string;
  children?: React.ReactNode;
}

const SidebarCore = ({
  classes,
  children,
  className
}: Iprops & IStyleProps) => (
  <Paper className={classNames(classes.wrap, className)}>{children}</Paper>
);

export default withStyles(styles)(SidebarCore);
