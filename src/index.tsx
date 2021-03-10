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
import {
  applyPolyfills,
  defineCustomElements
} from "@esri/calcite-components/dist/loader";

// Application/ApplicationBase
import applicationBaseJSON from "./config/applicationBase.json";
import applicationJSON from "./config/application.json";

import ApplicationBase from "./ApplicationBase/ApplicationBase";

// Service Worker
import * as serviceWorker from "./serviceWorker";

// Redux
import { Provider } from "react-redux";
import { createStore } from "redux";
import {rootReducer, RootState} from "./redux/reducers";

import {
  registerMessageBundleLoader,
  createJSONLoader,
  setLocale
} from "@arcgis/core/intl";

(async function init(): Promise<void> {
  const base = (await createApplicationBase().load()) as ApplicationBase;

  registerMessageBundleLoader(
    createJSONLoader({
      pattern: `${process.env.PUBLIC_URL}/`,
      base: `${process.env.PUBLIC_URL}`,
      location: new URL(
        `${process.env.PUBLIC_URL}/assets/`,
        window.location.href
      )
    })
  );

  setLocale(base.locale);

  const config = (window.location !== window.parent.location
    ? { ...base.config, ...base.config.draft }
    : { ...base.config }) as typeof applicationJSON;

    const initialState = {
      base,
      header: {
        header: config.header,
        title: config.title
      },
      splash: {
        splash: config.splash,
        splashTitle: config.splashTitle,
        splashContent: config.splashContent,
        splashButtonText: config.splashButtonText,
        splashOnStart: config.splashOnStart
      },
      // themeReducer: {
      //   theme: config.theme,
      //   applySharedTheme: config.applySharedTheme
      // },
      // itemCollectionReducer: {
      //   itemCollection: config.itemCollection
      // },
      // widgetReducer: {
      //   home: config.home,
      //   mapZoom: config.mapZoom,
      //   search: config.search,
      //   layerList: config.layerList,
      //   legend: config.legend,
      //   print: config.print,
      //   basemapToggle: config.basemapToggle
      // },
      // widgetPositionReducer: {
      //   homePosition: config.homePosition,
      //   mapZoomPosition: config.mapZoomPosition,
      //   searchPosition: config.searchPosition,
      //   layerListPosition: config.layerListPosition,
      //   legendPosition: config.legendPosition,
      //   printPosition: config.printPosition,
      //   basemapTogglePosition: config.basemapTogglePosition
      // },
      // navigationReducer: {
      //   navigationBarOpenAtStart: config.navigationBarOpenAtStart,
      //   minimizedSectionDisplay: config.minimizedSectionDisplay
      // },
      // autoPlayReducer: {
      //   autoPlay: config.autoPlay,
      //   autoPlayDuration: config.autoPlayDuration,
      //   playing: false
      // },
      // locationReducer: {
      //   portfolioLocation: config.portfolioLocation,
      //   locationPanelIsOpen: false
      // },
      // portalReducer: {
      //   portal: base.portal
      // }
    } as RootState;

  const store = createStore(rootReducer, initialState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

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
