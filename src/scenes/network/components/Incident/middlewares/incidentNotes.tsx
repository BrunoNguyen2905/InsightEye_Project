import { Dispatch, Store } from "react-redux";
import Variant from "../../../../../components/notification/types/variant";
import { IStoreState } from "../../../../../types";
import {
  INCIDENT_DELETE_NOTE,
  INCIDENT_EDIT_NOTE,
  INCIDENT_SAVE_NOTE
} from "../constants";
import {
  common,
  IIncidentDeleteNote,
  IIncidentEditNote,
  IIncidentSaveNote,
  incidentUpdateData
} from "../../../../../actions";
import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../../../../../environment";
import getErrorMessage from "../../../../../helpers/getErrorMessage";
import {
  IMappingAction,
  mappingDispatch
} from "../../../../../helpers/mappingRedux";
import { IIncidentNote } from "../types/IncidentInfo";

export const incidentNotesMiddlewares = (store: Store<IStoreState>) => (
  next: Dispatch
) => (
  action: IMappingAction<
    IIncidentSaveNote | IIncidentDeleteNote | IIncidentEditNote
  >
) => {
  const currentState = store.getState();
  const dispatch = mappingDispatch(store.dispatch, action.key);
  switch (action.type) {
    case INCIDENT_SAVE_NOTE:
      axios
        .post(
          `${REACT_APP_API_URL}/api/v2/incident/${
            currentState.libs.selectedLib
          }/note`,
          action.payload
        )
        .then((data: AxiosResponse<{ message: string }>) => {
          common.fireNotification(store.dispatch)({
            variant: Variant.SUCCESS,
            message: `Save note success.`
          });
          if (currentState.mainMap.incident.data[action.key]) {
            incidentUpdateData(dispatch)({
              notes: currentState.mainMap.incident.data[
                action.key
              ].notes.concat([
                {
                  id: data.data.message,
                  lon: action.payload.lon,
                  lat: action.payload.lat,
                  bearing: action.payload.bearing,
                  content: action.payload.content
                }
              ])
            });
            action.meta.done(true, { id: data.data.message });
          }
        })
        .catch(err => {
          console.error(err);
          const response = err.response as AxiosResponse;
          common.fireNotification(store.dispatch)({
            message:
              response && response.data
                ? getErrorMessage(response.data, "Save note failed.")
                : "Save note failed.",
            variant: Variant.ERROR
          });
          action.meta.done(false);
        });
      break;

    case INCIDENT_EDIT_NOTE:
      axios
        .put(
          `${REACT_APP_API_URL}/api/v2/incident/${
            currentState.libs.selectedLib
          }/note`,
          action.payload
        )
        .then(() => {
          common.fireNotification(store.dispatch)({
            variant: Variant.SUCCESS,
            message: `Save note success.`
          });
          if (currentState.mainMap.incident.data[action.key]) {
            incidentUpdateData(dispatch)({
              notes: currentState.mainMap.incident.data[
                action.key
              ].notes.reduce(
                (current, note) => {
                  if (note.id === action.payload.noteId) {
                    current.push({
                      id: note.id,
                      lon: action.payload.lon,
                      lat: action.payload.lat,
                      bearing: action.payload.bearing,
                      content: action.payload.content
                    });
                  } else {
                    current.push(note);
                  }

                  return current;
                },
                [] as IIncidentNote[]
              )
            });
            action.meta.done(true);
          }
        })
        .catch(err => {
          console.error(err);
          const response = err.response as AxiosResponse;
          common.fireNotification(store.dispatch)({
            message:
              response && response.data
                ? getErrorMessage(response.data, "Save note failed.")
                : "Save note failed.",
            variant: Variant.ERROR
          });
          action.meta.done(false);
        });
      break;

    case INCIDENT_DELETE_NOTE:
      axios
        .delete(
          `${REACT_APP_API_URL}/api/v2/incident/${
            currentState.libs.selectedLib
          }/note/${action.payload.incidentId}/${action.payload.noteId}?noteId=${
            action.payload.noteId
          }`
        )
        .then(() => {
          if (currentState.mainMap.incident.data[action.key]) {
            incidentUpdateData(dispatch)({
              notes: currentState.mainMap.incident.data[
                action.key
              ].notes.filter(note => note.id !== action.payload.noteId)
            });
          }
          common.fireNotification(store.dispatch)({
            variant: Variant.SUCCESS,
            message: `Delete note success.`
          });
          action.meta.done(true);
        })
        .catch(err => {
          console.error(err);
          const response = err.response as AxiosResponse;
          common.fireNotification(store.dispatch)({
            message:
              response && response.data
                ? getErrorMessage(response.data, "Save note failed.")
                : "Delete note failed.",
            variant: Variant.ERROR
          });
          action.meta.done(false);
        });
      break;
  }
  return next(action);
};
