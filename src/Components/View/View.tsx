import { FC, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import Home from "@arcgis/core/widgets/Home";
import MapView from "@arcgis/core/views/MapView";
import Zoom from "@arcgis/core/widgets/Zoom";

import "./View.scss";

import ViewT9n from "../../t9n/View/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";

import { mapSelector } from "../../redux/reducers/map";
import { widgetSelector } from "../../redux/slices/widgetSlice";
import { popupSelector } from "../../redux/slices/popupSlice";
import { sectionsSelector } from "../../redux/slices/sectionsSlice";

import Compare from "../Compare/Compare";
import { mobileSelector } from "../../redux/slices/mobileSlice";
import Search from "@arcgis/core/widgets/Search";

const CSS = {
  base: "esri-countdown-app__view"
};

const View: FC = (): ReactElement => {
  const { featureIndex } = useSelector(popupSelector);
  const { home, mapZoom } = useSelector(widgetSelector);
  const { currentSection } = useSelector(sectionsSelector);
  const { showMobileMode } = useSelector(mobileSelector);
  const map = useSelector(mapSelector);
  const [messages, setMessages] = useState<typeof ViewT9n>(null);
  const [viewReady, setViewReady] = useState<boolean>(false);
  const view = useRef<__esri.MapView>(new MapView());
  const layerView = useRef<__esri.FeatureLayerView>(null);
  const search = useRef<Search>(null);
  const scale = useRef<number>(null);
  const mapDiv = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const handleHome = useCallback((): void => {
    const homeWidget = view.current.ui.find("home");
    if (home.addToMap) {
      if (homeWidget) {
        view.current.ui.move({
          component: homeWidget,
          position: home.ui.position,
          index: home.ui.index
        });
        return;
      }
      view.current.ui.add({
        component: new Home({ view: view.current, id: "home" }),
        position: home.ui.position,
        index: home.ui.index
      });
    } else {
      view.current.ui.remove(homeWidget);
    }
  }, [home, view]);
  const handleMapZoom = useCallback((): void => {
    const zoomWidget = view.current.ui.find("mapZoom");
    if (mapZoom.addToMap) {
      if (zoomWidget) {
        view.current.ui.move({
          component: zoomWidget,
          position: mapZoom.ui.position,
          index: mapZoom.ui.index
        });
        return;
      }
      view.current.ui.add({
        component: new Zoom({ view: view.current, id: "mapZoom" }),
        position: mapZoom.ui.position,
        index: mapZoom.ui.index
      });
    } else {
      view.current.ui.remove(zoomWidget);
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
    view.current.container = mapDiv.current;
    view.current.map = map;
    view.current.ui.remove("zoom");
    view.current.when(() => {
      scale.current = view.current.scale;
      console.log('view.current.scale ',view.current.scale);

    });
    view.current.on("layerview-create", () => {
      setViewReady(true);
    });
  }, [dispatch, map, mapDiv]);

  useLayoutEffect(() => {
    handleHome();
    handleMapZoom();
  }, [handleHome, handleMapZoom, home.addToMap, mapZoom.addToMap]);

  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed && viewReady) {
      view.current.popup.autoCloseEnabled = true;
      const checkType = currentSection?.type === "countdown" || currentSection?.type === "leaderboard";
      console.log('view.current.layerViews: ',view.current.layerViews);

      if (checkType) {
        layerView.current = view.current.layerViews.find((lv) => {
          return lv.layer.id === currentSection.layerId;
        }) as __esri.FeatureLayerView;
      } else {
        layerView.current = null;
      }
      if (checkType && (featureIndex || featureIndex === 0)) {
        const graphic = currentSection?.graphics?.[featureIndex];
        if (layerView.current && currentSection?.type === "countdown") {
          layerView.current.effect = {
            filter: {
              geometry: currentSection?.graphics?.[featureIndex].geometry
            },
            excludedEffect: "opacity(.2)",
            includedEffect: "drop-shadow(3px, 3px, 4px) brightness(300%)"
          } as __esri.FeatureEffect;
        }
        console.log("136 goto");

        view.current.goTo({
          target: [graphic?.geometry["x"], graphic?.geometry["y"]],
          scale: currentSection.zoomScale ?? 200000
        });
      } else {
        view.current.goTo({ ...view.current.center, scale: scale.current });
      }
    }

    return () => {
      isSubscribed = false;
      if (layerView.current) {
        layerView.current.effect = null;
      }
    };
  }, [
    currentSection,
    featureIndex,
    showMobileMode,
    viewReady
  ]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed && currentSection?.type === "leaderboard" && viewReady) {
      console.log('view.current.layerViews: ',view.current.layerViews);
      const { searchDisplayField, searchFields, zoomScale } = currentSection;
      view.current.popup.autoCloseEnabled = true;
      if (layerView.current) {
        layerView.current.queryExtent().then((response) => {
          console.log("response", response);
          if (response?.extent) {
            view.current.goTo(response.extent);
          } else {
            view.current.goTo({ ...view.current.center, scale: scale.current });
          }
        });
      }
      const searchContainer = document.getElementById("search-widget-container");
      if (searchContainer) {
        searchContainer.innerHTML = "";
      }
      if (!search.current) {
        search.current = new Search({
          allPlaceholder: "Search",
          container: "search-widget-container",
          includeDefaultSources: false,
          view: view.current,
          goToOverride: () => {},
          sources: [
            {
              layer: layerView.current?.layer as __esri.Layer,
              searchFields,
              displayField: searchDisplayField,
              exactMatch: false,
              outFields: ["*"],
              placeholder: "Search",
              zoomScale,
              popupEnabled: false
            } as __esri.LayerSearchSource
          ]
        });
        search.current.on("select-result", (event) => {
          const graphic = currentSection?.graphics?.find(
            ({ attributes }) => attributes[currentSection.searchDisplayField] === event.result.name
          );
          view.current.goTo({
            target: [graphic?.geometry["x"], graphic?.geometry["y"]],
            scale: currentSection.zoomScale ?? 200000
          });
        });
        search.current.on("search-clear", () => {
          if (layerView.current) {
            layerView.current.queryExtent().then((response) => {
              if (response?.extent) {
                view.current.goTo(response.extent);
              } else {
                view.current.goTo({ ...view.current.center, scale: scale.current });
              }
            });
          }
        });
      }
    }
    return () => {
      isSubscribed = false;
      search.current = null;
    };
  }, [currentSection, currentSection?.position, showMobileMode, viewReady]);

  return (
    <div className={CSS.base} ref={mapDiv}>
      {!showMobileMode && <Compare />}
    </div>
  );
};

export default View;
