import { Store, Dispatch } from "react-redux";
import { IStoreState } from "../types";
import { REACT_APP_SOCKET_IO } from "../environment";
import * as io from "socket.io-client";
import { ISetupAuthentication } from "../scenes/auth/actions";
import { SETUP_AUTHENTICATION } from "../constants/index";
import { IVideoControl } from "../actions/video/HLSSource";
import { VIDEO_CONTROL } from "../constants/VideoConstants";
import { getJsonVersion } from "../actions";
import { ILib, IPlanText, IPlan } from "src/scenes/lib/types/libs";
import { SET_LIST_LIBS } from "src/scenes/lib/constants/libs";
import { ISetListLibs, setListLibs } from "src/scenes/lib/actions/libs";
// import { IPointLocation } from "../scenes/network/types/GeoProperties";

export enum RealtimeEvent {
  CLIENT_HAND_SHAKE_SUCCESS = "client_hand_shake_success",
  CLIENT_POINTS_UPDATE = "client_points_update",
  SERVER_JOIN = "server_join",
  CLIENT_JOIN_SUCCESS = "client_join_success",
  SERVER_PTZ = "server_ptz",
  CLIENT_PTZ = "client_ptz",
  CLIENT_LOCATION = "client_location",
  LIBRARY_CHANGE_STATUS = "library_status_changed",
  LIBRARY_CHANGE_TYPE = "library_type_changed"
}

export interface IRealtimeActiveChange {
  action: boolean;
  libraryId: string;
}

export interface IRealtimeTypeChange {
  type: string;
  libraryId: string;
}

let listLibs: ILib[];
export let socket: SocketIOClient.Socket;
export const iniSocket = (store: Store<IStoreState>) => (
  next: Dispatch<ISetupAuthentication | IVideoControl | ISetListLibs>
) => (action: ISetupAuthentication | IVideoControl | ISetListLibs) => {
  // const currentState = store.getState();
  switch (action.type) {
    case SETUP_AUTHENTICATION: {
      const account = action.payload;
      if (!account) {
        if (socket && socket.connected) {
          socket.disconnect();
          socket.close();
        }
        break;
      }
      // console.log("connect");
      socket = io.connect(
        `${REACT_APP_SOCKET_IO}`,
        {
          query: { token: account.access_token }
        }
      );

      // socket.on("connect", (data: any) => {
      //   console.log("connected", data);
      //   if (listLibs) {
      //     listLibs.forEach(el => {
      //       socket.emit(RealtimeEvent.JOIN, el.id);
      //     });
      //   }
      // });

      socket.on(RealtimeEvent.CLIENT_HAND_SHAKE_SUCCESS, () => {
        // if (currentState.libs.selectedLib !== "") {
        //   socket.emit(RealtimeEvent.SERVER_JOIN, currentState.libs.selectedLib);
        // }
        console.log("connected");
        if (listLibs) {
          listLibs.forEach(el => {
            socket.emit(RealtimeEvent.SERVER_JOIN, el.id);
          });
        }
      });
      socket.on(RealtimeEvent.CLIENT_JOIN_SUCCESS, (data: any) => {
        console.log("Join server success");
      });

      socket.on(RealtimeEvent.CLIENT_PTZ, (data: any) => {
        console.log("ptz", data);
      });

      socket.on(
        RealtimeEvent.LIBRARY_CHANGE_STATUS,
        updateLibraryActive(store.dispatch, store.getState())
      );

      socket.on(
        RealtimeEvent.LIBRARY_CHANGE_TYPE,
        updateLibraryType(store.dispatch, store.getState())
      );

      socket.on(RealtimeEvent.CLIENT_POINTS_UPDATE, (libraryId: string) => {
        getJsonVersion(store.dispatch)(libraryId);
        // getJsonVersion(store)(store.dispatch)();
      });

      break;
    }

    case VIDEO_CONTROL: {
      socket.emit(RealtimeEvent.SERVER_PTZ, action.payload);
      break;
    }

    case SET_LIST_LIBS: {
      listLibs = action.payload;
      if (socket) {
        listLibs.forEach(el => {
          socket.emit(RealtimeEvent.SERVER_JOIN, el.id);
        });
      }
    }
  }

  return next(action);
};

const updateLibraryActive = (dispatch: Dispatch, state: IStoreState) => (
  data: IRealtimeActiveChange
) => {
  const newListLibs = listLibs.map(el => {
    if (el.id === data.libraryId) {
      el.active = data.action;
    }
    return el;
  });
  dispatch(setListLibs(newListLibs));
};

const updateLibraryType = (dispatch: Dispatch, state: IStoreState) => (
  data: IRealtimeTypeChange
) => {
  const newListLibs = listLibs.map(el => {
    if (el.id === data.libraryId) {
      switch (data.type) {
        case IPlanText.FreeTrial:
          el.type = IPlan[IPlan.FreeTrial];
          break;
        case IPlanText.PayAsYouGo:
          el.type = IPlan[IPlan.PayAsYouGo];
          break;
        case IPlanText.Enterprise:
          el.type = IPlan[IPlan.Enterprise];
          break;
        default:
          break;
      }
    }
    return el;
  });
  dispatch(setListLibs(newListLibs));
};
