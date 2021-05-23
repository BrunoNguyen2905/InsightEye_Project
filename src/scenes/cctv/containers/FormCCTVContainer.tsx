import { connect, Dispatch } from "react-redux";
import FormControlCCTV from "../components/FormControlCCTV";
import {
  createCCTV,
  ICreateCCTVData,
  editCCTV,
  IEditCCTVData
} from "../actions/formCCTV";
import { IStoreState } from "../../../types";

function mapStateToProps({ CCTVManagement, libs }: IStoreState) {
  return {
    isLoadingDetailCCTV: CCTVManagement.detailCCTVState.isLoading,
    isFailedDetailCCTV: CCTVManagement.detailCCTVState.isFailed,
    detailCCTV: CCTVManagement.detailCCTVState.data,
    libs
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    createCCTV: (
      data: ICreateCCTVData,
      meta?: {
        cb: () => {};
      }
    ) => {
      dispatch(createCCTV(data, meta));
    },
    editCCTV: (
      data: IEditCCTVData,
      meta?: {
        cb: () => {};
      }
    ) => {
      dispatch(editCCTV(data, meta));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormControlCCTV);
