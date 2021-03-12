import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SplashState } from "../../types/interfaces";
import { splash, splashButtonText, splashContent, splashOnStart, splashTitle } from "../../config/application.json";
import { RootState } from "../index";

const DEFAULT_STATE: SplashState = {
  splash,
  splashButtonText,
  splashContent,
  splashOnStart,
  splashTitle
};

export const splashSlice = createSlice({
  name: "splash",
  initialState: DEFAULT_STATE,
  reducers: {
    toggleInfo: (state) => {
      state.splash = !state.splash;
    },
    toggleOffSplash: (state) => {
      state.splashOnStart = false;
    },
    updateSplashTitle: (state, { payload }: PayloadAction<string>) => {
      state.splashTitle = payload;
    },
    updateSplashContent: (state, { payload }: PayloadAction<string>) => {
      state.splashContent = payload;
    },
    updateSplashButtonText: (state, { payload }: PayloadAction<string>) => {
      state.splashButtonText = payload;
    }
  }
});

export const {
  toggleInfo,
  toggleOffSplash,
  updateSplashButtonText,
  updateSplashContent,
  updateSplashTitle
} = splashSlice.actions;
export const splashSelector = (state: RootState) => state.splash;
export default splashSlice.reducer;
