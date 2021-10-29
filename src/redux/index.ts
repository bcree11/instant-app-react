import { combineReducers } from "redux";
import map from "./reducers/map";
import config from "./slices/configParamsSlice";
import exhibit from "./slices/exhibitSlice";
import mobile from "./slices/mobileSlice";
import portal from "./slices/portalSlice";

export const rootReducer = combineReducers({
  config,
  exhibit,
  map,
  mobile,
  portal
});

export type RootState = ReturnType<typeof rootReducer>;