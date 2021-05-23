import * as React from "react";
import { Theme } from "@material-ui/core/styles";
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "../../../styles/utils";
import { RouteComponentProps, Switch, withRouter } from "react-router";
import * as Loadable from "react-loadable";
import SectionLoading from "../../../components/SectionLoading";
import { Route } from "react-router";
import paths from "../../../paths";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    padding: theme.spacing.unit * 2,
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.unit * 3
  },
  list: {
    maxHeight: 400,
    overflow: "auto",
    marginTop: theme.spacing.unit * 2
  },
  listItem: {
    marginTop: theme.spacing.unit / 2,
    border: `1px solid ${theme.palette.divider}`
  },
  logout: {
    marginTop: theme.spacing.unit * 2,
    textAlign: "center"
  },
  caption: {
    display: "inline"
  },
  createLib: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 2
  }
});

const LoadableStepSelectLib = Loadable({
  loader: () => import("../containers/StepSelectLib"),
  loading: SectionLoading
});

export interface IProps extends RouteComponentProps<{}> {}

class StepControl extends React.Component<IStyleProps & IProps> {
  public render() {
    return (
      <Switch>
        <Route
          exact={true}
          path={paths.libSelect}
          component={LoadableStepSelectLib}
        />
      </Switch>
    );
  }
}

export default withRouter(withStyles(styles)(StepControl));
