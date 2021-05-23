import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronRight from "@material-ui/icons/ChevronRight";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Menu from "@material-ui/icons/Menu";
import * as classNames from "classnames";
import styles from "../../styles/Layout";
import LeftMenu from "./../../containers/LeftMenu";
import Logo from "../Logo";
import ProfileMenu from "../../containers/layouts/ProfileMenu";
import { IStyleTypeProps } from "src/styles/utils";
import { User } from "oidc-client";
import {
  ILib,
  IPlanText,
  LibActiveStatusText
} from "../../scenes/lib/types/libs";
import { RouteComponentProps, withRouter } from "react-router";
import * as H from "history";

export interface IPersistentDrawerProps extends RouteComponentProps<any> {
  isOpenDrawer: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
  account: User;
  libs: ILib[];
  selectedLib: string;
  changeLib: (id: string) => void;
}

export enum SelectLibOtherOptions {
  CreateNew = "__new"
}

function onChangeLib(cb: (id: string) => void, history: H.History) {
  return (e: React.SyntheticEvent) => {
    const target = e.target as HTMLSelectElement;
    if (target.value === SelectLibOtherOptions.CreateNew) {
      (window.location as any) = "http://shop.ins8.us/Eyeview/Plan";
    } else {
      cb(target.value);
    }
  };
}

const PersistentDrawer = ({
  libs,
  selectedLib,
  isOpenDrawer,
  handleDrawerOpen,
  handleDrawerClose,
  classes,
  theme,
  children,
  account,
  changeLib,
  history
}: Required<IStyleTypeProps<typeof styles>> & IPersistentDrawerProps) => {
  const currentLib = libs.find(f => f.id === selectedLib);
  const open = isOpenDrawer;
  const anchor = "left";
  const drawer = (
    <Drawer
      variant="persistent"
      open={true}
      classes={{
        paper: classNames(classes.drawerPaper, !open && classes.drawerPaperMin)
      }}
    >
      <div className={classes.drawerHeader}>
        <Logo open={open} />
      </div>
      <Divider />
      <List>
        <LeftMenu />
      </List>
    </Drawer>
  );

  let before = null;
  before = drawer;

  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
            [classes[`appBarShift-${anchor}`]]: open
          })}
        >
          <Toolbar disableGutters={true}>
            <IconButton
              onClick={handleDrawerClose}
              className={classNames(classes.menuButton, !open && classes.hide)}
            >
              {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <Menu />
            </IconButton>
            <div className={classes.selectLibStatus}>
              <Select
                onChange={onChangeLib(changeLib, history)}
                disableUnderline={true}
                value={selectedLib}
                classes={{
                  icon: classes.selectIcon,
                  selectMenu: classes.selectLib
                }}
              >
                {libs.map(lib => (
                  <MenuItem
                    className={classes.selectLibItem}
                    key={lib.id}
                    value={lib.id}
                  >
                    <span>{lib.name} </span>
                  </MenuItem>
                ))}
                <MenuItem
                  className={classes.selectLibItem}
                  value={SelectLibOtherOptions.CreateNew}
                >
                  <span>
                    <b>Create new</b>
                  </span>
                </MenuItem>
              </Select>
              {currentLib && (
                <div className={classes.active}>
                  <span
                    className={`${classes.activeIcon} ${
                      currentLib.active
                        ? classes.activeIconActive
                        : classes.activeIconInactive
                    }`}
                  />
                  {currentLib.active
                    ? LibActiveStatusText.ACTIVE
                    : LibActiveStatusText.INACTIVE}
                </div>
              )}
            </div>
            {currentLib && (
              <Typography className={classes.libType}>
                {IPlanText[currentLib.type]}
              </Typography>
            )}
            <Typography
              variant="h6"
              color="inherit"
              noWrap={true}
              className={classes.title}
            >
              {/* Persistent drawer */}
            </Typography>
            <ProfileMenu account={account} />
          </Toolbar>
        </AppBar>
        {before}

        <main
          className={classNames(classes.content, classes[`content-${anchor}`], {
            [classes.contentShift]: open,
            [classes[`contentShift-${anchor}`]]: open
          })}
        >
          <div className={classes.drawerHeader} />
          <div className={classes.drawerContent}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default withRouter(withStyles(styles, { withTheme: true })(
  PersistentDrawer
) as any);
