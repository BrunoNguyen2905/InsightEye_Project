import * as React from "react";
import * as classNames from "classnames";
import Typography from "@material-ui/core/Typography";

export interface IMainTextProps {
  classes: {
    [k: string]: string;
  };
  anchor: string;
  open: boolean;
}

const MainText = ({ classes, anchor, open }: IMainTextProps) => (
  <main
    className={classNames(classes.content, classes[`content-${anchor}`], {
      [classes.contentShift]: open,
      [classes[`contentShift-${anchor}`]]: open
    })}
  >
    <div className={classes.drawerHeader} />
    <Typography>{"You think water moves fast? You should see ice."}</Typography>
  </main>
);

export default MainText;
