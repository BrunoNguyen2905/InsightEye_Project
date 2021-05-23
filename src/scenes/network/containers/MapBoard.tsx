import { connect, Dispatch } from "react-redux";
import * as actions from "src/actions/index";
import { IProps } from "../components/MapBoard";
import MapBoard from "../components/MapBoard";
import { IStoreState } from "src/types";

export function mapStateToProps({ helloState }: IStoreState) {
  return {
    helloState
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.IUpdateHelloState>
) {
  return {
    updateBoundary: (elem: HTMLElement) => {
      if (!elem) {
        return;
      }
      dispatch(
        actions.updateHelloState({
          width: elem.clientWidth,
          height: elem.clientHeight
        })
      );
    }
  };
}
export default connect<IProps>(
  mapStateToProps,
  mapDispatchToProps
)(MapBoard);
