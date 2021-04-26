import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

const DEFAULT_STATE: __esri.Portal = null;

const portalSlice = createSlice({
  name: "portal",
  initialState: DEFAULT_STATE,
  reducers: {
    updatePortal: (state, { payload }: PayloadAction<__esri.Portal>) => {
      state = payload;
    }
  }
});

export const { updatePortal } = portalSlice.actions;
export const portalSelector = (state: RootState) => state.portal;
export default portalSlice.reducer;
