import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { ConfigState, Theme, WidgetPosition } from "../../types/interfaces";
import { updateJSAPIStyles } from "../../utils/utils";
import { setPageTitle } from "../../ApplicationBase/support/domHelper";
import {
  applySharedTheme,
  extentSelector,
  extentSelectorConfig,
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  header,
  home,
  homePosition,
  mapZoom,
  mapZoomPosition,
  telemetry,
  title,
  titleLink,
  webmap,
  mapA11yDesc,
  theme,
  splash,
  splashTitle,
  splashContent,
  splashButtonText,
  splashOnStart
} from "../../config/application.json";

const DEFAULT_STATE: ConfigState = {
  applySharedTheme,
  extentSelector,
  extentSelectorConfig,
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  header,
  home,
  homePosition: homePosition as WidgetPosition,
  mapZoom,
  mapZoomPosition: mapZoomPosition as WidgetPosition,
  telemetry,
  title,
  titleLink,
  webmap,
  mapA11yDesc,
  theme: theme as Theme,
  splash,
  splashTitle,
  splashContent,
  splashButtonText,
  splashOnStart
};

const configParamsSlice = createSlice({
  name: "configParams",
  initialState: DEFAULT_STATE,
  reducers: {
    updateConfigParam: (state, { payload }: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = payload;
      state[key] = value;
      if(key === "theme") {
        updateJSAPIStyles(value)
      } else if (key === "title") {
        setPageTitle(value);
      }
    }
  }
});

export const { updateConfigParam } = configParamsSlice.actions;
export const configParamsSelector = (state: RootState) => state.config;
export default configParamsSlice.reducer;
