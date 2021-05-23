import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { HOCForm, FormValidateChildProps } from "react-hoc-form-validatable";
import IStyleProps from "../../../styles/utils";
import InputValidate from "src/components/InputValidate";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      padding: theme.spacing.unit * 2
    },
    title: { display: "flex", alignItems: "center" },
    form: {
      paddingTop: theme.spacing.unit * 2
    },
    submit: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    }
  });

class FormChangePassword extends React.Component<
  IStyleProps & FormValidateChildProps
> {
  public render() {
    const { classes, onSubmit, submitted } = this.props;
    return (
      <div className={classes.wrap}>
        <div className={classes.title}>
          <Typography variant="subtitle1">Change password</Typography>
        </div>
        <form className={classes.form} noValidate={true} onSubmit={onSubmit}>
          <InputValidate
            rule="notEmpty"
            disabled={submitted}
            name="oldPassword"
            type="password"
            margin="normal"
            label="Current password"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth={true}
          />
          <InputValidate
            rule="notEmpty"
            disabled={submitted}
            name="newPassword"
            type="password"
            margin="normal"
            label="New password"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth={true}
          />
          <InputValidate
            rule="notEmpty"
            disabled={submitted}
            name="confirmPassword"
            type="password"
            margin="normal"
            label="Confirm new password"
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
export default withStyles(styles)(HOCForm<IStyleProps>(FormChangePassword));
