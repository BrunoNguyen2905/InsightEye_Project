import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "../../TabMap";
import { Theme, withStyles } from "@material-ui/core/styles";
import { IStyleTypeProps, StyleType } from "src/styles/utils";
import { Route, Switch, Router } from "react-router";
import ITabInfo from "../types/TabInfo";
import { IRoutes } from "../types/Routes";
import { History } from "history";

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  content: {
    height: "100%"
  }
});

export type TabRouteStyles = ReturnType<typeof styles>;
export type TabRouteClasses = StyleType<typeof styles>;

export interface ITabRouteProps {
  value: number;
  tabs: ITabInfo[];
  routes: IRoutes<any>;
  history: History;
  extendsStyle?: Partial<TabRouteClasses>;
}

export interface ITabRouteDispatchs {
  changeTab: (id: string) => void;
  closeTab: (tab: ITabInfo, nextTab: ITabInfo) => void;
}

const TabRoute = ({
  value,
  tabs,
  changeTab,
  classes,
  routes,
  closeTab,
  history,
  extendsStyle
}: IStyleTypeProps<typeof styles> & ITabRouteProps & ITabRouteDispatchs) => {
  const navigateUrl = (event: any, idx: number) => {
    changeTab(tabs[idx].id);
  };

  const closeTabFactory = (tab: ITabInfo) => () => {
    closeTab(tab, tabs[0]);
  };

  const primaryClass = {
    ...classes,
    ...extendsStyle
  };

  return (
    <div className={primaryClass.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={navigateUrl}
          indicatorColor="primary"
          textColor="primary"
          scrollable={true}
          scrollButtons="auto"
        >
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              label={tab.name}
              canClose={!tab.isAlways}
              onClose={closeTabFactory(tab)}
            />
          ))}
        </Tabs>
      </AppBar>
      <div className={primaryClass.content}>
        <Router history={history}>
          <Switch>
            {routes.map(route => (
              <Route
                exact={true}
                path={route.uri}
                component={route.component}
                key={route.uri}
              />
            ))}
          </Switch>
        </Router>
      </div>
    </div>
  );
};

export default withStyles(styles)(TabRoute);
