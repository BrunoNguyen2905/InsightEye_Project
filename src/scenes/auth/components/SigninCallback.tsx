import * as React from "react";
import { CallbackComponent } from "redux-oidc";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { mgr } from "../middlewares/userManager";
import { User } from "oidc-client";
import LinearProgress from "@material-ui/core/LinearProgress";

export interface IProps {
  setupAuthentication: (user: User) => void;
}
export interface IState {
  isSuccessful: boolean;
}
export interface IRouteMenuProps extends RouteComponentProps<any>, IProps {}

class CallbackPage extends React.Component<IRouteMenuProps, IState> {
  public callback = () => {
    mgr.getUser().then(user => {
      if (user) {
        this.props.setupAuthentication(user);
      } else {
        console.log("User not logged in");
      }
    });
  };

  public errorCallback = (error: any) => {
    console.log(error);
    mgr.signoutRedirect();
  };
  public render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent
        userManager={mgr}
        successCallback={this.callback}
        errorCallback={this.errorCallback}
      >
        <LinearProgress />
      </CallbackComponent>
    );
  }
}

export default withRouter<IRouteMenuProps>(CallbackPage);
