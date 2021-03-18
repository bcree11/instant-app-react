import { RootState } from "../index";

const DEFAULT_STATE: __esri.Portal = null;

export default function (state = DEFAULT_STATE): __esri.Portal {
  return state;
}

export const portalSelector = (state: RootState) => state.portal;