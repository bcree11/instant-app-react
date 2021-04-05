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
  mapZoom: Widget;
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