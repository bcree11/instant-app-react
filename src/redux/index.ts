import { combineReducers } from "redux";
import base from "./reducers/base";
import portal from "./reducers/portal";
import header from "./slices/headerSlice";
import splash from "./slices/splashSlice";
import theme from "./slices/themeSlice";
import widget from "./slices/widgetSlice";

export const rootReducer = combineReducers({
  header,
  base,
  splash,
  theme,
  widget,
  portal
});

export type RootState = ReturnType<typeof rootReducer>;