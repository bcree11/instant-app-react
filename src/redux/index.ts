import { combineReducers } from "redux";
import map from "./reducers/map";
import config from "./slices/configParamsSlice";
import portal from "./slices/portalSlice";
import mobile from "./slices/mobileSlice";

export const rootReducer = combineReducers({
  config,
  map,
  mobile,
  portal
});

export type RootState = ReturnType<typeof rootReducer>;