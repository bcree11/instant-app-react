import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sections } from "../../config/application.json";
import { SectionState } from "../../types/interfaces";
import { RootState } from "../index";

interface SectionSliceState {
  currentSection: SectionState;
  sections: SectionState[];
}

const DEFAULT_STATE: SectionSliceState = {
  currentSection: null,
  sections: sections as SectionState[]
};

interface featuresPayload {
  features: __esri.Graphic[];
  index: number;
}

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
    },
    updateFeatures: (state, { payload }: PayloadAction<featuresPayload>) => {
      state.sections[payload.index].features = payload.features;
    }
  }
});

export const { activeToggle, updateCurrentSection, updateFeatures } = sectionsSlice.actions;
export const sectionsSelector = (state: RootState) => state.sections;
export default sectionsSlice.reducer;
