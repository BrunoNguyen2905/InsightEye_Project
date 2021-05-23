import * as React from "react";
import { Theme } from "@material-ui/core/styles";
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles";
import Step from "@material-ui/core/Step/Step";
import StepButton from "@material-ui/core/StepButton/StepButton";
import Stepper from "@material-ui/core/Stepper/Stepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IStyleProps from "../../../styles/utils";
import FormPlan from "./StepNew/FormPlan";
import { defaultRules, InputStates } from "react-hoc-form-validatable";
import { IPlan, IPlanText } from "../types/libs";
import Button from "@material-ui/core/Button/Button";
import Confirm from "./StepNew/Confirm";
import { ICreateLibData } from "../actions/libs";
import { Redirect } from "react-router";
import paths from "../../../paths";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    padding: theme.spacing.unit * 2,
    maxWidth: 1000,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.unit * 3
  },
  title: {
    textAlign: "center"
  },
  newCardField: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing.unit,
    borderRadius: 2,
    boxShadow: "0 1px 3px 0 #c7d2e0"
  },
  payment: {
    padding: theme.spacing.unit * 2
  },
  paymentControl: {
    marginTop: theme.spacing.unit * 2,
    textAlign: "center"
  },
  error: {
    color: theme.palette.error.main
  },
  cardOption: {
    display: "flex",
    alignItems: "center",
    "& > img": {
      marginRight: theme.spacing.unit * 2,
      height: 30
    }
  }
});

interface IState {
  submitting: boolean;
  done: boolean;
  currentStep: number;
  libName: string;
  currentPlan: IPlan;
}

interface IProps {
  createLib: (data: ICreateLibData, cb: (success: boolean) => void) => void;
}

class StepNew extends React.Component<IStyleProps & IProps, IState> {
  public state = {
    submitting: false,
    currentPlan: IPlan.FreeTrial,
    done: false,
    currentStep: 0,
    libName: ""
  };

  private renderControlPlan = (submitted: boolean) => {
    const { classes } = this.props;
    if (this.state.currentPlan === IPlan.Enterprise) {
      return null;
    }
    return (
      <div className={classes.paymentControl}>
        <Button type="submit" disabled={submitted}>
          Next
        </Button>
      </div>
    );
  };

  private nextPlan = (
    inputs: {
      [k: string]: InputStates;
    },
    done: (reset?: boolean) => void
  ) => {
    this.setState({
      currentStep: 1
    });
    done();
  };

  private onchangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      libName: e.target.value
    });
  };

  private changePlan = (plan: IPlan) => {
    return () => {
      this.setState({ currentPlan: plan });
    };
  };

  private onBack = (step: number) => {
    return () => {
      this.setState({
        currentStep: step
      });
    };
  };

  private nextConfirm = () => {
    this.setState({
      submitting: true
    });
    const data = {
      name: this.state.libName,
      type: this.state.currentPlan
    };
    this.props.createLib(data, (success: boolean) => {
      if (success) {
        this.setState({
          done: true,
          submitting: false
        });
      } else {
        this.setState({
          submitting: false
        });
      }
    });
  };

  public render() {
    if (this.state.done) {
      return <Redirect to={paths.board} />;
    }
    const { classes } = this.props;
    return (
      <Paper className={classes.container}>
        <Typography className={classes.title} variant="h6">
          New Library {this.state.libName}
        </Typography>

        <Stepper
          nonLinear={true}
          activeStep={this.state.currentStep}
          className={classes.steps}
        >
          <Step>
            <StepButton completed={false}>Info</StepButton>
          </Step>
          <Step>
            <StepButton completed={false}>Confirm</StepButton>
          </Step>
        </Stepper>
        <div>
          <div hidden={this.state.currentStep !== 0}>
            <FormPlan
              submitCallback={this.nextPlan}
              onchangeName={this.onchangeName}
              changePlan={this.changePlan}
              plan={this.state.currentPlan}
              rules={defaultRules}
              renderControl={this.renderControlPlan}
            />
          </div>
          {this.state.currentStep === 1 && (
            <Confirm
              submitting={this.state.submitting}
              name={this.state.libName}
              plan={IPlanText[IPlan[this.state.currentPlan]]}
              onNext={this.nextConfirm}
              onBack={this.onBack(this.state.currentStep - 1)}
            />
          )}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(StepNew);
