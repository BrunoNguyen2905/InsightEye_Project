import { Dispatch, Store } from "react-redux";
import { IStoreState } from "../../../types";
import { IGetCamPoints, setCamPoints } from "../actions/camPoints";
import { GET_CAM_POINTS } from "../constants/camPoints";
import axios, { AxiosResponse } from "axios";
import { Polygon } from "geojson";
import { ICoverageGeoJsonProperties } from "../types/GeoProperties";

export const getCamPoints = (store: Store<IStoreState>) => (next: Dispatch) => (
  action: IGetCamPoints
) => {
  const currentState = store.getState();
  switch (action.type) {
    case GET_CAM_POINTS: {
      if (
        currentState.mainMap.jsonVersion.PointJsonUrl &&
        currentState.mainMap.jsonVersion.CoverageJsonUrl
      ) {
        store.dispatch(
          setCamPoints({
            isFailed: false,
            isLoading: true
          })
        );
        axios
          .all([
            axios.get(`${currentState.mainMap.jsonVersion.PointJsonUrl}`, {}),
            axios.get(`${currentState.mainMap.jsonVersion.CoverageJsonUrl}`, {})
          ])
          .then(
            axios.spread(
              (
                pointsRes: AxiosResponse,
                coveragesRes: AxiosResponse<
                  GeoJSON.FeatureCollection<Polygon, ICoverageGeoJsonProperties>
                >
              ) => {
                store.dispatch(
                  setCamPoints(
                    {
                      isFailed: false,
                      isLoading: false,
                      coverages: coveragesRes.data,
                      points: pointsRes.data
                    },
                    true
                  )
                );
              }
            )
          )
          .catch(e => {
            console.error(e);
            store.dispatch(
              setCamPoints({
                isFailed: true,
                isLoading: false
              })
            );
          });
      }
    }
  }

  return next(action);
};
