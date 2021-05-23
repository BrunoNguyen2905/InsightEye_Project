import * as React from "react";
import * as classnames from "classnames";
import Paper from "@material-ui/core/Paper";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import IStyleProps from "../../styles/utils";
import MapDrawTextForm from "./MapDrawTextForm";
import { defaultRules } from "react-hoc-form-validatable";
const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      padding: theme.spacing.unit * 2,
      position: "absolute",
      left: 10,
      bottom: 10,
      width: 300,
      display: "flex",
      flexDirection: "column"
    },

    save: {
      marginTop: theme.spacing.unit * 2
    }
  });

interface IProps {
  value: string;
  text?: string;
  className?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSave: (inputs: any, reset: (should: boolean) => void) => void;
}

const MapDrawText = ({
  classes,
  className,
  onChange,
  onSave,
  value
}: IStyleProps & IProps) => (
  <Paper className={classnames(classes.wrap, className)}>
    <MapDrawTextForm
      valueNote={value}
      onChangeNote={onChange}
      submitCallback={onSave}
      validateLang="en"
      rules={defaultRules}
    />
  </Paper>
);

export default withStyles(styles)(MapDrawText);
