import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { HOCForm, FormValidateChildProps } from "react-hoc-form-validatable";
import IStyleProps from "../../../styles/utils";
import InputValidate from "src/components/InputValidate";
import { UserLibRole, UserLibRoleText } from "../../../helpers/permission";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      padding: theme.spacing.unit * 2
    },
    title: { display: "flex", alignItems: "center" },
    submit: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    }
  });
interface IProps {
  onClickBack: () => void;
}
class FormAddUser extends React.Component<
  IStyleProps & IProps & FormValidateChildProps
> {
  public render() {
    const { classes, onSubmit, submitted, onClickBack } = this.props;
    return (
      <div className={classes.wrap}>
        <div className={classes.title}>
          <IconButton onClick={onClickBack}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6">Create User</Typography>
        </div>
        <form className={classes.form} noValidate={true} onSubmit={onSubmit}>
          <InputValidate
            rule="notEmpty|isEmail"
            disabled={submitted}
            name="emailAddress"
            type="text"
            margin="normal"
            label="Email"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth={true}
          />
          <InputValidate
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
          <InputValidate
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
