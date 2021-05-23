import * as React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import UserIcon from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IStyleProps from "../../../styles/utils";
import FormChangePassword from "./FormChangePassword";
import { defaultRules } from "react-hoc-form-validatable";
import { IChangePasswordPayload } from "../actions/profile";

interface IProps {
  userName: string;
  role: string;
  changePassword: (
    data: IChangePasswordPayload,
    cb: (reset: boolean) => void
  ) => void;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      position: "relative",
      height: "100%",
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2
    },
    intro: {
      textAlign: "center",
      paddingBottom: theme.spacing.unit * 2,
      "& > svg": {
        color: theme.palette.primary.main,
        fontSize: 60
      }
    },
    userName: {
      marginBottom: theme.spacing.unit
    }
  });

class UserManagement extends React.Component<IStyleProps & IProps> {
  private onSubmitChangePassword = (
    inputs: any,
    reset: (should: boolean) => void
  ) => {
    this.props.changePassword(
      {
        confirmPassword: inputs.confirmPassword.value,
        newPassword: inputs.newPassword.value,
        oldPassword: inputs.oldPassword.value
      },
      reset
    );
  };

  public render() {
    const { classes, userName, role } = this.props;
    return (
      <div className={classes.wrap}>
        <div className={classes.intro}>
          <UserIcon />
          <div>
            <Typography className={classes.userName} variant="h6">
              {userName}
            </Typography>
            <Typography className={classes.role} variant="subtitle1">
              {role}
            </Typography>
          </div>
        </div>
        <Divider />
        <div>
          <FormChangePassword
            submitCallback={this.onSubmitChangePassword}
            rules={defaultRules}
            validateLang="en"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserManagement);
