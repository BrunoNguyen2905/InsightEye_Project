import { Action } from "redux";
import { Dispatch } from "react-redux";

export interface IRouteNoComponent<T extends Action> {
  isAlways?: boolean;
  exact: boolean;
  tabName?: string;
  uri: string;
  startAction: (dispatch: Dispatch<T>) => (props: any) => void;
}

export interface IRoute<T extends Action = Action>
  extends IRouteNoComponent<T> {
  component: React.StatelessComponent<any>;
}

export type IRoutes<
  T extends Action = Action,
  U extends IRouteNoComponent<T> = IRoute<T>
> = U[];
export type IRoutesNoComponent<T extends Action = Action> = IRoutes<
  T,
  IRouteNoComponent<T>
>;
