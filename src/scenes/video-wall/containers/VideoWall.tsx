import { connect, Dispatch } from "react-redux";
import {
  ISetFullScreen,
  ISelectWallTile,
  IUnSelectWallTile,
  setFullScreen,
  selectWallTile,
  removeTile,
  unSelectWallTile,
  updateCustomTile,
  IUpdateCustomTile,
  setToolbarStatus,
  ISetToolbarStatus,
  IRemoveTile
} from "../actions/index";
import {
  IOpenFloatingVideo,
  openFloatingVideo
} from "src/actions/video/FloatingVideo";
import VideoWall from "../components/VideoWall";
import { IStoreState } from "src/types";
import { IWallTileUpdate } from "../types/VideoWall";
import { ICustomTile } from "../types/Layout";
// import * as actions from "../actions/index";
// import { ICameraLayout } from "../types/Layout";

export function mapStateToProps({
  cameraLayout: { layout, isFullScreen, selectedCamera },
  videoWallManagement: { listCTTV, listCamera, listTile, videoWall, status }
}: IStoreState) {
  return {
    layout,
    listCTTV,
    listTile,
    videoWall,
    status,
    listCamera,
    isFullScreen,
    selectedCamera
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | ISetFullScreen
    | ISelectWallTile
    | IUnSelectWallTile
    | IOpenFloatingVideo
    | IUpdateCustomTile
    | ISetToolbarStatus
    | IRemoveTile
  >
) {
  return {
    handleSetFullScreen: (isFull: boolean) => {
      dispatch(setFullScreen(isFull));
    },
    selectWallTile: (info: IWallTileUpdate) => {
      dispatch(selectWallTile(info));
    },
    unSelectWallTile: (info: IWallTileUpdate) => {
      dispatch(unSelectWallTile(info));
    },
    openFloatingVideo: (src: string, name: string, type: string) => {
      dispatch(openFloatingVideo(src, name, type));
    },
    updateTile: (tile: ICustomTile) => {
      dispatch(updateCustomTile(tile));
    },
    setStatus: (status: string) => {
      dispatch(setToolbarStatus(status));
    },
    removeTile: (index: number) => {
      dispatch(removeTile(index));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoWall);
