// React
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

// ArcGIS Core
import "@arcgis/core/assets/esri/themes/dark/main.css";

// Calcite Components
import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/dist";
import { applyPolyfills, defineCustomElements } from "@esri/calcite-components/dist/loader";

// Application/ApplicationBase
import ApplicationBase from "./ApplicationBase/ApplicationBase";
import applicationBaseJSON from "./config/applicationBase.json";
import applicationJSON from "./config/application.json";
import { createMapFromItem } from "./ApplicationBase/support/itemUtils";

// Service Worker
import * as serviceWorker from "./serviceWorker";

// Redux
import { Provider } from "react-redux";
import { createStore, Store } from "redux";
import { rootReducer, RootState } from "./redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { registerMessageBundleLoader, createJSONLoader, setLocale } from "@arcgis/core/intl";
import { SectionState } from "./types/interfaces";

(async function init(): Promise<void> {
  const base = (await createApplicationBase().load()) as ApplicationBase;

  registerMessageBundleLoader(
    createJSONLoader({
      pattern: `${process.env.PUBLIC_URL}/`,
      base: `${process.env.PUBLIC_URL}`,
      location: new URL(`${process.env.PUBLIC_URL}/assets/`, window.location.href)
    })
  );

  setLocale(base.locale);

  const config = (window.location !== window.parent.location
    ? { ...base.config, ...base.config.draft }
    : { ...base.config }) as typeof applicationJSON;

  updateJSAPIStyles(config.theme as "light" | "dark");

  const portalItem: __esri.PortalItem = base.results.applicationItem.value;
  const appProxies = portalItem?.applicationProxies ? portalItem.applicationProxies : null;
  const { webMapItems } = base.results;
  let item = null;
  webMapItems.forEach((response) => (item = response.value));
  const map = await createMapFromItem({ item, appProxies });

  const initialState = {
    map,
    portal: base.portal,
    sections: {
      sections: updateSections(config.sections as SectionState[])
    },
    splash: {
      splash: config.splash,
      splashTitle: config.splashTitle,
      splashContent: config.splashContent,
      splashButtonText: config.splashButtonText,
      splashOnStart: config.splashOnStart
    },
    telemetry: {
      googleAnalytics: config.googleAnalytics,
      googleAnalyticsKey: config.googleAnalyticsKey,
      googleAnalyticsConsent: config.googleAnalyticsConsent,
      googleAnalyticsConsentMsg: config.googleAnalyticsConsentMsg,
      telemetry: config.telemetry
    },
    theme: {
      theme: config.theme,
      applySharedTheme: config.applySharedTheme
    },
    widget: {
      home: {
        addToMap: config.home,
        ui: config.homePosition
      },
      mapZoom: {
        addToMap: config.mapZoom,
        ui: config.mapZoomPosition
      }
    }
  } as RootState;

  let store: Store;
  if (process.env.NODE_ENV === "development") {
    store = createStore(rootReducer, initialState, composeWithDevTools());
  } else {
    store = createStore(rootReducer, initialState);
  }

  await applyPolyfills();
  defineCustomElements(window);

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
})();

function createApplicationBase(): ApplicationBase {
  const config = applicationJSON;
  const settings = applicationBaseJSON;
  return new ApplicationBase({
    config,
    settings
  });
}

function updateJSAPIStyles(theme: "light" | "dark"): void {
  const jsapiStyles = document.getElementById("jsapiStyles") as HTMLLinkElement;
  jsapiStyles.href = `${process.env.PUBLIC_URL}/assets/esri/themes/${theme}/main.css`;
}

function updateSections(sections: SectionState[]): SectionState[] {
  if (sections && sections.length) {
    sections.sort((a, b) => a.position - b.position);
    for (const section of sections) {
      if (section.position === 0) {
        section.active = true;
      } else {
        section.active = false;
      }
    }
  }
  return sections;
}
