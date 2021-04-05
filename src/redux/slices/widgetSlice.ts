import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { home, homePosition, mapZoom, mapZoomPosition } from "../../config/application.json";
import { WidgetPosition, WidgetState } from "../../types/interfaces";

const DEFAULT_STATE: WidgetState = {
  home: {
    addToMap: home,
    ui: homePosition as WidgetPosition
  },
  mapZoom: {
    addToMap: mapZoom,
    ui: mapZoomPosition as WidgetPosition
  }
};

const widgetSlice = createSlice({
  name: "widget",
  initialState: DEFAULT_STATE,
  reducers: {
    toggleHomeWidget: (state) => {
      state.home.addToMap = !state.home.addToMap;
    },
    updateHomeWidgetPosition: (state, { payload }: PayloadAction<WidgetPosition>) => {
      state.home.ui = payload;
    },
    toggleMapZoomWidget: (state) => {
      state.mapZoom.addToMap = !state.mapZoom.addToMap;
    },
    updateMapZoomWidgetPosition: (state, { payload }: PayloadAction<WidgetPosition>) => {
      state.mapZoom.ui = payload;
    }
  }
});

export const { toggleHomeWidget, toggleMapZoomWidget } = widgetSlice.actions;
export const widgetSelector = (state: RootState) => state.widget;
export default widgetSlice.reducer;
