import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { HOCForm, FormValidateChildProps } from "react-hoc-form-validatable";
import IStyleProps from "src/styles/utils";
import InputValidate from "src/components/InputValidate";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    save: {
      marginTop: theme.spacing.unit * 2
    }
  });

interface IProps {
  onChangeNote: React.ChangeEventHandler<HTMLInputElement>;
  valueNote: string;
}

class MapDrawTextForm extends React.Component<
  IStyleProps & IProps & FormValidateChildProps
> {
  public render() {
    const { classes, onSubmit, submitted, valueNote } = this.props;
    return (
      <form className={classes.form} noValidate={true} onSubmit={onSubmit}>
        <InputValidate
          defaultValue={valueNote}
          onChange={this.props.onChangeNote}
          name="note"
          rule="notEmpty"
          disabled={submitted}
          InputProps={{
            disableUnderline: true
          }}
          placeholder={"Start typing..."}
          multiline={true}
          rows={4}
          fullWidth={true}
        />
        <Button
          disabled={submitted}
          type="submit"
          className={classes.save}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </form>
    );
  }
}
export default withStyles(styles)(
  HOCForm<IStyleProps & IProps>(MapDrawTextForm)
);
