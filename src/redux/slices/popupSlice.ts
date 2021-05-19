import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompareGraphic, PopupState } from "../../types/interfaces";
import { RootState } from "../index";

const DEFAULT_STATE: PopupState = {
  activeComparePanels: 0,
  content: null,
  compareGraphics: [],
  featureIndex: null,
};

const popupSlice = createSlice({
  name: "popup",
  initialState: DEFAULT_STATE,
  reducers: {
    updateFeatureIndex: (state, { payload }: PayloadAction<number>) => {
      state.featureIndex = payload;
    },
    updatePopupContent: (state, { payload }: PayloadAction<string>) => {
      state.content = payload;
    },
    addCompareGraphic: (state, { payload }: PayloadAction<CompareGraphic>) => {
      const i = state.compareGraphics.findIndex(({ title }) => title === payload.title);
      let checkActive = 0;
      state.compareGraphics.forEach((compare) => {
        if (compare.active) {
          checkActive++;
        }
      });
      if (checkActive < 2) {
        if (i > -1) {
          state.compareGraphics[i].active = true;
          const item = state.compareGraphics[i];
          state.compareGraphics.splice(i, 1);
          state.compareGraphics.push(item);
        } else {
          state.compareGraphics.push({
            active: payload.active,
            graphic: payload.graphic,
            title: payload.title
          });
        }
      }
      state.activeComparePanels = checkActive + 1;
    },
    toggleCompareGraphicActive: (state, { payload }: PayloadAction<string>) => {
      const i = state.compareGraphics.findIndex(({ title }) => title === payload);
      state.compareGraphics[i].active = !state.compareGraphics[i].active;
      state.activeComparePanels = !state.compareGraphics[i].active
        ? state.activeComparePanels - 1
        : state.activeComparePanels;
    }
  }
});

export const {
  updateFeatureIndex,
  updatePopupContent,
  addCompareGraphic,
  toggleCompareGraphicActive
} = popupSlice.actions;
export const popupSelector = (state: RootState) => state.popup;
export default popupSlice.reducer;
