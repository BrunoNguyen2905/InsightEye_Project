import * as React from "react";
import { HOCInput, InputValidateChildProps } from "react-hoc-form-validatable";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";

const styles = (): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      position: "relative"
    },
    loading: {
      position: "absolute",
      right: "2px",
      top: "24px"
    },
    input: {
      width: "100%"
    }
  });

interface IProps {
  hidden?: boolean;
}

const InputValidate = ({
  dirty,
  validated,
  classes,
  error,
  submitted,
  value,
  defaultValue,
  type,
  name,
  onBlur,
  onChange,
  errorMessage,
  label,
  lang,
  pending,
  hidden,
  onChangeValue,
  ...rest
}: IStyleProps & IProps & InputValidateChildProps) => {
  const customOnBlur = (event: any) => {
    if (event.target.value) {
      onBlur();
    }
  };
  return (
    <div className={classes.wrap} hidden={hidden}>
      <TextField
        className={classes.input}
        helperText={
          errorMessage
            ? errorMessage[lang]
              ? errorMessage[lang]
              : errorMessage
            : ""
        }
        type={type}
        name={name}
        onBlur={customOnBlur}
        onChange={onChange}
        error={error}
        value={value}
        disabled={submitted}
        label={label}
        {...rest}
      />
      {pending && <CircularProgress className={classes.loading} size={20} />}
    </div>
  );
};

export default HOCInput<TextFieldProps & IProps>(
  withStyles(styles)(InputValidate)
);
