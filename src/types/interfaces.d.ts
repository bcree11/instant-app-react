// Theme

export type Theme = "dark" | "light";

export interface ThemeState {
  theme: Theme;
  applySharedTheme: boolean;
}

export interface SharedTheme {
  button: { background: string; text: string };
  header: { background: string; text: string };
  logo: { small: string; link: string };
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
  legendOpenAtStart: boolean;
  legendPosition: WidgetPosition;
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
  coverPage: boolean;
  coverPageConfig: ICoverPageConfig;
  coverPageIsVisible?: boolean;
  controlPanelPosition: WidgetPosition;
  autoPlay: boolean;
  autoPlayDuration: number;
  share: boolean;
  exportToPDF: boolean;
  measure: boolean;
}

// Cover page

export interface ICoverPageConfig {
  title?: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  textPosition?: string;
  buttonText?: string;
  buttonTextColor?: string;
  background?: {
    backgroundType?: string;
    backgroundImage?: any;
    backgroundColor?: string;
  };
}

// Exhibit

export interface ExhibitState {
  prevSlide?: ISlide;
  currentSlide?: ISlide;
  nextSlide?: ISlide;
  currentSlideIndex?: number;
  openInfo: boolean;
  slides: ISlide[];
  transition: SlideTransition;
}

export interface ISlide {
  id: number;
  map: IExhibitMap;
  slideContent: IExhibitSlide;
  bookmark?: string;
}

interface IExhibitMap {
  disableScroll: boolean;
  visibleLayers: string[];
  includePopup: boolean;
  popup?: IPopup;
  basemapId?: string;
  filter?: { [key: string]: string };
  goTo?: { center: number[]; scale: number; zoom?: number };
}

interface IPopup {
  layerId: string;
  objectId: number | string;
  title: string;
}

interface IExhibitSlide {
  title: string;
  legendEnabled: boolean;
  slideNote1Enabled: boolean;
  slideNote1: ISlideNote;
  slideNote2Enabled: boolean;
  slideNote2: ISlideNote;
}

export interface ISlideNote {
  position: SlidePosition;
  backgroundColor?: string;
  content?: string;
}

export type SlideTransition = "fade" | "slowFade" | "none";
export type SlidePosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";
