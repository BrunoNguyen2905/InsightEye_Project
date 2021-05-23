import * as React from "react";
import Tab, { TabProps } from "@material-ui/core/Tab";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles, createStyles } from "@material-ui/core/styles";
import IStyleProps from "../../styles/utils";

const styles = createStyles({
  root: {
    maxWidth: 264,
    position: "relative"
    // paddingTop: 5,
    // paddingBottom: 5
  },
  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
    width: 30,
    height: 30,

    "& svg": {
      fontSize: 15
    }
  }
});

interface IProps extends TabProps {
  canClose?: boolean;
  onClose?: () => void;
}

const TabMap = ({
  classes,
  canClose = false,
  onClose,
  ...props
}: IProps & IStyleProps) => {
  return canClose ? (
    <div className={classes.root}>
      <IconButton className={classes.icon} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Tab {...props} />
    </div>
  ) : (
    <Tab {...props} />
  );
};

export default withStyles(styles)(TabMap);
