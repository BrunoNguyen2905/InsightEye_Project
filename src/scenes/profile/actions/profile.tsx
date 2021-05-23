import { Action } from "redux";
import { USER_CHANGE_PASSWORD } from "../constants/profile";

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePassword extends Action<USER_CHANGE_PASSWORD> {
  payload: IChangePasswordPayload;
  meta: {
    cb: (reset: boolean) => void;
  };
}

export function changePassword(
  payload: IChangePasswordPayload,
  cb: (reset: boolean) => void
): IChangePassword {
  return {
    type: USER_CHANGE_PASSWORD,
    payload,
    meta: {
      cb
    }
  };
}
