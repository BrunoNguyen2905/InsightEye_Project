import * as React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import styles from "../../styles/Layout";

export interface IPersistentDrawerProps {
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
}

interface IStyle extends IPersistentDrawerProps {
  classes: {
    [k: string]: string;
  };
  theme: Theme;
}

const PersistentDrawer = ({ classes, theme, children }: IStyle) => {
  return (
    <div className={classes.rootFull}>
      <div className={classes.appFrame}>
        <main className={classes.content}>
          <div className={classes.drawerContent}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
