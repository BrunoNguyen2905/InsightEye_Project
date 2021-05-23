import { connect } from "react-redux";
import FloatingVideoManagement from "../../components/video/FloatingVideoManagement";
import { IStoreState } from "src/types";

export function mapStateToProps({
  floatingVideoManagement: { listFloatingVideo }
}: IStoreState) {
  return {
    listFloatingVideo
  };
}

// export function mapDispatchToProps(
//   dispatch: Dispatch<
//     | actions.ICloseFloatingVideo
//   >
// ) {
//   return {
//     handleClose: (uuid: string) => {
//       dispatch(actions.closeFloatingVideo(uuid));
//     }
//   };
// }
export default connect(
  mapStateToProps
  // mapDispatchToProps
)(FloatingVideoManagement);
