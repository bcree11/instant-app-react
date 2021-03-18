import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { applySharedTheme } from "../../config/application.json";
import { ThemeState } from "../../types/interfaces";
import { theme } from "../../config/application.json";
import { RootState } from "../index";

const DEFAULT_STATE: ThemeState = {
  theme: theme as "dark" | "light",
  applySharedTheme
};

export const themeSlice = createSlice({
  name: "theme",
  initialState: DEFAULT_STATE,
  reducers: {
    updateTheme: (state, { payload }: PayloadAction<"dark" | "light">) => {
      const jsapiStyles = document.getElementById("jsapiStyles") as HTMLLinkElement;
      if (payload === "light") {
        jsapiStyles.href = `${process.env.PUBLIC_URL}/assets/esri/themes/${payload}/main.css`;
      } else if (payload === "dark") {
        jsapiStyles.href = `${process.env.PUBLIC_URL}/assets/esri/themes/${payload}/main.css`;
      }
      state.theme = payload;
    },
    toggleApplySharedTheme: (state) => {
      state.applySharedTheme = !state.applySharedTheme;
    }
  }
});

export const { toggleApplySharedTheme, updateTheme } = themeSlice.actions;
export const themeSelector = (state: RootState) => state.theme;
export default themeSlice.reducer;
