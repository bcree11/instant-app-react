import { combineReducers } from "redux";
import map from "./reducers/map";
import mobile from "./slices/mobileSlice";
import popup from "./slices/popupSlice";
import portal from "./slices/portalSlice";
import sections from "./slices/sectionsSlice";
import splash from "./slices/splashSlice";
import telemetry from "./slices/telemetrySlice";
import theme from "./slices/themeSlice";
import widget from "./slices/widgetSlice";

export const rootReducer = combineReducers({
  map,
  mobile,
  popup,
  portal,
  sections,
  splash,
  telemetry,
  theme,
  widget
});

export type RootState = ReturnType<typeof rootReducer>;