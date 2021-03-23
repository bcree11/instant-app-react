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
import applicationBaseJSON from "./config/applicationBase.json";
import applicationJSON from "./config/application.json";
import ApplicationBase from "./ApplicationBase/ApplicationBase";

// Service Worker
import * as serviceWorker from "./serviceWorker";

// Redux
import { Provider } from "react-redux";
import { createStore, Store } from "redux";
import { rootReducer, RootState } from "./redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { registerMessageBundleLoader, createJSONLoader, setLocale } from "@arcgis/core/intl";

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

    console.log('base.config: ', base.config);
    console.log('base.config.draft: ', base.config.draft);

    console.log('config: ', config);


  const initialState = {
    base,
    header: {
      header: config.header,
      title: config.title
    },
    portal: base.portal,
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
      legend: {
        addToMap: config.legend,
        ui: config.legendPosition
      },
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
  console.log({theme});

  const jsapiStyles = document.getElementById("jsapiStyles") as HTMLLinkElement;
  jsapiStyles.href =  `${process.env.PUBLIC_URL}/assets/esri/themes/${theme}/main.css`;
}
