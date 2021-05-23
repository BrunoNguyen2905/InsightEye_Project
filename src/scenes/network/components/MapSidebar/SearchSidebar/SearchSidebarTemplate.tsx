import * as React from "react";
import * as classNames from "classnames";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import SidebarCore from "../SidebarCore";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import OpenIcon from "@material-ui/icons/ChevronLeft";
import CloseIcon from "@material-ui/icons/ChevronRight";
import IStyleProps from "src/styles/utils";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    searchSidebar: {
      position: "absolute",
      top: 10,
      right: -400,
      width: 400,
      bottom: 30,
      overflow: "visible"
    },
    searchSidebarOpen: {
      right: 10
    },
    title: {
      padding: theme.spacing.unit * 2
    },
    toggle: {
      top: 0,
      left: -30,
      position: "absolute",
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.common.white,
      width: 30,
      height: 50,
      borderRight: `1px solid ${theme.palette.divider}`,
      boxShadow: "-1px 0 8px rgba(0,0,0,.175)"
    }
  });

interface IProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClickToggle: () => void;
}

const SearchSidebarTemplate = ({
  classes,
  children,
  isOpen,
  onClickToggle
}: IStyleProps & IProps) => (
  <SidebarCore
    className={classNames(classes.searchSidebar, {
      [classes.searchSidebarOpen]: isOpen
    })}
  >
    {children}
    <div className={classes.toggle} onClick={onClickToggle}>
      {isOpen ? <CloseIcon /> : <OpenIcon />}
    </div>
  </SidebarCore>
);

export default withStyles(styles)(SearchSidebarTemplate);
