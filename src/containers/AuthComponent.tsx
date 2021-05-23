import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../types/index";
import { RouterAction } from "react-router-redux";
import AuthComponent, { IRouteProps } from "../components/AuthComponent";

export function mapStateToProps({ auth, libs }: IStoreState) {
  return {
    auth,
    selectLib: libs.selectedLib,
    libs: libs.list,
    role: libs.currentRole
  };
}

export function mapDispatchToProps(dispatch: Dispatch<RouterAction>) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)<IRouteProps>(AuthComponent);
