import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface MobileState {
  showMap?: boolean;
  showMobileMode?: boolean;
  showSection?: boolean;
}
const DEFAULT_STATE: MobileState = {
  showMap: true,
  showMobileMode: false,
  showSection: true
};

const mobileSlice = createSlice({
  name: "mobile",
  initialState: DEFAULT_STATE,
  reducers: {
    toggleShowMap: (state) => {
      state.showMap = !state.showSection ? true : !state.showMap;
    },
    toggleShowMobileMode: (state, { payload }: PayloadAction<number>) => {
      state.showMobileMode = payload < 830;
    },
    toggleShowSection: (state) => {
      state.showSection = !state.showMap ? true : !state.showSection;
    }
  }
});

export const { toggleShowMap, toggleShowMobileMode, toggleShowSection } = mobileSlice.actions;
export const mobileSelector = (state: RootState) => state.mobile;
export default mobileSlice.reducer;
