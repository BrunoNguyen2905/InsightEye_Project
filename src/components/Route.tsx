import * as React from "react";
import { RouteProps, Route as ReactRoute } from "react-router";
import AuthComponent from "../containers/AuthComponent";

export enum ProtectLevel {
  all,
  private,
  public
}

export interface IRouteProps extends RouteProps {
  protect?: ProtectLevel;
}

const Route = ({
  protect,
  component: Component,
  ...routeProps
}: IRouteProps) => {
  protect = protect || ProtectLevel.all;

  if (Component) {
    routeProps = {
      ...routeProps,
      render: props => (
        <AuthComponent protect={protect} routePath={props.location.pathname}>
          <Component {...props} />
        </AuthComponent>
      )
    };
  }
  return <ReactRoute {...routeProps} />;
};

export default Route;
