import * as React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IStyleProps from "src/styles/utils";

const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3
    },
    row: {
      marginBottom: theme.spacing.unit
    },
    control: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center"
    },
    block: {
      padding: theme.spacing.unit * 2,
      backgroundColor: theme.palette.common.white
    },
    blockAddress: {
      marginTop: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
      backgroundColor: theme.palette.common.white
    },
    point: {
      marginBottom: theme.spacing.unit,
      display: "flex"
    },
    total: {
      paddingTop: theme.spacing.unit,
      borderTop: "1px solid",
      display: "flex"
    },
    subTotal: {
      display: "flex"
    },
    left: {
      marginLeft: "auto"
    },
    info: {
      paddingLeft: theme.spacing.unit * 2
    }
  });

interface IProps {
  submitting: boolean;
  name: string;
  plan: string;
  onBack: () => void;
  onNext: () => void;
}

class StepConfirm extends React.Component<IProps & IStyleProps> {
  public render() {
    const { classes, onBack, onNext, plan, submitting } = this.props;
    return (
      <div className={classes.wrap}>
        <div className={classes.block}>
          <div className={classes.point}>
            <Typography variant="h6" component="p">
              Plan: {plan}
            </Typography>
            <div className={classes.left}>$0</div>
          </div>
        </div>
        <div className={classes.control}>
          <Button disabled={submitting} onClick={onBack}>
            Back
          </Button>
          <Button disabled={submitting} onClick={onNext}>
            Confirm
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StepConfirm);
