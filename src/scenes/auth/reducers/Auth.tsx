import {
  ISetupAuthentication,
  ICheckingAuthentication,
  ISetAccountId
} from "../actions";
import {
  SETUP_AUTHENTICATION,
  CHECKING_AUTHENTICATION,
  SET_ACCOUNT_ID
} from "../../../constants";
import { combineReducers } from "redux";
import { User } from "oidc-client";
// import IAccount from "../../../types/Account";

function isAuth(state: boolean = false, action: ISetupAuthentication): boolean {
  switch (action.type) {
    case SETUP_AUTHENTICATION:
      const accountValue = action.payload;
      return !!accountValue && !!accountValue.profile;
  }
  return state;
}

function isChecking(
  state: boolean = true,
  action: ICheckingAuthentication
): boolean {
  switch (action.type) {
    case CHECKING_AUTHENTICATION:
      return action.payload;
  }
  return state;
}

function account(
  state: User | null = null,
  action: ISetupAuthentication
): User | null {
  switch (action.type) {
    case SETUP_AUTHENTICATION:
      const accountValue = action.payload;
      return accountValue || null;
  }
  return state;
}

function accountID(state: string = "", action: ISetAccountId) {
  switch (action.type) {
    case SET_ACCOUNT_ID:
      return action.payload;
  }

  return state;
}

export const auth = combineReducers({
  isAuth,
  account,
  isChecking,
  accountID
});
