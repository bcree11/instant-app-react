import { SET_TITLE, SPLASH_ON_START, TOGGLE_HEADER } from "../../types/interfaces";
import types from "./types";

// CONFIGURATION SETTINGS
export function updateStore(prop, val) {
  return {
    type: types[prop],
    payload: val
  };
}

// HEADER
export function toggleHeader(headerEnabled: boolean) {
  return {
    type: TOGGLE_HEADER,
    payload: headerEnabled
  };
}

export function updateTitle(titleVal: string) {
  return {
    type: SET_TITLE,
    payload: titleVal
  };
}

// STAGE
export function updateStage(item) {
  const { stage } = types;
  return {
    type: stage,
    payload: item
  };
}

// NAVIGATION
export function toggleNavBar(open) {
  const { navigationBarOpenAtStart } = types;
  return {
    type: navigationBarOpenAtStart,
    payload: open
  };
}

export function toggleNavBarDesc(open) {
  const { toggleNavDescription } = types;
  return {
    type: toggleNavDescription,
    payload: open
  };
}

export function updateMinimizedSectionDisplay(displayType: string) {
  const { minimizedSectionDisplay } = types;
  return {
    type: minimizedSectionDisplay,
    payload: displayType
  };
}

// SPLASH
export function openInfoPanel(open: boolean) {
  return {
    type: SPLASH_ON_START,
    payload: open
  };
}

// DESCRIPTION
export function openDescription() {
  const { description } = types;
  return {
    type: description,
    payload: true
  };
}

export function closeDescription() {
  return {
    type: types.description,
    payload: false
  };
}

export function updateLocationPanel(open: boolean) {
  return {
    type: types.updateLocationPanel,
    payload: open
  };
}

export function toggleLocation(enabled: boolean) {
  return {
    type: types.portfolioLocation,
    payload: enabled
  };
}

// AUTO PLAY
export function play(isPlaying: boolean) {
  return {
    type: types.playing,
    payload: isPlaying
  };
}

export function updateMapLocationExtent(extent: __esri.Extent) {
  return {
    type: types.mapLocationExtent,
    payload: extent
  };
}

export function toggleApplySharedTheme(applySharedTheme: boolean) {
  return {
    type: types.applySharedTheme,
    payload: applySharedTheme
  };
}
