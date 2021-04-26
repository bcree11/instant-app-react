import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TelemetryConfig, TelemetryState } from "../../types/interfaces";
import {
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  telemetry
} from "../../config/application.json";
import { RootState } from "../index";

const DEFAULT_STATE: TelemetryState = {
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  telemetry
};

const telemetrySlice = createSlice({
  name: "telemetry",
  initialState: DEFAULT_STATE,
  reducers: {
    updateGA: (state, { payload }: PayloadAction<boolean>) => {
      state.googleAnalytics = payload;
    },
    updateGAConsent: (state, { payload }: PayloadAction<boolean>) => {
      state.googleAnalyticsConsent = payload;
    },
    updateGAConsentMsg: (state, { payload }: PayloadAction<string>) => {
      state.googleAnalyticsConsentMsg = payload;
    },
    updateGAKey: (state, { payload }: PayloadAction<string>) => {
      state.googleAnalyticsKey = payload;
    },
    updateTelemetry: (state, { payload }: PayloadAction<TelemetryConfig>) => {
      state.telemetry = payload;
    }
  }
});

export const { updateGA, updateGAConsent, updateGAConsentMsg, updateGAKey, updateTelemetry } = telemetrySlice.actions;
export const telemetrySelector = (state: RootState) => state.telemetry;
export default telemetrySlice.reducer;
