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

export const headerSlice = createSlice({
  name: "header",
  initialState: DEFAULT_STATE,
  reducers: {
    toggleHeader: (state) => {
      return {
        ...state,
        header: !state.header
      };
    },
    setTitle: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        title: action.payload
      };
    }
  }
});

export const {
  toggleHeader,
  setTitle
} = headerSlice.actions;
export const headerSelector = (state: RootState) => state.header;
export default headerSlice.reducer;