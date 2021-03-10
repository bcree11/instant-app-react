import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import headerReducer from "./header";
import baseReducer from "./base";
import splashReducer from "./splash";
// import themeReducer from "./theme";
// import itemCollectionReducer from "./itemCollection";
// import widgetReducer from "./widget";
// import widgetPositionReducer from "./widgetPosition";
// import navigationReducer from "./navigation";
// import autoPlayReducer from "./autoPlay";
// import descriptionReducer from "./descriptionReducer";
// import locationReducer from "./location";
// import portalReducer from "./portal";

export const rootReducer = combineReducers({
  header: headerReducer,
  base: baseReducer,
  splash: splashReducer,
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
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
