import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { HOCForm, FormValidateChildProps } from "react-hoc-form-validatable";
import IStyleProps from "../../../styles/utils";
import InputValidate from "src/components/InputValidate";

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

class FormSetPasswordUser extends React.Component<
  IStyleProps & FormValidateChildProps
> {
  public render() {
    const { classes, onSubmit, submitted } = this.props;
    return (
      <div className={classes.wrap}>
        <form className={classes.form} noValidate={true} onSubmit={onSubmit}>
          <InputValidate
            rule="notEmpty"
            disabled={submitted}
            name="password"
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
export default withStyles(styles)(HOCForm<IStyleProps>(FormSetPasswordUser));
