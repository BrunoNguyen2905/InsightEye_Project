import { connect, Dispatch } from "react-redux";
import * as actions from "../actions/index";
import MainPage from "../components/MainPage";
import { IStoreState } from "src/types";
export function mapStateToProps({ libs }: IStoreState) {
  return { selectedLib: libs.selectedLib };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    actions.ILoadVideoWalls | actions.ILoadListCamera | actions.IInitVideoWall
  >
) {
  return {
    loadListVideoWall: () => {
      dispatch(actions.loadVideoWalls());
    },
    loadListCamera: () => {
      dispatch(actions.loadListCamera());
    },
    initVideoWall: () => {
      dispatch(actions.initVideoWall());
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage);
