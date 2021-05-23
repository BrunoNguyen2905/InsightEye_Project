import { connect, Dispatch } from "react-redux";
import HLSSource from "../components/video/HLSSource";
import { IVideoControlData, videoControl } from "../actions/video/HLSSource";

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClick: (data: IVideoControlData) => {
      dispatch(videoControl(data));
    }
  };
}
export default connect(
  null,
  mapDispatchToProps
)(HLSSource);
