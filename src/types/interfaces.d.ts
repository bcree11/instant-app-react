// Theme

export type Theme = "dark" | "light";

export interface ThemeState {
  theme: Theme;
  applySharedTheme: boolean;
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

// Popup

export interface PopupState {
  activeComparePanels: number;
  content: string;
  compareGraphics: CompareGraphic[];
  featureIndex: number;
}

export interface CompareGraphic {
  active: boolean;
  graphic: IGraphic;
  title: string;
}

// Panel

type Pane = "intro" | "countdown" | "leaderboard" | "summary";

// Sections

export interface SectionState {
  type: Pane;
  enabled: boolean;
  title: string;
  content?: string;
  buttonText?: string;
  navTitle: string;
  icon: string;
  position: number;
  featuresDisplayed?: number;
  pagingLabel?: string;
  layerId?: string;
  field?: string;
  filterField?: string;
  filterFields?: string[];
  searchFields?: string[];
  searchDisplayField?: string;
  order?: "DESC" | "ASC";
  zoomScale?: number;
  enable?: boolean;
  active?: boolean;
  graphics?: IGraphic[];
}

interface IGraphic extends __esri.Graphic {
  active?: boolean;
  rank?: number;
  rankTitle?: string;
  title?: string;
}

// Config

export interface ConfigState {
  home: boolean;
  homePosition: WidgetPosition;
  mapZoom: boolean;
  mapZoomPosition: WidgetPosition;
  legend: boolean;
  legendPosition: WidgetPosition;
  googleAnalytics: boolean;
  googleAnalyticsConsent: boolean;
  googleAnalyticsConsentMsg: string;
  googleAnalyticsKey: string;
  telemetry: TelemetryConfig;
  title: string;
}
