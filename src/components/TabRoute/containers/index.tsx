import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
// import { navigateToUri } from "src/helpers/url";
import { RouterAction } from "react-router-redux";
// import RouteUri from "src/helpers/routeUri";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import TabRoute, {
  ITabRouteDispatchs,
  ITabRouteProps as InternalProps
} from "../components/TabRoute";
import { FinalRouteKey } from "src/routes";
import finalRoutes from "src/routes";
import { ICloseTab, closeTab } from "../actions";
import ITabInfo from "../types/TabInfo";
import { TabRouteClasses } from "../components/TabRoute";

interface ITabRouteProps {
  routeKey: FinalRouteKey;
  closeTab?: (tab: ITabInfo) => void;
  extendsStyle?: Partial<TabRouteClasses>;
}
export function mapStateToProps(
  { tabRoute: { tabsInfo } }: IStoreState,
  { routeKey, history }: RouteComponentProps<any> & ITabRouteProps
): InternalProps {
  const tabs = tabsInfo[routeKey] || {
    current: "",
    tabs: []
  };
  const idx = tabs.tabs.findIndex(tab => tab.id === tabs.current);

  return {
    tabs: tabs.tabs,
    value: idx < 0 ? 0 : idx,
    routes: finalRoutes[routeKey],
    history
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<RouterAction | ICloseTab>,
  props: RouteComponentProps<any> & ITabRouteProps
): ITabRouteDispatchs {
  const switchNavigate = (url: string) => {
    props.history.push(url);
    // dispatch(navigateToUri(new RouteUri(url)));
  };
  return {
    changeTab: url => {
      switchNavigate(url);
    },
    closeTab: (tab: ITabInfo, nextTab: ITabInfo) => {
      closeTab(dispatch)(props.routeKey, tab);
      switchNavigate(nextTab.id);
      if (props.closeTab) {
        props.closeTab(tab);
      }
    }
  };
}

export default withRouter<RouteComponentProps<any> & ITabRouteProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )<InternalProps>(TabRoute)
);
