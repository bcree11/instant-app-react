import { FC, ReactElement, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";

import Home from "@arcgis/core/widgets/Home";
import MapView from "@arcgis/core/views/MapView";
import MapZoom from "@arcgis/core/widgets/Zoom";
import Expand from "@arcgis/core/widgets/Expand";

import { mapSelector } from "../../redux/reducers/map";
// import ViewT9n from "../../t9n/View/resources.json";
// import { useMessages } from "../../hooks/useMessages";

import "./View.scss";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { WidgetPosition } from "../../types/interfaces";

const CSS = {
  base: "esri-instant-app__view"
};

const View: FC = (): ReactElement => {
  // const messages: typeof ViewT9n = useMessages("View");
  const view = useRef<__esri.MapView>(new MapView());
  const map = useSelector(mapSelector);
  const mapDiv = useRef<HTMLDivElement>(null);
  const {
    home,
    homePosition,
    mapZoom,
    mapZoomPosition,
    mapA11yDesc
    } = useSelector(configParamsSelector);
  const mapDescription = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    view.current.container = mapDiv.current;
    view.current.map = map;
    view.current.ui.remove("zoom");
  }, [map, mapDiv]);

  useLayoutEffect(() => {
    handleWidget(mapZoom, mapZoomPosition as WidgetPosition, "mapZoom", () => {
      return new MapZoom({ view: view.current, id: "mapZoom" });
    });
  }, [mapZoom, mapZoomPosition, mapZoomPosition?.index, mapZoomPosition?.position]);

  useLayoutEffect(() => {
    handleWidget(home, homePosition as WidgetPosition, "home", () => {
      return new Home({ view: view.current, id: "home" });
    });
  }, [home, homePosition, homePosition?.index, homePosition?.position]);

  useEffect(() => {
    const ariaDesc = mapA11yDesc ?? map?.portalItem?.snippet ?? map?.portalItem?.description ?? null;
    if (ariaDesc) {
      mapDescription.current.innerHTML = ariaDesc;
      const rootNode = document.getElementsByClassName("esri-view-surface");
      view.current.container.setAttribute("aria-describedby", "mapDescription");
      for (let k = 0; k < rootNode.length; k++) {
        rootNode[k].setAttribute("aria-describedby", "mapDescription");
      }
    }
    const popupContainer = view.current.popup.container as HTMLElement;
    popupContainer?.setAttribute("aria-live", "polite");
  }, [mapA11yDesc, map?.portalItem?.description, map?.portalItem?.snippet]);

  function handleWidget(
    visibility: boolean,
    position: WidgetPosition,
    classRef: string,
    constructorFunc: Function,
    expandable: boolean = false,
    openAtStart: boolean = false
  ) {
    let widget = view.current.ui.find(classRef);
    if (visibility) {
      if (widget) {
        view.current.ui.move({
          component: widget,
          ...position
        } as __esri.UIMoveComponent);
        if (expandable) {
          const expandWidget = widget as Expand;
          expandWidget.expanded = openAtStart;
        }
      } else {
        widget = constructorFunc();
        view.current.ui.add({
          component: widget,
          ...position
        } as __esri.UIAddComponent);
      }
    } else {
      view.current.ui.remove(widget);
    }
  }

  return (
    <div className={CSS.base} ref={mapDiv}>
      <div id="mapDescription" ref={mapDescription} className="sr-only"></div>
    </div>
  );
};

export default View;
