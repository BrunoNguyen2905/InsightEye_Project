import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import SelectLib from "../components/StepSelectLib";
import { getListLibs, selectLib } from "../actions/libs";
import { setupAuthentication, logout } from "../../auth/actions/Auth";
import { socket, RealtimeEvent } from "src/middlewares/realtime";

function mapStateToProps({ libs }: IStoreState) {
  return {
    libs: libs.list,
    selectLib: libs.selectedLib,
    isLoading: libs.listState.isLoading
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    getListLibs: () => {
      dispatch(getListLibs());
    },
    onSelectLib: (id: string) => () => {
      dispatch(selectLib(id));
      socket.emit(RealtimeEvent.SERVER_JOIN, id);
    },
    logout: () => {
      dispatch(logout());
      dispatch(setupAuthentication());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectLib);
