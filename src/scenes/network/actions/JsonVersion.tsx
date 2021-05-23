import { Action } from "redux";
import { GET_VERSION_JSON, UPDATE_VERSION_JSON } from "../constants";
import IJsonVersion from "../types/JsonVersion";
import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../../../environment";
import { Dispatch } from "react-redux";

export interface IGetJsonVersion extends Action<GET_VERSION_JSON> {}
export const getJsonVersion = (dispatch: Dispatch<IUpdateJsonVersion>) => (
  selectedLib: string
) => {
  axios
    .get(`${REACT_APP_API_URL}/api/v2/point/${selectedLib}/latestVersion`)
    .then((data: AxiosResponse<IJsonVersion>) => {
      updateJsonVersion(dispatch)(data.data);
    });
};
export interface IUpdateJsonVersion extends Action<UPDATE_VERSION_JSON> {
  payload: IJsonVersion;
}
export const updateJsonVersion = (dispatch: Dispatch<IUpdateJsonVersion>) => (
  jsonVersion: IJsonVersion
) => {
  dispatch({
    type: UPDATE_VERSION_JSON,
    payload: jsonVersion
  });
};
