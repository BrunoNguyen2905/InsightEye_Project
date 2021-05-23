import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as classNames from "classnames";
import styles from "../../styles/Layout";
import Logo from "../Logo";
import ProfileMenu from "../../containers/layouts/ProfileMenu";
import { IStyleTypeProps } from "src/styles/utils";
import { User } from "oidc-client";

export interface IPersistentDrawerProps {
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
  account: User;
  selectedLib: string;
  changeLib: (id: string) => void;
}

const PersistentDrawer = ({
  classes,
  theme,
  children,
  account
}: Required<IStyleTypeProps<typeof styles>> & IPersistentDrawerProps) => {
  const anchor = "left";

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar
          className={classNames(
            classes.appBar,
            classes.appBarShiftNoDrawer,
            classes.appBarNoDrawer
          )}
        >
          <Toolbar disableGutters={true}>
            <div className={classes.logoToolbar}>
              <Logo open={true} />
            </div>

            <Typography
              variant="h6"
              color="inherit"
              noWrap={true}
              className={classes.title}
            />
            <ProfileMenu account={account} />
          </Toolbar>
        </AppBar>

        <main
          className={classNames(classes.content, classes[`content-${anchor}`], {
            [classes.contentShift]: !!open,
            [classes[`contentShift-${anchor}`]]: !!open
          })}
        >
          <div className={classes.drawerHeader} />
          <div className={classes.drawerContent}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
