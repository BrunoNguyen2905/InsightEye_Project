import * as React from "react";
import { withRouter, HashRouter } from "react-router-dom";
import { Redirect } from "react-router";
import * as Loadable from "react-loadable";
import withRoot from "./withRoot";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Layout from "./containers/layouts";
import SectionLoading from "./components/SectionLoading";
import paths from "./paths";
import { REACT_APP_ROUTE_HASH } from "./environment";
import Route from "./components/Route";
import { ProtectLevel } from "./components/Route";
import NotiSnackbar from "./components/notification";
import Switch from "./components/Switch";
import "plyr/dist/plyr.css";

const LoadableSigninCallback = Loadable({
  loader: () => import("./scenes/auth/containers/SigninCallback"),
  loading: SectionLoading
});

const LoadableNetworkBoard = Loadable({
  loader: () => import("./scenes/network/containers/NetworkBoard"),
  loading: SectionLoading
});

const LoadableCCTV = Loadable({
  loader: () => import("./scenes/cctv"),
  loading: SectionLoading
});

const LoadableVideoWall = Loadable({
  loader: () => import("./scenes/video-wall"),
  loading: SectionLoading
});

const LoadableUserManagement = Loadable({
  loader: () => import("./scenes/user-mgnt"),
  loading: SectionLoading
});

const LoadableLogManagement = Loadable({
  loader: () => import("./scenes/logs-mgnt"),
  loading: SectionLoading
});

const LoadableSelectLib = Loadable({
  loader: () => import("./scenes/lib"),
  loading: SectionLoading
});
const LoadablePlayer360 = Loadable({
  loader: () => import("./scenes/player-360"),
  loading: SectionLoading
});

const styles = (theme: Theme): { root: CSSProperties } => ({
  root: {
    paddingTop: theme.spacing.unit * 20,
    textAlign: "center"
  }
});

// const ConnectedSwitch = connect<SwitchProps>(({ routing }: IStoreState) => ({
//   location: routing.location || undefined
// }))(Switch);

const Home = () => <Redirect to={paths.board} />;

const AppContainer = ({
  classes,
  theme
}: {
  classes: { root: string };
  theme: Theme;
}) => {
  const routerApp = (
    <Switch>
      <Layout>
        {/* <Route
          protect={ProtectLevel.public}
          exact={true}
          path={paths.signin}
          component={LoadableSignin}
        /> */}
        {/* <Route
          protect={ProtectLevel.public}
          exact={true}
          path={paths.forgot}
          component={LoadableForgotPassword}
        />
        <Route
          protect={ProtectLevel.public}
          exact={true}
          path={paths.resetPassword}
          component={LoadableResetPassword}
        /> */}
        <Route
          protect={ProtectLevel.public}
          exact={true}
          path={paths.callback}
          component={LoadableSigninCallback}
        />
        <Route exact={true} path="/" render={Home} />
        <Route
          protect={ProtectLevel.private}
          path={paths.board}
          component={LoadableNetworkBoard}
        />
        <Route
          protect={ProtectLevel.private}
          path="/users"
          component={LoadableUserManagement}
        />
        <Route
          protect={ProtectLevel.private}
          path="/video-wall"
          component={LoadableVideoWall}
        />
        <Route
          protect={ProtectLevel.private}
          path={paths.cctv}
          component={LoadableCCTV}
        />
        <Route
          protect={ProtectLevel.private}
          path={paths.logsMgnt}
          component={LoadableLogManagement}
        />
        <Route
          protect={ProtectLevel.private}
          path={paths.lib}
          component={LoadableSelectLib}
        />
        <Route
          protect={ProtectLevel.private}
          path={paths.player360}
          component={LoadablePlayer360}
        />
        <NotiSnackbar />
      </Layout>
    </Switch>
  );
  if (!REACT_APP_ROUTE_HASH) {
    return routerApp;
  }
  return <HashRouter>{routerApp}</HashRouter>;
};

// Use withRouter to fix problem redirect no render
// https://github.com/ReactTraining/react-router/issues/4924
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/redux.md
const App = withRouter(
  withRoot(withStyles(styles, { withTheme: true })(AppContainer))
);

export default App;
