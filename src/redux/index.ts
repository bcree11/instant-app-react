import { combineReducers } from "redux";
import map from "./reducers/map";
import popup from "./slices/popupSlice";
import portal from "./reducers/portal";
import sections from "./slices/sectionsSlice";
import splash from "./slices/splashSlice";
import telemetry from "./slices/telemetrySlice";
import theme from "./slices/themeSlice";
import widget from "./slices/widgetSlice";

export const rootReducer = combineReducers({
  map,
  popup,
  portal,
  sections,
  splash,
  telemetry,
  theme,
  widget
});

export type RootState = ReturnType<typeof rootReducer>;