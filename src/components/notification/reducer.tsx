import INotificationInfo from "./types";
import { IUpdateNotification } from "./action";
import { UPDATE_NOTIFICATION } from "./constant";

export const notification = (
  state: INotificationInfo | {} = {},
  action: IUpdateNotification
): INotificationInfo | {} => {
  switch (action.type) {
    case UPDATE_NOTIFICATION:
      return {
        ...(state ? state : {}),
        ...action.payload
      };
  }
  return state;
};
