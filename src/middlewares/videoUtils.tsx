import { Dispatch } from "redux";
import { Store } from "react-redux";
import { IStoreState } from "../types";
import { SETUP_AUTHENTICATION } from "src/constants";
import { ISetupAuthentication, setAccountId } from "../scenes/auth/actions";
import { VideoUtils } from "../helpers/videoUrlCreator";
import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../environment";
import { IUserInfo } from "../types/User";

export const initVideoUtils = (store: Store<IStoreState>) => (
  next: Dispatch<ISetupAuthentication>
) => (action: ISetupAuthentication) => {
  switch (action.type) {
    case SETUP_AUTHENTICATION:
      {
        if (action.payload) {
          axios
            .get(`${REACT_APP_API_URL}/api/V2/account/info`)
            .then((resp: AxiosResponse<IUserInfo>) => {
              VideoUtils.updateUser(resp.data);
              store.dispatch(setAccountId(resp.data.UserId));
            });
        }
      }
      break;
  }

  return next(action);
};
