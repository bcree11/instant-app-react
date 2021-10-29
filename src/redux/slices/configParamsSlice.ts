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
  legendOpenAtStart,
  legendPosition,
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
  splashOnStart,
  coverPage,
  coverPageConfig,
  controlPanelPosition,
  autoPlay,
  autoPlayDuration,
  share,
  exportToPDF,
  measure
} from "../../config/application.json";

const DEFAULT_STATE: ConfigState = {
  applySharedTheme,
  extentSelector,
  extentSelectorConfig: extentSelectorConfig as any,
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  header,
  home,
  legendOpenAtStart,
  legendPosition: legendPosition as WidgetPosition,
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
  splashOnStart,
  coverPage,
  coverPageIsVisible: coverPage,
  coverPageConfig,
  controlPanelPosition: controlPanelPosition as WidgetPosition,
  autoPlay,
  autoPlayDuration,
  share,
  exportToPDF,
  measure
};

const configParamsSlice = createSlice({
  name: "configParams",
  initialState: DEFAULT_STATE,
  reducers: {
    updateConfigParam: (state, { payload }: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = payload;
      state[key] = value;
      if (key === "theme") {
        updateJSAPIStyles(value);
      } else if (key === "title") {
        setPageTitle(value);
      }
    },
    updateCoverPageIsVisible: (state, { payload }: PayloadAction<boolean>) => {
      state.coverPageIsVisible = payload;
    }
  }
});

export const { updateConfigParam, updateCoverPageIsVisible } = configParamsSlice.actions;
export const configParamsSelector = (state: RootState) => state.config;
export default configParamsSlice.reducer;
