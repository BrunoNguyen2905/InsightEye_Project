import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { HOCForm, FormValidateChildProps } from "react-hoc-form-validatable";
import IStyleProps from "../../../styles/utils";
import InputValidate from "src/components/InputValidate";
import { IUser } from "../types/users";
import { UserLibRole, UserLibRoleText } from "../../../helpers/permission";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    submit: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    }
  });
interface IProps {
  user: IUser;
  isOwner: boolean;
}
class FormAddUser extends React.Component<
  IStyleProps & IProps & FormValidateChildProps
> {
  public render() {
    const { classes, onSubmit, submitted, user, isOwner } = this.props;
    return (
      <div className={classes.wrap}>
        <form className={classes.form} noValidate={true} onSubmit={onSubmit}>
          {!isOwner && (
            <InputValidate
              defaultValue={user.roleName}
              label="Role"
              fullWidth={true}
              rule="notEmpty"
              name="roleSystemName"
              select={true}
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
            >
              <MenuItem value={UserLibRole.VideoUser}>
                {UserLibRoleText.VideoUser}
              </MenuItem>
              <MenuItem value={UserLibRole.Supervisor}>
                {UserLibRoleText.Supervisor}
              </MenuItem>
              <MenuItem value={UserLibRole.Admin}>
                {UserLibRoleText.Admin}
              </MenuItem>
              <MenuItem value={UserLibRole.BaseUser}>
                {UserLibRoleText.BaseUser}
              </MenuItem>
            </InputValidate>
          )}
          <InputValidate
            defaultValue={user.firstName}
            rule="notEmpty"
            disabled={submitted}
            name="firstName"
            type="text"
            margin="normal"
            label="First name"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth={true}
          />
          <InputValidate
            defaultValue={user.lastName}
            rule="notEmpty"
            disabled={submitted}
            name="lastName"
            type="text"
            margin="normal"
            label="Last name"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth={true}
          />
          <Button
            className={classes.submit}
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitted}
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(HOCForm<IStyleProps & IProps>(FormAddUser));
