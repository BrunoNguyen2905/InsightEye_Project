import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import NetworkBoard from "../components/NetworkBoard";
import { IResetTab, resetTab } from "../../../components/TabRoute/actions";
import paths from "../../../paths";

export function mapStateToProps({ mainMap: {}, libs }: IStoreState) {
  return {
    selectedLib: libs.selectedLib
  };
}

export function mapDispatchToProps(dispatch: Dispatch<IResetTab>) {
  return {
    resetTab: () => {
      resetTab(dispatch)("networkRoutes", [paths.board]);
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkBoard);
