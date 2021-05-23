import { Store, Dispatch } from "react-redux";
import axios, { AxiosError, AxiosResponse } from "axios";

import { IStoreState } from "src/types";
import {
  MANAGEMENT_CCTV_CREATE_CCTV,
  MANAGEMENT_CCTV_GET_CCTV,
  MANAGEMENT_CCTV_EDIT_CCTV
} from "../constants";
import { ICreateCCTV, IGetDetailCCTV, IEditCCTV } from "../actions/formCCTV";
import { setDetailCCTV } from "../actions/detailCCTV";
import { getListCCTV } from "../actions/listCCTV";
import { REACT_APP_API_URL } from "src/environment";
import { common } from "src/actions";
import Variant from "src/components/notification/types/variant";
import { IDetailCCTV } from "../types/listCCTV";

interface ICreateCCTVResponnseError {
  ErrorMessage: string;
}

export const formCCTV = (store: Store<IStoreState>) => (next: Dispatch) => (
  action: ICreateCCTV | IGetDetailCCTV | IEditCCTV
) => {
  const currentState = store.getState();

  switch (action.type) {
    case MANAGEMENT_CCTV_CREATE_CCTV: {
      axios
        .post(
          `${REACT_APP_API_URL}/api/v2/point/${currentState.libs.selectedLib}`,
          action.payload
        )
        .then((response: AxiosResponse) => {
          store.dispatch(getListCCTV());
          if (action.meta && action.meta.cb) {
            action.meta.cb(true);
          }
          common.fireNotification(store.dispatch)({
            message: "Create new CCTV success.",
            variant: Variant.SUCCESS
          });
        })
        .catch((e: AxiosError) => {
          console.error(e);
          if (action.meta && action.meta.cb) {
            action.meta.cb(false);
          }
          const response = e.response as AxiosResponse<
            ICreateCCTVResponnseError
          >;

          common.fireNotification(store.dispatch)({
            message: response.data.ErrorMessage
              ? response.data.ErrorMessage
              : "Error create CCTV",
            variant: Variant.ERROR
          });
        });
      break;
    }

    case MANAGEMENT_CCTV_EDIT_CCTV: {
      if (currentState.CCTVManagement.detailCCTVState.data) {
        axios
          .post(
            `${REACT_APP_API_URL}/api/v2/point/${
              currentState.libs.selectedLib
            }/${currentState.CCTVManagement.detailCCTVState.data.id}`,
            action.payload
          )
          .then((response: AxiosResponse<IDetailCCTV>) => {
            const newState = store.getState();
            if (
              newState.CCTVManagement.detailCCTVState.data &&
              currentState.CCTVManagement.detailCCTVState.data &&
              newState.CCTVManagement.detailCCTVState.data.id ===
                currentState.CCTVManagement.detailCCTVState.data.id
            ) {
              store.dispatch(
                setDetailCCTV({
                  data: response.data
                })
              );
            }
            store.dispatch(getListCCTV());
            if (action.meta && action.meta.cb) {
              action.meta.cb(true);
            }
            common.fireNotification(store.dispatch)({
              message: "Edit CCTV success.",
              variant: Variant.SUCCESS
            });
          })
          .catch((e: AxiosError) => {
            console.error(e);
            if (action.meta && action.meta.cb) {
              action.meta.cb(false);
            }
            const response = e.response as AxiosResponse<
              ICreateCCTVResponnseError
            >;

            common.fireNotification(store.dispatch)({
              message: response.data.ErrorMessage
                ? response.data.ErrorMessage
                : "Error edit CCTV",
              variant: Variant.ERROR
            });
          });
      }
      break;
    }

    case MANAGEMENT_CCTV_GET_CCTV: {
      store.dispatch(
        setDetailCCTV({
          isLoading: true,
          isFailed: false
        })
      );
      axios
        .get(
          `${REACT_APP_API_URL}/api/v2/point/${currentState.libs.selectedLib}/${
            action.payload
          }`
        )
        .then((response: AxiosResponse<IDetailCCTV>) => {
          store.dispatch(
            setDetailCCTV({
              isLoading: false,
              isFailed: false,
              data: response.data
            })
          );
        })
        .catch((e: AxiosError) => {
          console.error(e);
          common.fireNotification(store.dispatch)({
            message: "Cannot get CCTV",
            variant: Variant.ERROR
          });
          store.dispatch(
            setDetailCCTV({
              isLoading: false,
              isFailed: true
            })
          );
        });
      break;
    }
  }
  return next(action);
};
