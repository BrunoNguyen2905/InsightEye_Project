import { Store, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import {
  ILoadCCTVs,
  ILoadVideoWalls,
  ICreateVideoWall,
  IUpdateVideoWall,
  IDeleteVideoWall,
  ILoadListCamera
} from "../actions/Toolbar";
import * as actions from "../actions/index";
import {
  LOAD_VIDEO_WALLS,
  LOAD_CCTVS,
  CREATE_VIDEO_WALL,
  UPDATE_VIDEO_WALL,
  DELETE_VIDEO_WALL,
  LOAD_LIST_CAMERA
} from "src/constants/index";
import { common } from "src/actions";
import { hideDialog } from "../../network/actions/AddVideoWallDialog";
import Variant from "src/components/notification/types/variant";
import axios, { AxiosResponse } from "axios";
import {
  IVideoWall,
  ICCTV,
  ICameraInfo,
  IWallTileUpdate,
  IVideoWallUpdate,
  IVideoWallResponse
} from "../types/VideoWall";
import { ICustomTile } from "../types/Layout";

export const loadVideoWalls = (store: Store<IStoreState>) => (
  next: Dispatch<ILoadVideoWalls>
) => (action: ILoadVideoWalls) => {
  switch (action.type) {
    case LOAD_VIDEO_WALLS: {
      const currentState = store.getState();
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/V2/videowall/${
            currentState.libs.selectedLib
          }/user`
        )
        .then((data: AxiosResponse<IVideoWallResponse[]>) => {
          const listVideoWallRes: IVideoWall[] = data.data.map(el => {
            if (el.isCustomLayout && el.wallLayout) {
              const wallLayout: ICustomTile[] = JSON.parse(el.wallLayout);
              return {
                ...el,
                wallLayout
              };
            } else {
              return {
                ...el,
                wallLayout: []
              };
            }
          });
          store.dispatch(actions.setListVideoWall(listVideoWallRes));
          if (
            !store.getState().videoWallManagement.videoWall &&
            data.data.length > 0
          ) {
            store.dispatch(actions.setVideoWall(listVideoWallRes[0]));
          }
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const loadCTTVs = (store: Store<IStoreState>) => (
  next: Dispatch<ILoadCCTVs>
) => (action: ILoadCCTVs) => {
  switch (action.type) {
    case LOAD_CCTVS: {
      const { payload } = action;
      const currentState = store.getState();
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/V2/videowall/${
            currentState.libs.selectedLib
          }/${payload}`
        )
        .then((data: AxiosResponse<ICCTV[]>) => {
          store.dispatch(actions.setListCTTVs(data.data));
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const loadListCamera = (store: Store<IStoreState>) => (
  next: Dispatch<ILoadListCamera>
) => (action: ILoadListCamera) => {
  const currentState = store.getState();
  switch (action.type) {
    case LOAD_LIST_CAMERA: {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/V2/point/${
            currentState.libs.selectedLib
          }/cameras`
        )
        .then((data: AxiosResponse<ICameraInfo[]>) => {
          store.dispatch(actions.setListCamera(data.data));
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const createVideoWall = (store: Store<IStoreState>) => (
  next: Dispatch<ICreateVideoWall>
) => (action: ICreateVideoWall) => {
  const currentState = store.getState();
  switch (action.type) {
    case CREATE_VIDEO_WALL: {
      const { payload } = action;
      const wallTiles: IWallTileUpdate[] = [];
      const selectedCamera = store.getState().cameraLayout.selectedCamera;
      Object.keys(selectedCamera).forEach(key => {
        const tileIndex: number = +key;
        const cameraId = selectedCamera[tileIndex];
        wallTiles.push({
          tileIndex,
          cameraId
        });
      });
      const requestObject: IVideoWallUpdate = {
        isCustomLayout: payload.isCustomLayout,
        wallName: payload.wallName,
        wallTiles,
        wallType: payload.wallType
      };
      if (payload.isCustomLayout) {
        const listTile = store.getState().videoWallManagement.listTile;
        requestObject.wallLayout = JSON.stringify(listTile);
      }
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/V2/videowall/${
            currentState.libs.selectedLib
          }`,
          {
            ...requestObject
          }
        )
        .then((data: AxiosResponse<IVideoWallResponse>) => {
          store.dispatch(actions.loadVideoWalls());
          if (data.data.wallLayout) {
            const newVideoWall: IVideoWall = {
              ...data.data,
              wallLayout: JSON.parse(data.data.wallLayout)
            };
            store.dispatch(actions.setVideoWall(newVideoWall));
          } else {
            const newVideoWall: IVideoWall = {
              ...data.data,
              wallLayout: []
            };
            store.dispatch(actions.setVideoWall(newVideoWall));
          }
          store.dispatch(actions.setToolbarStatus("view"));
          store.dispatch(hideDialog());
          common.fireNotification(store.dispatch)({
            message: `Video wall "${
              requestObject.wallName
            }" was created successfully`,
            variant: Variant.SUCCESS
          });
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const updateVideoWall = (store: Store<IStoreState>) => (
  next: Dispatch<IUpdateVideoWall>
) => (action: IUpdateVideoWall) => {
  const currentState = store.getState();
  switch (action.type) {
    case UPDATE_VIDEO_WALL: {
      const { payload } = action;
      const selectedCamera = store.getState().cameraLayout.selectedCamera;
      const wallTiles: IWallTileUpdate[] = [];
      Object.keys(selectedCamera).forEach(key => {
        const tileIndex: number = +key;
        const cameraId = selectedCamera[tileIndex];
        wallTiles.push({
          tileIndex,
          cameraId
        });
      });
      const requestObject: IVideoWallUpdate = {
        isCustomLayout: payload.isCustomLayout,
        wallId: payload.wallId,
        wallName: payload.wallName,
        wallTiles,
        wallType: payload.wallType
      };
      const listTile = store.getState().videoWallManagement.listTile;
      if (payload.isCustomLayout) {
        requestObject.wallLayout = JSON.stringify(listTile);
      }
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/V2/videowall/${
            currentState.libs.selectedLib
          }`,
          {
            ...requestObject
          }
        )
        .then((data: AxiosResponse<IVideoWall>) => {
          store.dispatch(actions.loadVideoWalls());
          const newVideoWall: IVideoWall = {
            ...requestObject,
            wallTiles: payload.wallTiles,
            wallLayout: listTile
          };
          store.dispatch(actions.setVideoWall(newVideoWall));
          store.dispatch(actions.setToolbarStatus("view"));
          store.dispatch(hideDialog());
          common.fireNotification(store.dispatch)({
            message: `Video wall "${
              newVideoWall.wallName
            }" was updated successfully`,
            variant: Variant.SUCCESS
          });
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};

export const deleteVideoWall = (store: Store<IStoreState>) => (
  next: Dispatch<IDeleteVideoWall>
) => (action: IDeleteVideoWall) => {
  const currentState = store.getState();
  switch (action.type) {
    case DELETE_VIDEO_WALL: {
      const { payload } = action;
      axios
        .delete(
          `${process.env.REACT_APP_API_URL}/api/V2/videowall/${
            currentState.libs.selectedLib
          }/${payload.wallId}`
        )
        .then((data: AxiosResponse<any>) => {
          store.dispatch(actions.setVideoWall(null));
          store.dispatch(actions.loadVideoWalls());
        })
        .catch(e => {
          throw e;
        });
    }
  }

  return next(action);
};
