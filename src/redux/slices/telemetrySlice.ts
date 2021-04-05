import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TelemetryState } from "../../types/interfaces";
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
    updateGAConsent: (state, { payload }: PayloadAction<boolean>) => {
      state.googleAnalyticsConsent = payload;
    }
  }
});

export const { updateGAConsent } = telemetrySlice.actions;
export const telemetrySelector = (state: RootState) => state.telemetry;
export default telemetrySlice.reducer;
