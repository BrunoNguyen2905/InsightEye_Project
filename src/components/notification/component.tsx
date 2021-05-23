import { Theme, SnackbarContent, Snackbar } from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import green from "@material-ui/core/colors/green";
import IStyleProps from "../../styles/utils";
import * as React from "react";
import * as classNames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import withStyles from "@material-ui/core/styles/withStyles";
import Variant from "./types/variant";
import INotificationInfo from "./types";

const variantIcon = {
  [Variant.SUCCESS]: CheckCircleIcon,
  [Variant.WARNING]: WarningIcon,
  [Variant.ERROR]: ErrorIcon,
  [Variant.INFO]: InfoIcon
};

const contentStyles = (theme: Theme) => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

export interface IProps {
  className?: string;
  message: string;
  onClose: () => void;
  variant: Variant;
}

const NotiSnackbarContent = ({
  classes,
  className,
  message,
  onClose,
  variant,
  ...other
}: IProps & IStyleProps) => {
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      }
      {...other}
    />
  );
};
const NotiSnackbarContentWrapper = withStyles(contentStyles)(
  NotiSnackbarContent
);

export interface INotiProps {
  noti: INotificationInfo;
  autoHideDuration: number;
}
export interface INotiDispatch {
  handleClose: (noti: INotificationInfo) => void;
}
const NotiSnackbar = ({
  handleClose,
  autoHideDuration,
  noti
}: INotiProps & INotiDispatch) => {
  const { isOpen, variant = Variant.INFO, message = "" } = noti;
  const onClose = () => {
    handleClose(noti);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isOpen !== false ? true : false}
      autoHideDuration={autoHideDuration ? autoHideDuration : undefined}
      onClose={onClose}
    >
      <NotiSnackbarContentWrapper
        onClose={onClose}
        variant={variant}
        message={message}
      />
    </Snackbar>
  );
};

export default NotiSnackbar;
