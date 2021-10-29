// React
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

// ArcGIS Core
import "@arcgis/core/assets/esri/themes/dark/main.css";
import { registerMessageBundleLoader, createJSONLoader, setLocale } from "@arcgis/core/intl";
import PortalItem from "@arcgis/core/portal/PortalItem";

// Calcite Components
import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/dist";
import { applyPolyfills, defineCustomElements } from "@esri/calcite-components/dist/loader";

// Application/ApplicationBase
import applicationBaseJSON from "./config/applicationBase.json";
import applicationJSON from "./config/application.json";
import ApplicationBase from "./ApplicationBase/ApplicationBase";
import { createMapFromItem } from "./ApplicationBase/support/itemUtils";
import { setPageTitle } from "./ApplicationBase/support/domHelper";

// Service Worker
import * as serviceWorker from "./serviceWorker";

// Redux
import { Provider } from "react-redux";
import { createStore, Store } from "redux";
import { rootReducer, RootState } from "./redux";
import { composeWithDevTools } from "redux-devtools-extension";

import ConfigurationSettings from "./Components/ConfigurationSettings/ConfigurationSettings";
import { ConfigState, ExhibitState } from "./types/interfaces";

(async function init(): Promise<void> {
  try {
    const base = (await createApplicationBase().load()) as ApplicationBase;
    handleApplicationBaseLoad(base);
  } catch (message) {
    console.error("Error: ", message);

    // if (message === "identity-manager:not-authorized") {
    //   const root = document.getElementById("root");
    //   root.classList.add("app-error");
    //   root.innerHTML = `<h1>Not Licensed</h1><p>Your account is not licensed to use Configurable Apps that are not public. Please ask your organization administrator to assign you a user type that includes Essential Apps or an add-on Essential Apps license.</p>`;
    // } else if (message?.name === "identity-manager:not-authorized") {
    //   const root = document.getElementById("root");
    //   root.classList.add("app-error");
    //   root.innerHTML = `<p>${message?.message}</p>`;
    // } else if (message?.error === "application:origin-other") {
    //   const urlPath = new URL(window.location.href);
    //   const origin = urlPath.origin;
    //   document.location.href = `${origin}/apps/shared/origin/index.html?appUrl=${message.appUrl}`;
    // } else if (message?.message === "Item does not exist or is inaccessible.") {
    //   const root = document.getElementById("root");
    //   root.classList.add("app-error");
    //   root.innerHTML = `<p>${message?.message}</p>`;
    // }
  }
})();

async function handleApplicationBaseLoad(base: ApplicationBase) {
  registerMessageBundleLoader(
    createJSONLoader({
      pattern: `${process.env.PUBLIC_URL}/`,
      base: `${process.env.PUBLIC_URL}`,
      location: new URL(`${process.env.PUBLIC_URL}/assets/`, window.location.href)
    })
  );

  setLocale(base.locale);

  if (base.direction) {
    document.querySelector("html").setAttribute("dir", base.direction);
  }

  const config = (
    window.location !== window.parent.location ? { ...base.config, ...base.config.draft } : { ...base.config }
  ) as typeof applicationJSON;

  updateJSAPIStyles(config.theme as "light" | "dark");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const mapId = urlParams.get("webmap");
  let item: __esri.PortalItem;

  if (mapId) {
    item = await new PortalItem({
      portal: base.portal,
      id: mapId
    }).load();
  } else {
    const { webMapItems } = base.results;
    item = webMapItems[0].value;
  }

  const appProxies = item?.applicationProxies ? item.applicationProxies : null;
  const map = await createMapFromItem({ item, appProxies });
  setPageTitle(config.title ? config.title : map?.portalItem?.title ?? "");
  const initConfig: ConfigState = JSON.parse(JSON.stringify(config))
  initConfig.coverPageIsVisible = config.coverPage;

  const initialState = {
    map,
    portal: base.portal,
    config: initConfig,
    exhibit: {
      ...config.exhibitConfig,
      currentSlide: config.exhibitConfig.slides[0],
      currentSlideIndex: 0,
      openInfo: config.splash && config.splashOnStart && !config.coverPage
    } as ExhibitState
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
        <ConfigurationSettings />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
}

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
