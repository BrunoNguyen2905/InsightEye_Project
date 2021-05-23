import { connect, Dispatch } from "react-redux";
// import * as actions from "src/actions/index";
import LayoutDialog from "../components/LayoutDialog";
import { IStoreState } from "src/types";
import * as actions from "../actions/index";
import { ICameraLayout } from "../types/Layout";

export function mapStateToProps({
  layoutDialog: { listLayout, showDialog }
}: IStoreState) {
  return {
    listLayout,
    showDialog
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | actions.IShowDialog
    | actions.ISelectLayout
    | actions.ISetToolbarStatus
    | actions.ISetVideoWall
    | actions.IUpdateCustomLayout
  >
) {
  return {
    selectLayout: (layout: ICameraLayout) => {
      // dispatch(actions.selectCameraLayout(layout));
      if (layout) {
        dispatch(
          actions.setVideoWall({
            isCustomLayout: false,
            wallName: "",
            wallType: layout.quantity,
            wallTiles: []
          })
        );
      } else {
        dispatch(
          actions.setVideoWall({
            isCustomLayout: true,
            wallName: "",
            wallType: -1,
            wallTiles: []
          })
        );
      }
      dispatch(actions.hideDialog());
      dispatch(actions.setToolbarStatus("edit"));
      dispatch(actions.updateCustomLayout([]));
    },
    handleClose: () => {
      dispatch(actions.hideDialog());
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutDialog);
