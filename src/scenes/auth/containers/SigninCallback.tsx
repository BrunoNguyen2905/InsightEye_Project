import { connect, Dispatch } from "react-redux";
import * as actions from "../actions";
import SigninCallback from "../components/SigninCallback";
import { User } from "oidc-client";
import { ISignInSilent, signInSilent } from "../../../actions";

export function mapDispatchToProps(
  dispatch: Dispatch<actions.ISetupAuthentication | ISignInSilent>
) {
  return {
    setupAuthentication: (user: User) => {
      dispatch(actions.setupAuthentication(user));
      const time = new Date().getTime();
      dispatch(signInSilent(user.expires_at * 1000 - time));
      // dispatch(applicationInit());
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(SigninCallback);
