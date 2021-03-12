import { combineReducers } from "redux";
import header from "./slices/headerSlice";
import base from "./reducers/base";
import splash from "./slices/splashSlice";
import theme from "./slices/themeSlice";
// import itemCollectionReducer from "./itemCollection";
// import widgetReducer from "./widget";
// import widgetPositionReducer from "./widgetPosition";
// import navigationReducer from "./navigation";
// import autoPlayReducer from "./autoPlay";
// import descriptionReducer from "./descriptionReducer";
// import locationReducer from "./location";
// import portalReducer from "./portal";

export const rootReducer = combineReducers({
  header,
  base,
  splash,
  theme,
  // themeReducer,
  // itemCollectionReducer,
  // widgetReducer,
  // widgetPositionReducer,
  // navigationReducer,
  // autoPlayReducer,
  // descriptionReducer,
  // locationReducer,
  // portalReducer
});

export type RootState = ReturnType<typeof rootReducer>;