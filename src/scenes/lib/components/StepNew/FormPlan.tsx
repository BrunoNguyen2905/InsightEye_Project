import * as React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { FormValidateChildProps, HOCForm } from "react-hoc-form-validatable";
import IStyleProps from "src/styles/utils";
import InputValidate from "src/components/InputValidate";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { IPlan } from "../../types/libs";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    save: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center"
    },
    address: {
      position: "relative"
    },
    addressSuggest: {
      position: "absolute",
      bottom: -25,
      left: 0,
      padding: theme.spacing.unit,
      zIndex: 1
    },
    planTitleSelect: {
      backgroundColor: "#00a0df",
      color: "white",
      padding: "16px",
      textAlign: "center"
    },
    planTitle: {
      padding: "16px",
      textAlign: "center",
      borderBottom: "1px solid " + theme.palette.divider
    },
    planContent: {
      height: 280,
      textAlign: "center"
    },
    row: {
      marginBottom: theme.spacing.unit
    },
    rowPlan: {
      marginBottom: theme.spacing.unit * 2
    },
    choose: {
      display: "block",
      margin: "0 auto"
    },
    action: {
      minHeight: 100,
      paddingBottom: theme.spacing.unit * 2
    },
    name: {
      width: 200,
      marginBottom: theme.spacing.unit * 2
    },
    plan: {
      cursor: "pointer"
    }
  });

export interface IProps {
  renderControl: (submitted: boolean) => React.ReactNode;
  plan: IPlan;
  onchangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changePlan: (plan: IPlan) => () => void;
}

class FormPlan extends React.Component<
  IStyleProps & IProps & FormValidateChildProps
> {
  public render() {
    const {
      classes,
      onSubmit,
      submitted,
      plan,
      changePlan,
      onchangeName,
      renderControl
    } = this.props;
    return (
      <form className={classes.form} noValidate={true} onSubmit={onSubmit}>
        <div className={classes.name}>
          <InputValidate
            onChange={onchangeName}
            required={true}
            name="name"
            rule="notEmpty"
            disabled={submitted}
            label="Library name"
          />
        </div>
        <div>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={4}>
              <Card
                className={classes.plan}
                onClick={changePlan(IPlan.FreeTrial)}
              >
                <div
                  className={
                    plan === IPlan.FreeTrial
                      ? classes.planTitleSelect
                      : classes.planTitle
                  }
                >
                  <Typography variant="h6" color="inherit">
                    Free Trial
                  </Typography>
                </div>
                <CardActions className={classes.action}>
                  <Button className={classes.choose} variant="contained">
                    Choose
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item={true} xs={4}>
              <Card
                className={classes.plan}
                onClick={changePlan(IPlan.PayAsYouGo)}
              >
                <div
                  className={
                    plan === IPlan.PayAsYouGo
                      ? classes.planTitleSelect
                      : classes.planTitle
                  }
                >
                  <Typography variant="h6" color="inherit">
                    Pay As You Go
                  </Typography>
                </div>
                <CardActions className={classes.action}>
                  <Button className={classes.choose} variant="contained">
                    Choose
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item={true} xs={4}>
              <Card
                className={classes.plan}
                onClick={changePlan(IPlan.Enterprise)}
              >
                <div
                  className={
                    plan === IPlan.Enterprise
                      ? classes.planTitleSelect
                      : classes.planTitle
                  }
                >
                  <Typography variant="h6" color="inherit">
                    Enterprise
                  </Typography>
                </div>
                <CardActions className={classes.action}>
                  <Button
                    href="mailto:sales@insightus.com.au"
                    className={classes.choose}
                    variant="contained"
                  >
                    Contact Us
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </div>
        <div className={classes.save}>
          <div>{renderControl(submitted)}</div>
        </div>
      </form>
    );
  }
}
export default withStyles(styles)(HOCForm<IStyleProps & IProps>(FormPlan));
