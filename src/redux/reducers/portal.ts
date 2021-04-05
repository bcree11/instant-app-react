import { RootState } from "../index";

const DEFAULT_STATE: __esri.Portal = null;

export default function portal(state = DEFAULT_STATE): __esri.Portal {
  return state;
}

export const portalSelector = (state: RootState) => state.portal;