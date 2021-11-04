import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExhibitState } from "../../types/interfaces";
import { RootState } from "../index";

const DEFAULT_STATE: ExhibitState = {
  currentSlide: null,
  currentSlideIndex: 0,
  slides: [],
  transition: null,
  openInfo: false,
  autoPlaying: false
};

const exhibitSlice = createSlice({
  name: "exhibit",
  initialState: DEFAULT_STATE,
  reducers: {
    decreaseCurrentSlideIndex: (state) => {
      if (state.currentSlideIndex > 0) {
        state.currentSlideIndex--;
        state.currentSlide = state.slides[state.currentSlideIndex];
      }
    },
    increaseCurrentSlideIndex: (state) => {
      if(state.currentSlideIndex === state.slides.length - 1) {
        state.currentSlideIndex = 0;
        state.currentSlide = state.slides[0];
      } else if (state.currentSlideIndex < state.slides.length - 1) {
        state.currentSlideIndex++;
        state.currentSlide = state.slides[state.currentSlideIndex];
      }
    },
    updateExhibit: (state, { payload }: PayloadAction<ExhibitState>) => {
      state.currentSlide = payload.slides?.[state.currentSlideIndex];
      state.transition = payload.transition;
      state = payload;
    },
    updateAutoPlaying: (state, { payload }: PayloadAction<boolean>) => {
      state.autoPlaying = payload;
    },
    updateOpenInfo: (state, { payload }: PayloadAction<boolean>) => {
      state.openInfo = payload;
    }
  }
});

export const {
  decreaseCurrentSlideIndex,
  increaseCurrentSlideIndex,
  updateAutoPlaying,
  updateExhibit,
  updateOpenInfo
} = exhibitSlice.actions;
export const exhibitSelector = (state: RootState) => state.exhibit;
export default exhibitSlice.reducer;
