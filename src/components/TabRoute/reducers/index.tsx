import { combineReducers } from "redux";
import { IRoutesNoComponent } from "../types/Routes";
import { ISetupTabRoutes, ICloseTab, IUpdateTab, IResetTab } from "../actions";
import {
  SETUP_TAB_ROUTES,
  SWITCH_TAB,
  CLOSE_TAB,
  UPDATE_TAB,
  RESET_TAB
} from "../constants/index";
import { ITabsMap } from "../types";
import ITabsInfo from "../types/TabsInfo";
import { ISwitchTab } from "src/components/TabRoute/actions";
import ITabInfo from "../types/TabInfo";
import { FinalRouteKey } from "../../../routes";
import finalRoutes from "src/routes";
import RouteUri from "src/helpers/routeUri";

function routes(
  state: IRoutesNoComponent = [],
  action: ISetupTabRoutes
): IRoutesNoComponent {
  switch (action.type) {
    case SETUP_TAB_ROUTES: {
      return [...state, ...action.payload];
    }
  }
  return state;
}

const getAlwaysTabs = (key: FinalRouteKey) =>
  finalRoutes[key].filter(route => route.isAlways).map(
    (route): ITabInfo => ({
      id: new RouteUri(route.uri).value,
      name: route.tabName || "",
      isAlways: route.isAlways || false
    })
  );

const switchToTab = (
  tabs: ITabsInfo = {
    current: "",
    tabs: []
  },
  newTab: ITabInfo
): ITabsInfo => {
  const tabInfos = tabs.tabs;
  if (tabInfos.findIndex(tab => tab.id === newTab.id) === -1) {
    tabInfos.push(newTab);
  }
  return {
    current: newTab.id,
    tabs: tabInfos
  };
};

const updateTabName = (
  tabs: ITabsInfo = {
    current: "",
    tabs: []
  },
  newTab: ITabInfo
): ITabsInfo => {
  const tabInfos = tabs.tabs;
  let currentTab = tabs.current;
  const tabInfo = tabInfos.find(el => el.id === newTab.id);
  if (tabInfo) {
    currentTab = tabInfo.id;
  }
  const newTabs = tabInfos.map(tab => {
    if (tab.id === newTab.id) {
      tab.name = newTab.name;
      return {
        ...tab,
        name: newTab.name
      };
    }
    return tab;
  });
  return {
    current: currentTab,
    tabs: newTabs
  };
};

const removeTab = (
  tabs: ITabsInfo = {
    current: "",
    tabs: []
  },
  newTab: ITabInfo
): ITabsInfo => {
  const tabInfos = tabs.tabs;
  return {
    current: newTab.id,
    tabs: tabInfos.filter(tab => tab.id !== newTab.id)
  };
};

function tabsInfo(
  state: ITabsMap<ITabsInfo> = {},
  action: ISwitchTab | ICloseTab | IUpdateTab | IResetTab
): ITabsMap<ITabsInfo> {
  switch (action.type) {
    case SWITCH_TAB: {
      const currentTabs = state[action.payload.key] || {
        current: "",
        tabs: getAlwaysTabs(action.payload.key)
      };
      return {
        ...state,
        [action.payload.key]: switchToTab(currentTabs, action.payload.tab)
      };
    }

    case CLOSE_TAB: {
      const currentTabs = state[action.payload.key] as ITabsInfo;
      return {
        ...state,
        [action.payload.key]: removeTab(currentTabs, action.payload.tab)
      };
    }

    case UPDATE_TAB: {
      const currentTabs = state[action.payload.key] as ITabsInfo;
      return {
        ...state,
        [action.payload.key]: updateTabName(currentTabs, action.payload.tab)
      };
    }

    case RESET_TAB: {
      const currentTabs = state[action.payload.key] as ITabsInfo;

      return {
        ...state,
        [action.payload.key]: {
          ...currentTabs,
          tabs:
            action.payload.keepTabs.length > 0
              ? currentTabs.tabs.filter(
                  t => action.payload.keepTabs.indexOf(t.id) >= 0
                )
              : currentTabs.tabs
        }
      };
    }
  }
  return state;
}

export const tabRoute = combineReducers({
  routes,
  tabsInfo
});
