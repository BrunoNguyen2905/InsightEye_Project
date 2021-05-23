import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../types/index";
import { RouterAction } from "react-router-redux";
import LeftMenu from "../components/LeftMenu";

export function mapStateToProps({ auth, libs }: IStoreState) {
  return {
    auth,
    role: libs.currentRole
  };
}

export function mapDispatchToProps(dispatch: Dispatch<RouterAction>) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu);
