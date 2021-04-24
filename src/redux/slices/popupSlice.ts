import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PopupState } from "../../types/interfaces";
import { RootState } from "../index";

const DEFAULT_STATE: PopupState = {
  content: null,
  feature: null,
  featureIndex: null
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
    updatePopupFeature: (state, { payload }: PayloadAction<__esri.Graphic>) => {
      state.feature = payload;
    },
  }
});

export const { updateFeatureIndex, updatePopupContent, updatePopupFeature } = popupSlice.actions;
export const popupSelector = (state: RootState) => state.popup;
export default popupSlice.reducer;
