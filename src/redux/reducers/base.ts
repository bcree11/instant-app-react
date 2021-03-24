import ApplicationBase from "@esri/application-base-js/ApplicationBase";
import { RootState } from "../index";

const DEFAULT_STATE: ApplicationBase = null;

export default function (state = DEFAULT_STATE): ApplicationBase {
  return state;
}

export const baseSelector = (state: RootState) => state.base;