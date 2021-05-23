import { Store, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import { ISetVideoWall } from "../actions/Toolbar";
import * as actions from "../actions/index";
import { SET_VIDEO_WALL } from "src/constants/index";

export const setVideoWall = (store: Store<IStoreState>) => (
  next: Dispatch<ISetVideoWall>
) => (action: ISetVideoWall) => {
  switch (action.type) {
    case SET_VIDEO_WALL: {
      const { payload } = action;
      if (payload) {
        const listLayout = store.getState().layoutDialog.listLayout;
        const layout = listLayout.find(e => {
          return e.quantity === payload.wallType;
        });
        if (layout) {
          store.dispatch(actions.selectCameraLayout(layout));
        } else {
          store.dispatch(actions.selectCameraLayout(null));
          if (payload.wallLayout) {
            store.dispatch(actions.updateCustomLayout(payload.wallLayout));
          }
        }
      }
    }
  }

  return next(action);
};
