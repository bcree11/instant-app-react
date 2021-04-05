import { FC, ReactElement, useCallback, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createMapFromItem } from "../../ApplicationBase/support/itemUtils";
// import { createMapFromItem } from "@esri/application-base-js/support/itemUtils"
import { baseSelector } from "../../redux/reducers/base";
import { widgetSelector } from "../../redux/slices/widgetSlice";
import ViewT9n from "../../t9n/View/resources.json";

import Home from "@arcgis/core/widgets/Home";
import MapView from "@arcgis/core/views/MapView";
import Zoom from "@arcgis/core/widgets/Zoom";

import "./View.scss";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";

const CSS = {
  base: "esri-instant-app__view"
};

const View: FC = (): ReactElement => {
  const [view] = useState<__esri.MapView>(new MapView());
  const [messages, setMessages] = useState<typeof ViewT9n>(null);
  const mapDiv = useRef<HTMLDivElement>(null);
  const { home, mapZoom } = useSelector(widgetSelector);
  const base = useSelector(baseSelector);
  const handleHome = useCallback((): void => {
    const homeWidget = view.ui.find("home");
    if (home.addToMap) {
      if (homeWidget) {
        view.ui.move({
          component: homeWidget,
          position: home.ui.position,
          index: home.ui.index
        });
        return;
      }
      view.ui.add({
        component: new Home({ view: view, id: "home" }),
        position: home.ui.position,
        index: home.ui.index
      });
    } else {
      view.ui.remove(homeWidget);
    }
  }, [home, view]);
  const handleMapZoom = useCallback((): void => {
    const zoomWidget = view.ui.find("mapZoom");
    if (mapZoom.addToMap) {
      if (zoomWidget) {
        view.ui.move({
          component: zoomWidget,
          position: mapZoom.ui.position,
          index: mapZoom.ui.index
        });
        return;
      }
      view.ui.add({
        component: new Zoom({ view: view, id: "mapZoom" }),
        position: mapZoom.ui.position,
        index: mapZoom.ui.index
      });
    } else {
      view.ui.remove(zoomWidget);
    }
  }, [mapZoom, view]);

  useLayoutEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("View"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useLayoutEffect(() => {
    async function createView(): Promise<void> {
      const portalItem: __esri.PortalItem = base.results.applicationItem.value;
      const appProxies = portalItem?.applicationProxies ? portalItem.applicationProxies : null;
      const { webMapItems } = base.results;
      let item = null;
      webMapItems.forEach((response) => (item = response.value));
      const map = await createMapFromItem({ item, appProxies });
      view.container = mapDiv.current;
      view.map = map;
      view.ui.remove("zoom");
    }
    createView();
  }, [base, mapDiv, view]);

  useLayoutEffect(() => {
    handleHome();
    handleMapZoom();
  }, [handleHome, handleMapZoom, home.addToMap, mapZoom.addToMap, view.ready]);

  return <div className={CSS.base} ref={mapDiv} />;
};

export default View;
