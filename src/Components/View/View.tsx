import React, { createRef, FC, ReactElement, useEffect } from "react";
import { createMapFromItem } from "../../ApplicationBase/support/itemUtils";
import MapView from "@arcgis/core/views/MapView";
import { useTypedSelector } from "../../redux/reducers";

const CSS = {
  base: "esri-map-series__view"
};

const View: FC = (): ReactElement => {
  const mapDiv = createRef() as React.RefObject<HTMLDivElement>;
  const base = useTypedSelector((state) => state.base);
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
    }
    createView();
  }, []);

  return <div className={CSS.base} ref={mapDiv} />;
};

export default View;
