// Theme

export type Theme = "dark" | "light";

export interface ThemeState {
  theme: Theme;
  applySharedTheme: boolean;
}

export interface SharedTheme {
  button:  { background: string; text: string },
  header:  { background: string; text: string };
  logo: { small: string; link: string }
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

// Telemetry

export interface TelemetryState {
  googleAnalytics: boolean;
  googleAnalyticsConsent: boolean;
  googleAnalyticsConsentMsg: string;
  googleAnalyticsKey: string;
  telemetry: TelemetryConfig;
}

interface TelemetryConfig {
  name: string;
  version: string;
  prod: TelemetryObj;
  dev: TelemetryObj;
  qa: TelemetryObj;
}

interface TelemetryObj {
  amazon: {
    userPoolID: string;
    app: {
      id: string;
    };
  };
}

// Config

interface ExtentSelector {
  constraints: __esri.MapViewConstraints;
  mapRotation: number;
}

export interface ConfigState {
  applySharedTheme: boolean;
  extentSelector: boolean;
  extentSelectorConfig: ExtentSelector;
  header: boolean;
  home: boolean;
  homePosition: WidgetPosition;
  mapZoom: boolean;
  mapZoomPosition: WidgetPosition;
  googleAnalytics: boolean;
  googleAnalyticsConsent: boolean;
  googleAnalyticsConsentMsg: string;
  googleAnalyticsKey: string;
  telemetry: TelemetryConfig;
  title: string;
  titleLink: string;
  webmap: string;
  mapA11yDesc: string;
  theme: Theme;
  splash: boolean;
  splashTitle: string;
  splashContent: string;
  splashButtonText: string;
  splashOnStart: boolean;
}
