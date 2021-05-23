import { connect, Dispatch } from "react-redux";
// import * as actions from "src/actions/index";
import AddVideoWallDialog from "../../components/Camera/AddVideoWallDialog";
import { IStoreState } from "src/types";
import {
  selectWallTile,
  ISelectWallTile,
  loadVideoWalls,
  setVideoWall,
  setListVideoWall,
  updateVideoWall,
  updateWallTile,
  ISetVideoWall,
  IUpdateWallTile,
  IUpdateVideoWall,
  ILoadVideoWalls,
  ISetVideoWalls,
  createVideoWall,
  ICreateVideoWall
} from "src/scenes/video-wall/actions/index";
import { IVideoWall } from "../../../video-wall/types/VideoWall";
import { hideDialog, IShowDialog } from "../../actions/AddVideoWallDialog";

export function mapStateToProps({
  videoWallManagement: { listVideoWall: listTemp },
  addVideoWallDialog: { showDialog, listCameraId },
  layoutDialog: { listLayout }
}: IStoreState) {
  const listVideoWall: IVideoWall[] = [];
  listTemp.forEach(videoWall => {
    if (!videoWall.isCustomLayout) {
      for (let index = 0; index < videoWall.wallType; index++) {
        const el = videoWall.wallTiles.find(tile => tile.tileIndex === index);
        if (!el) {
          listVideoWall.push(videoWall);
          break;
        }
      }
    } else if (videoWall.wallLayout && videoWall.wallLayout.length > 0) {
      for (let index = 0; index < videoWall.wallLayout.length; index++) {
        const el = videoWall.wallTiles.find(tile => tile.tileIndex === index);
        if (!el) {
          listVideoWall.push(videoWall);
          break;
        }
      }
    }
  });
  return {
    listVideoWall,
    showDialog,
    listCameraId,
    listLayout
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | ISelectWallTile
    | ISetVideoWall
    | IUpdateWallTile
    | IUpdateVideoWall
    | ICreateVideoWall
    | ILoadVideoWalls
    | IShowDialog
    | ISetVideoWalls
  >
) {
  return {
    handleClearListVideo: () => {
      dispatch(setListVideoWall([]));
    },
    handleSave: (videoWall: IVideoWall) => {
      dispatch(updateVideoWall(videoWall));
    },
    handleCreate: (videoWall: IVideoWall) => {
      dispatch(createVideoWall(videoWall));
    },
    handleSelect: (videoWall: IVideoWall, listCameraId: string[]) => {
      dispatch(setVideoWall(videoWall));
      dispatch(updateWallTile(videoWall.wallTiles));
      if (!videoWall.isCustomLayout) {
        for (let index = 0; index < videoWall.wallType; index++) {
          if (listCameraId.length === 0) {
            break;
          }
          const el = videoWall.wallTiles.find(tile => tile.tileIndex === index);
          if (!el) {
            const cameraId = listCameraId.shift();
            if (cameraId) {
              dispatch(
                selectWallTile({
                  cameraId,
                  tileIndex: index
                })
              );
            }
          }
        }
      } else if (videoWall.wallLayout && videoWall.wallLayout.length > 0) {
        for (let index = 0; index < videoWall.wallLayout.length; index++) {
          if (listCameraId.length === 0) {
            break;
          }
          const el = videoWall.wallTiles.find(tile => tile.tileIndex === index);
          if (!el) {
            const cameraId = listCameraId.shift();
            if (cameraId) {
              dispatch(
                selectWallTile({
                  cameraId,
                  tileIndex: index
                })
              );
            }
          }
        }
      }
    },
    handleClose: () => {
      dispatch(hideDialog());
      dispatch(setListVideoWall([]));
    },
    loadListVideoWall: () => {
      dispatch(loadVideoWalls());
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddVideoWallDialog);
