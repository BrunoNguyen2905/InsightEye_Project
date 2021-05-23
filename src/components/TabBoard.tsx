import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "./TabMap";
// import { Theme, withStyles } from "@material-ui/core/styles";
// import IStyleProps from "../styles/utils";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Route, StaticContext, Switch } from "react-router";
import RouteUri from "src/helpers/routeUri";
// import paths from 'src/paths';
// import Switch from './Switch';

// function TabContainer({children}: any) {
//   return (
//     <Typography component="div" style={{ padding: 8 * 3 }}>
//       {children}
//     </Typography>
//   );
// }

// const styles = (theme: Theme) => ({
//   root: {
//     flexGrow: 1,
//     height: `calc(100% - ${120}px)`,
//     width: "100%",
//     backgroundColor: theme.palette.background.paper
//   }
// });

export interface IProps {
  tabId: string;
  tabs: IDynamicTab[];
  setTabId: (value: string) => void;
}

const styled: any = {
  height: "100%"
};

export interface IDynamicTab {
  onClose?: () => void;
  canClose: boolean;
  exact?: boolean;
  routeUri: RouteUri;
  label: string;
  component: React.StatelessComponent<RouteComponentProps<any, StaticContext>>;
}

export interface IRouteMenuProps extends RouteComponentProps<any>, IProps {}

class TabBoard extends React.Component<RouteComponentProps<any> & IProps, any> {
  /**
   * n
   */

  public componentWillUpdate(nextProgs: IProps) {
    const { history } = this.props;
    const { tabId } = nextProgs;
    history.replace(tabId);
  }

  public shouldComponentUpdate(props: IProps) {
    const { tabs, tabId } = props;
    const { history } = this.props;
    const isContainTabId = tabs.find(e => {
      return e.routeUri.value === tabId;
    });
    if (isContainTabId) {
      return true;
    } else {
      history.replace(tabId);
      return false;
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    const { tabId: prevTabId } = prevProps;
    const { tabId, history } = this.props;
    if (tabId !== prevTabId) {
      history.replace(tabId);
    }
  }
  public handleChange = (event: any, value: string) => {
    const { setTabId, history } = this.props;
    history.replace(value);
    setTabId(value);
  };
  public render() {
    const { tabs, tabId } = this.props;
    const isContainTabId = tabs.find(e => {
      return e.routeUri.value === tabId;
    });
    return (
      <div style={styled}>
        {isContainTabId && (
          <div style={styled}>
            <AppBar position="static" color="default">
              <Tabs
                value={tabId}
                indicatorColor="primary"
                onChange={this.handleChange}
                textColor="primary"
                scrollable={true}
                scrollButtons="auto"
              >
                {tabs.map(tab => (
                  <Tab
                    value={tab.routeUri.value}
                    key={tab.routeUri.value}
                    label={tab.label}
                    canClose={tab.canClose}
                    onClose={tab.onClose}
                  />
                ))}
              </Tabs>
            </AppBar>
            <Switch>
              {tabs.map(tab => (
                <Route
                  exact={tab.exact || false}
                  path={tab.routeUri ? tab.routeUri.value : ""}
                  component={tab.component}
                  key={tab.routeUri.value}
                />
              ))}
            </Switch>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter<IRouteMenuProps>(TabBoard);
