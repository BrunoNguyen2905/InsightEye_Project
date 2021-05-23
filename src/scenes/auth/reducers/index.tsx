// import {
//   IChangeFormLogin,
//   IAuthenticationFail,
//   ISetupAuthentication
// } from "../actions";
// import { CHANGE_FORM_LOGIN, AUTHENTICATION_FAIL } from "../../../constants";
// import { IFormLogin, IErrorLogin } from "../components/Signin";
// import { combineReducers } from "redux";
// import { SETUP_AUTHENTICATION } from "src/constants";

// const DEFAULT_LOGIN_FORM: IFormLogin = { username: "", password: "" };
// const form = (
//   state: IFormLogin = DEFAULT_LOGIN_FORM,
//   action: IChangeFormLogin | ISetupAuthentication
// ): IFormLogin => {
//   switch (action.type) {
//     case CHANGE_FORM_LOGIN:
//       return action.payload.value;
//     case SETUP_AUTHENTICATION:
//       return DEFAULT_LOGIN_FORM;
//   }
//   return state;
// };

// const rules = {
//   username: (value: string) => (!value ? "can't empty" : ""),
//   password: (value: string) => (!value ? "can't empty" : "")
// };

// const error = (
//   state: IErrorLogin = { username: "", password: "" },
//   action: IChangeFormLogin | IAuthenticationFail
// ): IErrorLogin => {
//   switch (action.type) {
//     case CHANGE_FORM_LOGIN:
//       const keys = action.payload.keys;
//       return {
//         ...state,
//         ...keys.reduce(
//           (res, key) => ({
//             ...res,
//             [key]: rules[key](action.payload.value[key])
//           }),
//           {}
//         )
//       };
//     case AUTHENTICATION_FAIL:
//       return {
//         ...state,
//         server: action.payload
//       };
//   }
//   return state;
// };

// export const login = combineReducers({
//   form,
//   error
// });

export * from "./Auth";
// export * from "./ForgotPassword";
