import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import StepNew from "../components/StepNew";
import { createLib, ICreateLibData } from "../actions/libs";

function mapStateToProps({ libs, auth }: IStoreState) {
  return {
    libs: libs.list,
    selectLib: libs.selectedLib,
    isLoading: libs.listState.isLoading
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    createLib: (data: ICreateLibData, cb: (success: boolean) => void) => {
      dispatch(createLib(data, cb));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepNew);
