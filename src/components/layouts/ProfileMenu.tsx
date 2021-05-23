import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ExpandMore from "@material-ui/icons/ExpandMore";
import withStyles from "@material-ui/core/styles/withStyles";
import { Theme } from "@material-ui/core";
import IStyleProps from "../../styles/utils";
import { User } from "oidc-client";

const styles = (them: Theme) => ({
  name: {
    display: "inline-flex"
  },
  menuLink: {
    "& > a": {
      textDecoration: "none",
      color: "inherit"
    }
  }
});

export interface IProfileMenuProps {
  account: User;
  isOpen: boolean;
  anchorEl: any;
  handleMenu: (event: any) => void;
  handleLogout: () => void;
  handleClose: () => void;
}

const ProfileMenu = ({
  account,
  isOpen,
  anchorEl,
  handleMenu,
  handleClose,
  handleLogout,
  classes
}: IProfileMenuProps & IStyleProps) => {
  const logout = () => {
    handleClose();
    handleLogout();
  };
  return (
    <div>
      <Typography
        variant="subtitle1"
        color="inherit"
        noWrap={true}
        className={classes.name}
      >
        {account.profile.email}
      </Typography>
      <IconButton
        aria-owns={open ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <ExpandMore />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={isOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ProfileMenu);
