import { IRoutesNoComponent } from "./Routes";
import ITabsInfo from "./TabsInfo";

export interface ITabsMap<T> {
  [key: string]: T | undefined;
}

export default interface ITabRoute {
  routes: IRoutesNoComponent;
  tabsInfo: ITabsMap<ITabsInfo>;
}
