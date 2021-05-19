import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  home,
  homePosition,
  legend,
  legendPosition,
  mapZoom,
  mapZoomPosition,
  telemetry,
  title
} from "../../config/application.json";
import { ConfigState, WidgetPosition } from "../../types/interfaces";

const DEFAULT_STATE: ConfigState = {
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  home,
  homePosition: homePosition as WidgetPosition,
  legend,
  legendPosition: legendPosition as WidgetPosition,
  mapZoom,
  mapZoomPosition: mapZoomPosition as WidgetPosition,
  telemetry,
  title
};

const configParamsSlice = createSlice({
  name: "configParams",
  initialState: DEFAULT_STATE,
  reducers: {
    updateConfigParam: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state[action.payload.key] = action.payload.value;
    }
  }
});

export const { updateConfigParam } = configParamsSlice.actions;
export const configParamsSelector = (state: RootState) => state.config;
export default configParamsSlice.reducer;
