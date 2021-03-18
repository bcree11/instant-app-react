import React, { FC, ReactElement, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { createMapFromItem } from "../../ApplicationBase/support/itemUtils";
import { baseSelector } from "../../redux/reducers/base";
import { widgetSelector } from "../../redux/slices/widgetSlice";
import ViewT9n from "../../t9n/View/resources.json";

import MapView from "@arcgis/core/views/MapView";
import Expand from "@arcgis/core/widgets/Expand";
import Home from "@arcgis/core/widgets/Home";
import Legend from "@arcgis/core/widgets/Legend";

import "./View.scss";
import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";

const CSS = {
  base: "esri-instant__view"
};

const View: FC = (): ReactElement => {
  const [view] = useState<__esri.MapView>(new MapView());
  const [messages, setMessages] = useState<typeof ViewT9n>(null);
  const mapDiv = useRef<HTMLDivElement>(null);
  const { home, legend } = useSelector(widgetSelector);
  const base = useSelector(baseSelector);

  useLayoutEffect(() => {
    if (view?.ready) {
      return;
    }
    async function fetchMessages() {
      const data = await fetchMessageBundle(getMessageBundlePath("View"));
      setMessages(data);
    }
    fetchMessages();
    function handleHome(): void {
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
    }
    function handleLegend(): void {
      const legendWidget = view.ui.find("legend");
      if (legend.addToMap) {
        if (legendWidget) {
          view.ui.move({
            component: legendWidget,
            position: legend.ui.position,
            index: legend.ui.index
          });
          return;
        }
        const content = new Legend({
          view,
          basemapLegendVisible: true
        });
        const expand = new Expand({
          view: view,
          content,
          id: "legend",
          expandTooltip: messages?.toggleLegend,
          collapseTooltip: messages?.toggleLegend
        });
        view.ui.add({
          component: expand,
          position: legend.ui.position,
          index: legend.ui.index
        });
      } else {
        view.ui.remove(legendWidget);
      }
    }
    async function createView(): Promise<void> {
      const portalItem: __esri.PortalItem = base.results.applicationItem.value;
      const appProxies = portalItem?.applicationProxies ? portalItem.applicationProxies : null;
      const { webMapItems } = base.results;
      let item = null;
      webMapItems.forEach((response) => (item = response.value));
      const map = await createMapFromItem({ item, appProxies });
      view.container = mapDiv.current;
      view.map = map;
      handleLegend();
      handleHome();
    }
    createView();
  }, [base, home, legend, mapDiv, messages, view]);

  return <div className={CSS.base} ref={mapDiv} />;
};

export default View;
