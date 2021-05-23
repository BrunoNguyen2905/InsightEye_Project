import { connect } from "react-redux";
import { IStoreState } from "../../../types";
import StepControl from "../components/StepControl";

function mapStateToProps({ libs, auth }: IStoreState) {
  return {
    libs: libs.list,
    selectLib: libs.selectedLib,
    isLoading: libs.listState.isLoading
  };
}

export default connect(
  mapStateToProps,
  null
)(StepControl);
