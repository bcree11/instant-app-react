import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { home, homePosition, legend, legendPosition } from "../../config/application.json";
import { WidgetPosition, WidgetState } from "../../types/interfaces";

const DEFAULT_STATE: WidgetState = {
  home: {
    addToMap: home,
    ui: homePosition as WidgetPosition
  },
  legend: {
    addToMap: legend,
    ui: legendPosition as WidgetPosition
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
    toggleLegendWidget: (state) => {
      state.legend.addToMap = !state.legend.addToMap;
    },
    updateLegendWidgetPosition: (state, { payload }: PayloadAction<WidgetPosition>) => {
      state.legend.ui = payload;
    }
  }
});

export const { toggleHomeWidget, toggleLegendWidget } = widgetSlice.actions;
export const widgetSelector = (state: RootState) => state.widget;
export default widgetSlice.reducer;
