import axios, { AxiosError, AxiosResponse } from "axios";
import { Dispatch, Store } from "react-redux";
import { IResponseListUser } from "../../user-mgnt/types/users";
import Variant from "../../../components/notification/types/variant";
import { REACT_APP_API_URL } from "../../../environment";
import { IStoreState } from "../../../types";
import { IChangePassword } from "../actions/profile";
import { USER_CHANGE_PASSWORD } from "../constants/profile";
import { common } from "../../../actions";
import getErrorMessage from "src/helpers/getErrorMessage";

export const profileMiddleware = (store: Store<IStoreState>) => (
  next: Dispatch<IChangePassword>
) => (action: IChangePassword) => {
  const currentState = store.getState();
  switch (action.type) {
    case USER_CHANGE_PASSWORD: {
      axios
        .put(
          `${REACT_APP_API_URL}/api/V2/user/${
            currentState.libs.selectedLib
          }/password/change`,
          action.payload
        )
        .then((data: AxiosResponse<IResponseListUser>) => {
          common.fireNotification(store.dispatch)({
            message: "Change password success.",
            variant: Variant.SUCCESS
          });
          action.meta.cb(true);
        })
        .catch((e: AxiosError) => {
          console.error(e);
          const response = e.response as AxiosResponse;
          common.fireNotification(store.dispatch)({
            message:
              response && response.data
                ? getErrorMessage(response.data, "Edit password failed.")
                : "Edit password failed.",
            variant: Variant.ERROR
          });
          action.meta.cb(false);
        });
      break;
    }
  }
  return next(action);
};
