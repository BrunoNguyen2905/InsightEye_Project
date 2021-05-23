import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "./TabMap";
import { Theme, withStyles } from "@material-ui/core/styles";
import { StyleType, IStyleTypeProps } from "../styles/utils";

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  content: {
    height: "100%"
  }
});

export type TabControlStyles = ReturnType<typeof styles>;
export type TabControlClasses = StyleType<typeof styles>;

export interface IProps {
  value: number;
  tabs: IDynamicTab[];
  changeTab: (idx: number) => void;
  children?: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
  extendClasses?: Partial<TabControlClasses>;
}

export interface IDynamicTab {
  onClose?: () => void;
  canClose?: boolean;
  label: string;
  component: React.StatelessComponent<any>;
}

const TabControl = ({
  value,
  tabs,
  changeTab,
  classes,
  children,
  extendClasses
}: IStyleTypeProps<typeof styles> & IProps) => {
  const navigateUrl = (event: any, idx: number) => {
    changeTab(idx);
  };

  const tabIdx = value < tabs.length ? value : 0;

  const component = tabs[value].component({});
  const primaryClasses = {
    ...classes,
    ...extendClasses
  };
  return (
    <div className={primaryClasses.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={tabIdx}
          onChange={navigateUrl}
          indicatorColor="primary"
          textColor="primary"
          scrollable={true}
          scrollButtons="auto"
        >
          {tabs.map((tab, idx) => (
            <Tab
              key={idx}
              label={tab.label}
              canClose={tab.canClose}
              onClose={tab.onClose}
            />
          ))}
        </Tabs>
      </AppBar>
      <div className={primaryClasses.content}>
        {component}
        {children}
      </div>
    </div>
  );
};

export default withStyles(styles)(TabControl);
