import { combineReducers } from "redux";
import headerReducer from "./header";
import baseReducer from "./base";
import { TypedUseSelectorHook, useSelector } from "react-redux";
// import themeReducer from "./theme";
// import itemCollectionReducer from "./itemCollection";
// import widgetReducer from "./widget";
// import widgetPositionReducer from "./widgetPosition";
// import navigationReducer from "./navigation";
// import autoPlayReducer from "./autoPlay";
// import splashReducer from "./splash";
// import descriptionReducer from "./descriptionReducer";
// import locationReducer from "./location";
// import portalReducer from "./portal";

export const rootReducer = combineReducers({
  header: headerReducer,
  base: baseReducer
  // themeReducer,
  // itemCollectionReducer,
  // widgetReducer,
  // widgetPositionReducer,
  // navigationReducer,
  // autoPlayReducer,
  // splashReducer,
  // descriptionReducer,
  // locationReducer,
  // portalReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
