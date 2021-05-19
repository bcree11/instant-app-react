import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sections } from "../../config/application.json";
import { IGraphic, SectionState } from "../../types/interfaces";
import { RootState } from "../index";

interface SectionSliceState {
  currentSection: SectionState;
  filteredGraphics: IGraphic[];
  sections: SectionState[];
}

const DEFAULT_STATE: SectionSliceState = {
  currentSection: null,
  filteredGraphics: [],
  sections: sections as SectionState[]
};

const sectionsSlice = createSlice({
  name: "sections",
  initialState: DEFAULT_STATE,
  reducers: {
    activeToggle: (state, { payload }: PayloadAction<number>) => {
      state.sections.forEach((section, index) => {
        if (index === payload) {
          section.active = true;
        } else {
          section.active = false;
        }
      });
    },
    updateCurrentSection: (state, { payload }: PayloadAction<number>) => {
      state.currentSection = state.sections.find(({ position }) => position === payload);
      if (
        state.currentSection.type === "leaderboard" &&
        state.currentSection.graphics &&
        state.currentSection.graphics.length
      ) {
        state.filteredGraphics = state.currentSection.graphics;
      } else {
        state.filteredGraphics = [];
      }
    },
    updateGraphics: (state, { payload }: PayloadAction<{ graphics: IGraphic[]; index: number }>) => {
      state.sections[payload.index].graphics = payload.graphics;
    },
    updateFilters: (state, { payload }: PayloadAction<{ filters: string[]; index: number }>) => {
      if (payload.filters && payload.filters.length) {
        state.sections[payload.index].filterFields = payload.filters;
      }
    },
    updateFilteredGraphics: (state, { payload }: PayloadAction<IGraphic[]>) => {
      state.filteredGraphics = payload;
    }
  }
});

export const {
  activeToggle,
  updateCurrentSection,
  updateFilteredGraphics,
  updateFilters,
  updateGraphics
} = sectionsSlice.actions;
export const sectionsSelector = (state: RootState) => state.sections;
export default sectionsSlice.reducer;
