import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExhibitState } from "../../types/interfaces";
import { RootState } from "../index";

const DEFAULT_STATE: ExhibitState = {
  prevSlide: null,
  currentSlide: null,
  nextSlide: null,
  currentSlideIndex: 0,
  slides: [],
  transition: null,
  openInfo: false
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
        state.prevSlide = null;
        state.currentSlide = state.slides[0];
        state.nextSlide = state.slides?.[1] ?? null;
      } else if (state.currentSlideIndex < state.slides.length - 1) {
        state.currentSlideIndex++;
        state.currentSlide = state.slides[state.currentSlideIndex];
      }
    },
    updateExhibit: (state, { payload }: PayloadAction<ExhibitState>) => {
      state.prevSlide = payload.slides?.[state.currentSlideIndex] ?? null;
      state.currentSlide = payload.slides?.[state.currentSlideIndex];
      state.nextSlide = payload.slides?.[state.currentSlideIndex + 1] ?? null;
      state.transition = payload.transition;
      state = payload;
    },
    updateOpenInfo: (state, { payload }: PayloadAction<boolean>) => {
      state.openInfo = payload;
    }
  }
});

export const {
  decreaseCurrentSlideIndex,
  increaseCurrentSlideIndex,
  updateExhibit,
  updateOpenInfo
} = exhibitSlice.actions;
export const exhibitSelector = (state: RootState) => state.exhibit;
export default exhibitSlice.reducer;
