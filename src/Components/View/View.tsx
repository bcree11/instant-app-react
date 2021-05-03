import { FC, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Home from "@arcgis/core/widgets/Home";
import MapView from "@arcgis/core/views/MapView";
import Zoom from "@arcgis/core/widgets/Zoom";

import "./View.scss";

import ViewT9n from "../../t9n/View/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import { fetchMessageBundle } from "@arcgis/core/intl";

import { mapSelector } from "../../redux/reducers/map";
import { widgetSelector } from "../../redux/slices/widgetSlice";
import { popupSelector } from "../../redux/slices/popupSlice";
import { sectionsSelector } from "../../redux/slices/sectionsSlice";

import Compare from "../Compare/Compare";

const CSS = {
  base: "esri-countdown-app__view"
};

const View: FC = (): ReactElement => {
  const [view] = useState<__esri.MapView>(new MapView());
  const [messages, setMessages] = useState<typeof ViewT9n>(null);
  const mapDiv = useRef<HTMLDivElement>(null);
  const highlight = useRef<__esri.Handle>(null);
  const { featureIndex } = useSelector(popupSelector);
  const { home, mapZoom } = useSelector(widgetSelector);
  const { currentSection } = useSelector(sectionsSelector);
  const map = useSelector(mapSelector);
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
    view.container = mapDiv.current;
    view.map = map;
    view.ui.remove("zoom");
  }, [map, mapDiv, view]);

  useLayoutEffect(() => {
    handleHome();
    handleMapZoom();
  }, [handleHome, handleMapZoom, home.addToMap, mapZoom.addToMap, view.ready]);

  useEffect(() => {
    if (featureIndex || featureIndex === 0) {
      highlight.current && highlight.current.remove();
      const feature = currentSection?.features?.[featureIndex];
      view.goTo({
        target: [feature?.geometry["x"], feature?.geometry["y"]],
        scale: 250000
      });

      view.popup
        .fetchFeatures({
          x: feature?.geometry["x"],
          y: feature?.geometry["y"]
        })
        .then((response) => {
          response.promisesPerLayerView.forEach((fetchResult) => {
            const layerView = fetchResult.layerView as __esri.FeatureLayerView;
            // const objectId = layerView.layer.objectIdField;
            // highlight.current = layerView.highlight(feature.attributes[objectId]);
            layerView.effect = {
              filter: {
                geometry: currentSection.features[featureIndex].geometry
              },
              excludedEffect: "opacity(.5)",
              includedEffect: "drop-shadow(3px, 3px, 4px) brightness(300%)"
            } as __esri.FeatureEffect;
          });
        });
    }
  }, [currentSection?.features, featureIndex, view]);

  return <div className={CSS.base} ref={mapDiv}><Compare /></div>;
};

export default View;
