import { connect } from "react-redux";
// import * as actions from "../../actions/index";
import { IStoreState } from "../../types/index";
import Layout from "../../components/layouts/Full";

export function mapStateToProps({ isOpenDrawer }: IStoreState): {} {
  return {};
}

// export function mapDispatchToProps(
//   dispatch: Dispatch<actions.IHelloAction>
// ): {} {
//   return {};
// }
export default connect(
  mapStateToProps,
  null
)<{
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
}>(Layout);
