import { FC, ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import Home from "@arcgis/core/widgets/Home";
import MapView from "@arcgis/core/views/MapView";
import MapZoom from "@arcgis/core/widgets/Zoom";

import "./View.scss";

import ViewT9n from "../../t9n/View/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";

import { mapSelector } from "../../redux/reducers/map";
import { popupSelector } from "../../redux/slices/popupSlice";
import { sectionsSelector } from "../../redux/slices/sectionsSlice";

import Compare from "../Compare/Compare";
import { mobileSelector } from "../../redux/slices/mobileSlice";
import Search from "@arcgis/core/widgets/Search";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { WidgetPosition } from "../../types/interfaces";

const CSS = {
  base: "esri-countdown-app__view"
};

const View: FC = (): ReactElement => {
  const { featureIndex } = useSelector(popupSelector);
  const { home, homePosition, mapZoom, mapZoomPosition } = useSelector(configParamsSelector);
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
    });
    view.current.on("layerview-create", () => {
      setViewReady(true);
    });
  }, [dispatch, map, mapDiv]);

  useLayoutEffect(() => {
    function handleWidget(visibility: boolean, position: WidgetPosition, classRef: string, constructorFunc: Function) {
      let widget = view.current.ui.find(classRef);
      if (visibility) {
        if (widget) {
          view.current.ui.move({
            component: widget,
            ...position
          } as __esri.UIMoveComponent);
          return;
        }
        widget = constructorFunc();
        view.current.ui.add({
          component: widget,
          ...position
        } as __esri.UIAddComponent);
      } else {
        view.current.ui.remove(widget);
      }
    }
    handleWidget(mapZoom, mapZoomPosition as WidgetPosition, "mapZoom", () => {
      return new MapZoom({ view: view.current, id: "mapZoom" });
    });
    handleWidget(home, homePosition as WidgetPosition, "home", () => {
      return new Home({ view: view.current, id: "home" });
    });
  }, [
    home,
    homePosition,
    homePosition?.index,
    homePosition?.position,
    mapZoom,
    mapZoomPosition,
    mapZoomPosition?.index,
    mapZoomPosition?.position
  ]);

  useEffect(() => {
    let isSubscribed = true;

    if (isSubscribed && viewReady) {
      view.current.popup.autoCloseEnabled = true;
      const checkType = currentSection?.type === "countdown" || currentSection?.type === "leaderboard";
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
  }, [currentSection, featureIndex, showMobileMode, viewReady]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed && currentSection?.type === "leaderboard" && viewReady) {
      const { searchDisplayField, searchFields, zoomScale } = currentSection;
      view.current.popup.autoCloseEnabled = true;
      if (layerView.current) {
        layerView.current.queryExtent().then((response) => {
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
