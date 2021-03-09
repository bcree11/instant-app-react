export const UPDATE_ITEM_COLLECTION = "UPDATE_ITEM_COLLECTION";
export const TOGGLE_NAV_BAR = "TOGGLE_NAV_BAR";
export const NAV_BAR_OPEN_AT_START = "NAV_BAR_OPEN_AT_START";
export const TOGGLE_INFO = "TOGGLE_INFO";
export const SPLASH_ON_START = "SPLASH_ON_START";
export const UPDATE_SPLASH_TITLE = "UPDATE_SPLASH_TITLE";
export const UPDATE_SPLASH_CONTENT = "UPDATE_SPLASH_CONTENT";
export const UPDATE_SPLASH_BUTTON_TEXT = "UPDATE_SPLASH_BUTTON_TEXT";
export const UPDATE_THEME = "UPDATE_THEME";
export const TOGGLE_HOME = "TOGGLE_HOME";
export const TOGGLE_ZOOM = "TOGGLE_ZOOM";
export const UPDATE_BASEMAP = "UPDATE_BASEMAP";
export const TOGGLE_SEARCH = "TOGGLE_SEARCH";
export const TOGGLE_LAYER_LIST = "TOGGLE_LAYER_LIST";
export const TOGGLE_LEGEND = "TOGGLE_LEGEND";
export const TOGGLE_PRINT = "TOGGLE_PRINT";
export const TOGGLE_BASEMAP_TOGGLE = "TOGGLE_BASEMAP_TOGGLE";
export const TOGGLE_HEADER = "TOGGLE_HEADER";
export const SET_TITLE = "SET_TITLE";
export const UPDATE_HOME_POSITION = "UPDATE_HOME_POSITION";
export const UPDATE_PRINT_POSITION = "UPDATE_PRINT_POSITION";
export const UPDATE_ZOOM_POSITION = "UPDATE_ZOOM_POSITION";
export const UPDATE_LEGEND_POSITION = "UPDATE_LEGEND_POSITION";
export const UPDATE_SEARCH_POSITION = "UPDATE_SEARCH_POSITION";
export const UPDATE_LAYER_LIST_POSITION = "UPDATE_LAYER_LIST_POSITION";
export const UPDATE_BASEMAP_TOGGLE_POSITION = "UPDATE_BASEMAP_TOGGLE_POSITION";
export const AUTO_PLAY_ENABLED = "AUTO_PLAY_ENABLED";
export const PLAY = "PLAY";
export const UPDATE_AUTO_PLAY_DURATION = "UPDATE_AUTO_PLAY_DURATION";
export const TOGGLE_PRELOAD = "TOGGLE_PRELOAD";
export const UPDATE_STAGE = "UPDATE_STAGE";
export const TOGGLE_NAV_DESCRIPTION = "TOGGLE_NAV_DESCRIPTION";
export const TOGGLE_DESCRIPTION = "TOGGLE_DESCRIPTION";
export const UPDATE_MINIMIZED_SECTION_DISPLAY = "UPDATE_MINIMIZED_SECTION_DISPLAY";
export const STORE_PORTAL = "STORE_PORTAL";
export const UPDATE_MAP_LOCATION_EXTENT = "UPDATE_MAP_LOCATION_EXTENT";
export const UPDATE_LOCATION_PANEL = "UPDATE_LOCATION_PANEL";
export const UPDATE_SHARE_THEME = "UPDATE_SHARE_THEME"

export interface Description_t9n {
  toggleDescription: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  visible: boolean;
}

// Header

export interface HeaderState {
  header: boolean;
  title: string;
}

export interface ToggleHeaderAction {
  type: typeof TOGGLE_HEADER;
  payload: boolean;
}

export interface UpdateTitleAction {
  type: typeof SET_TITLE;
  payload: string;
}

export type HeaderActionTypes = ToggleHeaderAction | UpdateTitleAction;

export interface IThemeReducer {
  theme: "light" | "dark";
  applySharedTheme: boolean;
}

export interface IItemCollectionReducer {
  itemCollection: Item[];
  currentItem: Item;
  preload: boolean;
}

export interface IWidgetReducer {
  home: boolean;
  mapZoom: boolean;
  search: boolean;
  layerList: boolean;
  legend: boolean;
  print: boolean;
  basemapToggle: boolean;
}

// export interface IWidgetPositionReducer {
//   homePosition: typeof homePosition;
//   mapZoomPosition: typeof mapZoomPosition;
//   searchPosition: typeof searchPosition;
//   layerListPosition: typeof layerListPosition;
//   legendPosition: typeof legendPosition;
//   printPosition: typeof printPosition;
//   basemapTogglePosition: typeof basemapTogglePosition;
// }

export interface INavigationReducer {
  navigationBarOpenAtStart: boolean;
  minimizedSectionDisplay: "itemThumbnail" | "itemTitle";
}

export interface IAutoPlayReducer {
  autoPlay: boolean;
  autoPlayDuration: number;
  playing: boolean;
}

export interface ILocationReducer {
  portfolioLocation: boolean;
  locationPanelIsOpen: boolean;
}

export interface IPortalReducer {
  portal: __esri.Portal;
}

export interface INavigationReducer {
  navigationBarOpenAtStart: boolean;
  navDescriptionIsOpen: boolean;
}

export interface ISplashReducer {
  splash: boolean;
  splashOnStart: boolean;
  splashTitle: string;
  splashContent: string;
  splashButtonText: string;
}

export interface IDescriptionReducer {
  description: boolean;
}

export type MinimizedSectionDisplay = "itemThumbnail" | "itemTitle";
