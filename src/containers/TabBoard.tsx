import { connect, Dispatch } from "react-redux";
// import * as actions from "src/actions/index";
import TabBoard, { IDynamicTab } from "../components/TabBoard";
import { IStoreState } from "src/types";
import { setTabId, ISetTabId } from "../actions/TabBoard";

export function mapStateToProps({
  tabBoardManagement: { tabId }
}: IStoreState) {
  return {
    tabId
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ISetTabId>) {
  return {
    setTabId: (tabId: string) => {
      dispatch(setTabId(tabId));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{
  tabs: IDynamicTab[];
}>(TabBoard);
