// Header

export interface HeaderState {
  header: boolean;
  title: string;
}

// Theme

export type Theme = "dark" | "light";

export interface ThemeState {
  theme: Theme;
  applySharedTheme: boolean;
}

// Splash

export interface SplashState {
  splash: boolean;
  splashOnStart: boolean;
  splashTitle: string;
  splashContent: string;
  splashButtonText: string;
}

// Widget

type Position =
  | "bottom-leading"
  | "bottom-left"
  | "bottom-right"
  | "bottom-trailing"
  | "top-leading"
  | "top-left"
  | "top-right"
  | "top-trailing"
  | "manual";

interface WidgetPosition {
  position: Position;
  index: number;
}

interface Widget {
  addToMap: boolean;
  ui: WidgetPosition;
}

export interface WidgetState {
  home: Widget;
  legend: Widget;
}

export interface IPortalReducer {
  portal: __esri.Portal;
}

export interface IDescriptionReducer {
  description: boolean;
}
