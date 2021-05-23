import * as React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import { withRouter, RouteComponentProps } from "react-router-dom";
import RouteUri from "src/helpers/routeUri";
import { withStyles } from "@material-ui/core/styles";
import IStyleProps from "../styles/utils";

const styles = {
  item: {
    color: "#fff"
  },
  itemSelected: {
    color: "#13bcff"
  }
};

export interface IMenuItemProps {
  text: string;
  uri?: RouteUri;
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactElement<{}>;
  onClick?: (uri: RouteUri) => void;
}

export interface IRouteMenuProps
  extends RouteComponentProps<any>,
    IMenuItemProps {}

export const CMenuItem = ({
  text,
  selected = false,
  disabled = false,
  icon,
  uri,
  onClick,
  history,
  classes
}: IRouteMenuProps & IStyleProps) => {
  const navigateUrl = () => {
    if (uri && onClick) {
      // onClick(uri);
      history.push(uri.value);
      // navigateToUri(uri);
    }
  };

  let icons;
  if (icon) {
    icons = (
      <ListItemIcon
        classes={{
          root: selected ? classes.itemSelected : classes.item
        }}
      >
        {icon}
      </ListItemIcon>
    );
  }
  return (
    <MenuItem
      button={true}
      disabled={disabled}
      selected={selected}
      onClick={navigateUrl}
    >
      {icons}
      <ListItemText
        classes={{
          primary: selected ? classes.itemSelected : classes.item
        }}
        primary={text}
      />
    </MenuItem>
  );
};

export default withRouter<IRouteMenuProps>(withStyles(styles)(CMenuItem));
