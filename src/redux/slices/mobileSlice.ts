import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface MobileState {
  showMobileMode: boolean;
}

const DEFAULT_STATE: MobileState = {
  showMobileMode: false,
};

const mobileSlice = createSlice({
  name: "mobile",
  initialState: DEFAULT_STATE,
  reducers: {
    toggleShowMobileMode: (state, { payload }: PayloadAction<number>) => {
      state.showMobileMode = payload < 830;
    }
  }
});

export const { toggleShowMobileMode } = mobileSlice.actions;
export const mobileSelector = (state: RootState) => state.mobile;
export default mobileSlice.reducer;
