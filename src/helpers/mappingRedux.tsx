import { Action } from "redux";
import { Dispatch } from "react-redux";

export const NEW_KEY = "NEW_KEY";

export const REDUX_MAPPING_MOVE = "REDUX_MAPPING_MOVE";
export type REDUX_MAPPING_MOVE = typeof REDUX_MAPPING_MOVE;

export interface IReduxMappingMove extends Action<REDUX_MAPPING_MOVE> {
  parentKey: string;
  key: string;
  target: string;
}
export const REDUX_MAPPING_REMOVE = "REDUX_MAPPING_REMOVE";
export type REDUX_MAPPING_REMOVE = typeof REDUX_MAPPING_REMOVE;

export interface IReduxMappingRemove extends Action<REDUX_MAPPING_REMOVE> {
  parentKey: string;
  key: string;
}

export const reduxMappingMove = (
  parentKey: string,
  key: string,
  target: string
): IReduxMappingMove => ({
  type: REDUX_MAPPING_MOVE,
  parentKey,
  key,
  target
});

export const reduxMappingRemove = (
  parentKey: string,
  key: string
): IReduxMappingRemove => ({
  type: REDUX_MAPPING_REMOVE,
  parentKey,
  key
});

export interface IMappingType<T> {
  [key: string]: T;
}

export function mappingValue<T>(value: T): IMappingType<T> {
  return {
    [NEW_KEY]: value
  };
}

export type IMappingAction<T extends Action> = T & {
  key: string;
};

export function mappingDispatch<T extends Action>(
  dispatch: Dispatch<T>,
  key: string = NEW_KEY
) {
  return (action: T) =>
    dispatch({
      ...(action as any),
      key
    });
}

type Reducer<T, U extends Action> = (state: T | undefined, action: U) => T;

export const mappingReducer = <T, U extends Action>(reducer: Reducer<T, U>) => (
  state: IMappingType<T> = {},
  action: IMappingAction<U>
): IMappingType<T> => {
  const key = action.key || NEW_KEY;

  return {
    ...state,
    [key]: reducer(state[key], action)
  };
};

export const mappingReducerMoveable = (
  parentKey: string,
  mappingRdc: typeof mappingReducer
) => <T, U extends Action>(reducer: Reducer<T, U>) => (
  state: IMappingType<T> = {},
  action: IMappingAction<U> | IReduxMappingMove | IReduxMappingRemove
): IMappingType<T> => {
  if (action.type === REDUX_MAPPING_MOVE) {
    const ac = action as IReduxMappingMove;
    if (parentKey !== ac.parentKey) {
      return state;
    }
    const currentData = state[ac.key];
    return {
      ...state,
      [ac.target]: currentData
    };
  }
  if (action.type === REDUX_MAPPING_REMOVE) {
    const ac = action as IReduxMappingRemove;
    if (parentKey !== ac.parentKey) {
      return state;
    }
    delete state[ac.key];
    return state;
  }
  return mappingRdc(reducer)(state, action as IMappingAction<U>);
};

export type CLONE<K> = any;
export type EXTEND<K> = any;

export const cloneKey = <K extends any>(extendKey: EXTEND<K>) => (
  key: K
): CLONE<K> => `${key}_EXTEND_${extendKey}`;
export const revertKey = <T extends CLONE<K>, K extends any>(
  extendKey: EXTEND<K>
) => (key: CLONE<K>): K => {
  return (key as string).replace(`_EXTEND_${extendKey}`, "") as any;
};

export type CLONE_ACTION<T extends Action<K>, K extends any> = {
  [Key in keyof T]: T[Key]
} & {
  type: CLONE<K>;
};

export const cloneAction = <T extends Action<K>, K extends any>(
  key: EXTEND<K>
) => (action: T): CLONE_ACTION<T, K> => ({
  ...(action as any),
  type: cloneKey(key)(action.type)
});

const revertAction = <
  T extends CLONE_ACTION<U, K>,
  K extends any,
  U extends Action<K>
>(
  key: EXTEND<K>
) => (action: T): U => ({
  ...(action as any),
  type: revertKey(key)(action.type)
});

export const cloneReducer = <
  T,
  U extends Action<K> = Action<K>,
  K extends any = any
>(
  key: EXTEND<K>
) => (reducer: Reducer<T, U>) => (state: T, action: CLONE_ACTION<U, K>): T =>
  reducer(state, revertAction<CLONE_ACTION<U, K>, K, U>(key)(action));

export const cloneDispatch = <T extends Action<K>, K extends any = any>(
  key: EXTEND<K>
) => (dispatch: Dispatch<T>): Dispatch<T> => (action: T) =>
  dispatch(cloneAction<T, K>(key)(action) as any);
