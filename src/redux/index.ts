import { combineReducers } from "redux";
import base from "./reducers/base";
import header from "./slices/headerSlice";
import portal from "./reducers/portal";
import splash from "./slices/splashSlice";
import telemetry from "./slices/telemetrySlice";
import theme from "./slices/themeSlice";
import widget from "./slices/widgetSlice";

export const rootReducer = combineReducers({
  base,
  header,
  portal,
  splash,
  telemetry,
  theme,
  widget
});

export type RootState = ReturnType<typeof rootReducer>;