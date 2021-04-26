import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { header, title } from "../../config/application.json";
import {
  HeaderState
} from "../../types/interfaces";
import { RootState } from "../index";

const DEFAULT_STATE: HeaderState = {
  header,
  title
};

const headerSlice = createSlice({
  name: "header",
  initialState: DEFAULT_STATE,
  reducers: {
    toggleHeader: (state, { payload }: PayloadAction<boolean>) => {
      state.header = payload;
    },
    setTitle: (state, { payload }: PayloadAction<string>) => {
      state.title = payload;
    }
  }
});

export const {
  toggleHeader,
  setTitle
} = headerSlice.actions;
export const headerSelector = (state: RootState) => state.header;
export default headerSlice.reducer;