import { connect, Dispatch } from "react-redux";
import Profile from "../components/Profile";
import { IStoreState } from "../../../types";
import { changePassword, IChangePasswordPayload } from "../actions/profile";

function mapStateToProps({ auth }: IStoreState) {
  return {
    userName: auth.account ? auth.account.profile.email : "",
    role: auth.account ? auth.account.profile.role : ""
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changePassword: (
      data: IChangePasswordPayload,
      cb: (reset: boolean) => void
    ) => {
      dispatch(changePassword(data, cb));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
