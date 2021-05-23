import { Action } from "redux";
import { UPDATE_NOTIFICATION } from "./constant";
import INotificationInfo from "./types";
import { Dispatch } from "react-redux";

export interface IUpdateNotification extends Action<UPDATE_NOTIFICATION> {
  payload: INotificationInfo;
}

export const fireNotification = (dispatch: Dispatch<IUpdateNotification>) => (
  noti: INotificationInfo
) =>
  dispatch({
    type: UPDATE_NOTIFICATION,
    payload: { ...noti, isOpen: true }
  });

export const ceaseNotification = (dispatch: Dispatch<IUpdateNotification>) => (
  noti: INotificationInfo
) =>
  dispatch({
    type: UPDATE_NOTIFICATION,
    payload: { ...noti, isOpen: false }
  });
