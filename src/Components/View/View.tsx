import React, { FC, ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MapView from "@arcgis/core/views/MapView";
import { createMapFromItem } from "../../ApplicationBase/support/itemUtils";
import { baseSelector } from "../../redux/reducers/base";

import "./View.scss"

const CSS = {
  base: "esri-countdown__view"
};

const View: FC = (): ReactElement => {
  const mapDiv = useRef() as React.RefObject<HTMLDivElement>;
  const base = useSelector(baseSelector);

  useEffect(() => {
    const createView = async (): Promise<__esri.MapView> => {
      const portalItem: __esri.PortalItem = base.results.applicationItem.value;
      const appProxies = portalItem?.applicationProxies ? portalItem.applicationProxies : null;
      const { webMapItems } = base.results;
      let item = null;

      webMapItems.forEach((response) => {
        item = response.value;
      });

      const map = await createMapFromItem({ item, appProxies });
      return new MapView({
        container: mapDiv.current,
        map
      });
    };
    createView();
  }, [base, mapDiv]);

  return <div className={CSS.base} ref={mapDiv} />;
};

export default View;
