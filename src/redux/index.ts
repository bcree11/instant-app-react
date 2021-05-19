import { combineReducers } from "redux";
import map from "./reducers/map";
import config from "./slices/configParamsSlice";
import mobile from "./slices/mobileSlice";
import popup from "./slices/popupSlice";
import portal from "./slices/portalSlice";
import sections from "./slices/sectionsSlice";
import theme from "./slices/themeSlice";

export const rootReducer = combineReducers({
  config,
  map,
  mobile,
  popup,
  portal,
  sections,
  theme
});

export type RootState = ReturnType<typeof rootReducer>;