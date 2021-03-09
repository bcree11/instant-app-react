import { header, title } from "../../config/application.json";
import {
  HeaderActionTypes,
  HeaderState,
  SET_TITLE,
  TOGGLE_HEADER,
} from "../../types/interfaces";

const DEFAULT_STATE: HeaderState = {
  header,
  title
};

export default function (state = DEFAULT_STATE, action: HeaderActionTypes) {
  switch (action.type) {
    case TOGGLE_HEADER:
      return {
        ...state,
        header: action.payload
      };
    case SET_TITLE:
      return {
        ...state,
        title: action.payload
      };
    default:
      return state;
  }
}
