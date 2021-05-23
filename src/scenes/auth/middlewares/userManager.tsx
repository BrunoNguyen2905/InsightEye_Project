import { createUserManager } from "redux-oidc";
import {
  // REACT_APP_REDIRECT_URL,
  REACT_APP_CLIENT_ID
} from "../../../environment";
const host = window.location.origin + window.location.pathname;
export const config = {
  authority: "http://shop.ins8.us/",
  client_id: REACT_APP_CLIENT_ID,
  redirect_uri: `${host}#/callback#`,
  response_type: "id_token token",
  scope: "openid profile eyeview",
  silent_redirect_uri: `${host}#/silent#`,
  automaticSilentRenew: true,
  post_logout_redirect_uri: "http://shop.ins8.us/eyeview"
};
console.log(config);
export const mgr = createUserManager(config);
