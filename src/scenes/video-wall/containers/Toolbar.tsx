import { connect, Dispatch } from "react-redux";
import * as actions from "../actions/index";
import Toolbar from "../components/Toolbar";
import { IStoreState } from "src/types";
import { IVideoWall, IWallTileUpdate } from "../types/VideoWall";
import { ICameraLayout, ICustomTile } from "../types/Layout";
export function mapStateToProps({
  videoWallManagement: { listCTTV, listVideoWall, videoWall, status },
  layoutDialog: { listLayout },
  cameraLayout: { layout }
}: IStoreState) {
  return {
    listCTTV,
    listVideoWall,
    videoWall,
    status,
    listLayout,
    layout
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | actions.ILoadCCTVs
    | actions.ILoadVideoWalls
    | actions.ISetVideoWall
    | actions.ISetToolbarStatus
    | actions.IShowDialog
    | actions.ICreateVideoWall
    | actions.IUpdateVideoWall
    | actions.IDeleteVideoWall
    | actions.ISelectLayout
    | actions.ISetFullScreen
    | actions.ILoadListCamera
    | actions.IUpdateWallTile
    | actions.IAddTile
    | actions.IUpdateCustomLayout
    | actions.IInitVideoWall
  >
) {
  return {
    loadListVideoWall: () => {
      dispatch(actions.loadVideoWalls());
    },
    loadListCTTV: (videoWallId: string) => {
      dispatch(actions.loadCTTVs(videoWallId));
    },
    loadListCamera: () => {
      dispatch(actions.loadListCamera());
    },
    setVideoWall: (videoWall: IVideoWall) => {
      dispatch(actions.setVideoWall(videoWall));
    },
    setStatus: (status: string) => {
      dispatch(actions.setToolbarStatus(status));
    },
    openLayout: () => {
      dispatch(actions.showDialog());
    },
    save: (videoWall: IVideoWall) => {
      if (!videoWall.wallName) {
        return;
      }
      if (videoWall.wallId) {
        dispatch(actions.updateVideoWall(videoWall));
      } else {
        dispatch(actions.createVideoWall(videoWall));
      }
    },
    revert: (videoWall: IVideoWall) => {
      dispatch(actions.setVideoWall(videoWall));
      dispatch(actions.updateWallTile(videoWall.wallTiles));
      dispatch(actions.setToolbarStatus("view"));
    },
    edit: () => {
      dispatch(actions.setToolbarStatus("edit"));
    },
    deleteVideoWall: (videoWall: IVideoWall) => {
      if (videoWall.wallId) {
        dispatch(actions.deleteVideoWall(videoWall));
        dispatch(actions.setToolbarStatus("view"));
      }
    },
    selectLayout: (layout: ICameraLayout) => {
      dispatch(actions.selectCameraLayout(layout));
    },
    selectFullScreen: () => {
      dispatch(actions.setFullScreen(true));
    },
    updateWallTile: (wallTiles: IWallTileUpdate[]) => {
      dispatch(actions.updateWallTile(wallTiles));
    },
    addTile: (tile: ICustomTile) => {
      dispatch(actions.addTile(tile));
    },
    cleanAll: () => {
      dispatch(actions.updateCustomLayout([]));
      dispatch(actions.initVideoWall());
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
