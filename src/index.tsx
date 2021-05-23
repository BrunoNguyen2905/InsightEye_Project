// Make sure css-loader ready before async loading css
// https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/456
import "style-loader/lib/addStyles";
import "css-loader/lib/css-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import * as enthusiasms from "./reducers/index";
import { IStoreState } from "./types/index";
// import Hello from './containers/Hello';
import { Provider } from "react-redux";
import { DeepPartial } from "redux";
import { IApplicationInit } from "./actions/index";

import createHistory from "history/createBrowserHistory";
// import { Route } from 'react-router';
import {
  routerReducer,
  routerMiddleware,
  ConnectedRouter
} from "react-router-redux";
// import { Link } from 'react-router-dom';
import App from "./App";

import * as actions from "./actions/index";
import * as middlewares from "./middlewares/index";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import muiTheme from "./styles/theme";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
// import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MomentUtils from "@date-io/moment"; // console.log(MomentUtils);
const history = createHistory();
const middleware = routerMiddleware(history);

const reducers = combineReducers<IStoreState>({
  ...enthusiasms,
  routing: routerReducer
});

interface IWindowReduxDevTool extends Window {
  __REDUX_DEVTOOLS_EXTENSION__(): DeepPartial<any>;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare var window: IWindowReduxDevTool;

const midws = Object.keys(middlewares).map(key => middlewares[key]);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<IStoreState, IApplicationInit, any, any>(
  reducers,
  composeEnhancers(applyMiddleware(middleware, ...midws))
);

store.dispatch(actions.applicationInit());

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={muiTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <App />
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
