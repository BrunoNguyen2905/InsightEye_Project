import * as constants from "src/constants";
import { Action } from "redux";
import { Dispatch } from "react-redux";
import { User } from "oidc-client";
import { SET_ACCOUNT_ID } from "src/constants";

export interface ISetupAuthentication
  extends Action<constants.SETUP_AUTHENTICATION> {
  payload?: User;
}

export interface ILogout extends Action<constants.LOGOUT> {}
export function logout(): ILogout {
  return {
    type: constants.LOGOUT
  };
}

export function setupAuthentication(account?: User): ISetupAuthentication {
  return {
    payload: account,
    type: constants.SETUP_AUTHENTICATION
  };
}
export interface IRecheckAuthentication extends Action<constants.AUTH_RECHECK> {
  payload?: User;
}
export interface ICheckingAuthentication
  extends Action<constants.CHECKING_AUTHENTICATION> {
  payload: boolean;
}
export function checkingAuthentication(
  isChecking: boolean
): ICheckingAuthentication {
  return {
    type: constants.CHECKING_AUTHENTICATION,
    payload: isChecking
  };
}

export const recheckAuthentication = (
  dispatch: Dispatch<IRecheckAuthentication>
) => (account: User) => {
  return dispatch({
    payload: account,
    type: constants.AUTH_RECHECK
  });
};

export interface ISetAccountId extends Action<constants.SET_ACCOUNT_ID> {
  payload: string;
}

export function setAccountId(id: string): ISetAccountId {
  return {
    type: SET_ACCOUNT_ID,
    payload: id
  };
}
