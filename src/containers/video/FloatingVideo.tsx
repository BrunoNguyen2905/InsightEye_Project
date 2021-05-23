import { connect, Dispatch } from "react-redux";
// import * as actions from "src/actions/index";
import FloatingVideo from "../../components/video/FloatingVideo";
import { IStoreState } from "src/types";
import * as actions from "../../actions/video/FloatingVideo";

export function mapStateToProps({
  libs
}: // floatingVideoManagement: { listFloatingVideo }
IStoreState) {
  return {
    selectedLib: libs.selectedLib
    // listFloatingVideo
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.ICloseFloatingVideo>
) {
  return {
    handleClose: (uuid: number) => {
      dispatch(actions.closeFloatingVideo(uuid));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloatingVideo);
