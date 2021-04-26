import { TelemetryConfig, WidgetPosition } from "../types/interfaces";
import { setTitle, toggleHeader } from "./slices/headerSlice";
import { toggleApplySharedTheme, updateTheme } from "./slices/themeSlice";
import {
  toggleHomeWidget,
  toggleMapZoomWidget,
  updateHomeWidgetPosition,
  updateMapZoomWidgetPosition
} from "./slices/widgetSlice";
import {
  toggleInfo,
  toggleSplash,
  updateSplashButtonText,
  updateSplashContent,
  updateSplashTitle
} from "./slices/splashSlice";
import { updateGA, updateGAConsent, updateGAConsentMsg, updateGAKey, updateTelemetry } from "./slices/telemetrySlice";
import { updatePortal } from "./slices/portalSlice";

export const actions = {
  applySharedTheme: (applySharedTheme: boolean) => toggleApplySharedTheme(applySharedTheme),
  googleAnalytics: (googleAnalytics: boolean) => updateGA(googleAnalytics),
  googleAnalyticsConsent: (googleAnalyticsConsent: boolean) => updateGAConsent(googleAnalyticsConsent),
  googleAnalyticsConsentMsg: (googleAnalyticsConsentMsg: string) => updateGAConsentMsg(googleAnalyticsConsentMsg),
  googleAnalyticsKey: (googleAnalyticsKey: string) => updateGAKey(googleAnalyticsKey),
  header: (header: boolean) => toggleHeader(header),
  home: (home: boolean) => toggleHomeWidget(home),
  homePosition: (homePosition: WidgetPosition) => updateHomeWidgetPosition(homePosition),
  mapZoom: (mapZoom: boolean) => toggleMapZoomWidget(mapZoom),
  mapZoomPosition: (mapZoomPosition: WidgetPosition) => updateMapZoomWidgetPosition(mapZoomPosition),
  portal: (portal: __esri.Portal) => updatePortal(portal),
  splash: (splash: boolean) => toggleInfo(splash),
  splashOnStart: (splashOnStart: boolean) => toggleSplash(splashOnStart),
  splashTitle: (splashTitle: string) => updateSplashTitle(splashTitle),
  splashContent: (splashContent: string) => updateSplashContent(splashContent),
  splashButtonText: (splashButtonText: string) => updateSplashButtonText(splashButtonText),
  telemetry: (telemetry: TelemetryConfig) => updateTelemetry(telemetry),
  theme: (theme: "dark" | "light") => updateTheme(theme),
  title: (title: string) => setTitle(title)
};
