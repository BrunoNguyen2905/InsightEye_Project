import * as React from "react";
import TabRoute from "src/components/TabRoute";
import { Theme, createStyles, withStyles } from "@material-ui/core/styles";
import { IMyMixisOptions } from "src/withRoot";
import { IStyleTypeProps } from "../../../styles/utils";
import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
// import paths from "../../../paths";

// interface IProps {
//   selectedLib: string;
//   resetTab: () => void;
// }

interface IFooProps extends RouteComponentProps<any> {
  selectedLib: string;
  resetTab: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    content: {
      height:
        (theme.mixins as IMyMixisOptions).windowHeight -
        theme.spacing.unit * 14,
      overflow: "auto"
    }
  });

class NetworkBoard extends Component<
  IFooProps & IStyleTypeProps<typeof styles>
> {
  public componentDidUpdate(prev: IFooProps) {
    if (prev.selectedLib !== this.props.selectedLib) {
      // this.props.history.push(paths.board);
      this.props.resetTab();
    }
  }

  public render() {
    const { classes } = this.props;
    return <TabRoute routeKey="networkRoutes" extendsStyle={classes} />;
  }
}

export default withRouter(
  withStyles(styles, { withTheme: true })(NetworkBoard)
);
