import { RootState } from "../index";

const DEFAULT_STATE: __esri.WebMap = null;

export default function map(state = DEFAULT_STATE): __esri.WebMap {
  return state;
}

export const mapSelector = (state: RootState) => state.map;