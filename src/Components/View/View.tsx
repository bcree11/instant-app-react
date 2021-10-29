import { FC, ReactElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import MapView from "@arcgis/core/views/MapView";
import MapZoom from "@arcgis/core/widgets/Zoom";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";
import { fromJSON } from "@arcgis/core/geometry/support/jsonUtils";

import ViewT9n from "../../t9n/View/resources.json";
import { useMessages } from "../../hooks/useMessages";

import "./View.scss";

import { mapSelector } from "../../redux/reducers/map";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { ISlide, SlideTransition, WidgetPosition } from "../../types/interfaces";
import { getGraphic } from "../../utils/utils";
import Basemap from "@arcgis/core/Basemap";
import { portalSelector } from "../../redux/slices/portalSlice";
import ControlPanel from "../ControlPanel/ControlPanel";

const CSS = {
  base: "esri-instant-app__view"
};

interface ViewProps {
  showView: boolean;
  slide: ISlide;
  transition: SlideTransition;
}

const View: FC<ViewProps> = ({ showView, slide, transition }): ReactElement => {
  const map = useSelector(mapSelector);
  const portal = useSelector(portalSelector);
  const {
    controlPanelPosition,
    extentSelector,
    extentSelectorConfig,
    legendOpenAtStart,
    legendPosition,
    mapA11yDesc,
    mapZoom,
    mapZoomPosition
  } = useSelector(configParamsSelector);
  const messages: typeof ViewT9n = useMessages("View");
  const view = useRef<__esri.MapView>(new MapView());
  const mapDiv = useRef<HTMLDivElement>(null);
  const mapDescription = useRef<HTMLDivElement>(null);
  const controlPanelWidget = useRef<HTMLDivElement>(null);
  const initialRotation = useRef<number>(null);
  const initialConstraints = useRef<__esri.MapViewConstraints>(null);
  const [viewReady, setViewReady] = useState<boolean>(false);
  const handleExtentSelector = useCallback(
    (layerView?: __esri.FeatureLayerView) => {
      if (extentSelector && extentSelectorConfig) {
        const { constraints, mapRotation } = extentSelectorConfig;
        let newConstraints = { ...constraints };
        const geometry = newConstraints.geometry;
        if (geometry) {
          const tmpExtent = fromJSON(geometry);
          if (tmpExtent && (tmpExtent?.type === "extent" || tmpExtent?.type === "polygon")) {
            newConstraints.geometry = tmpExtent;
            if (layerView) {
              layerView.filter = {
                ...layerView.filter,
                geometry: newConstraints.geometry,
                spatialRelationship: "intersects"
              } as __esri.FeatureFilter;
            } else {
              view.current.allLayerViews.forEach((layerView) => {
                if (layerView.layer.type === "feature") {
                  const featureLV = layerView as __esri.FeatureLayerView;
                  featureLV.filter = {
                    ...featureLV.filter,
                    geometry: newConstraints.geometry,
                    spatialRelationship: "intersects"
                  } as __esri.FeatureFilter;
                }
              });
            }
            view.current.goTo({ ...tmpExtent, scale: newConstraints.maxScale }, false).catch(() => {});
          } else {
            newConstraints.geometry = null;
          }
        }
        view.current.constraints = newConstraints;
        if (mapRotation || mapRotation === 0) {
          setMapRotation(mapRotation);
        }
      } else if (!extentSelector) {
        view.current.allLayerViews.forEach((layerView) => {
          if (layerView.layer.type === "feature") {
            const featureLV = layerView as __esri.FeatureLayerView;
            featureLV.filter = {
              ...featureLV.filter,
              geometry: null,
              spatialRelationship: null
            } as __esri.FeatureFilter;
          }
        });
        view.current.constraints = { ...initialConstraints.current };
        setMapRotation(initialRotation.current);
      }
    },
    [extentSelector, extentSelectorConfig]
  );

  useLayoutEffect(() => {
    view.current.container = mapDiv.current;
    view.current.map = map;
    view.current.ui.remove("zoom");
  }, [map, mapDiv]);

  useLayoutEffect(() => {
    handleWidget(mapZoom, mapZoomPosition as WidgetPosition, "mapZoom", () => {
      return new MapZoom({ view: view.current, id: "mapZoom" });
    });
    handleWidget(
      true,
      controlPanelPosition,
      "control-panel",
      () => {
        return new Expand({
          view: view.current,
          content: controlPanelWidget.current,
          id: "control-panel",
          expanded: true,
          mode: "floating"
        });
      },
      true,
      true
    );
  }, [controlPanelPosition, mapZoom, mapZoomPosition, mapZoomPosition.index, mapZoomPosition.position]);

  useEffect(() => {
    let count = 0;
    view.current.on("layerview-create", (event) => {
      const { layer, layerView } = event;
      if (layer.type === "feature") {
        handleExtentSelector(layerView as __esri.FeatureLayerView);
      }
      count++;
      if (count === map.allLayers.length) {
        setViewReady(true);
      }
    });
  }, [handleExtentSelector, map.allLayers.length]);

  useEffect(() => {
    if (viewReady) {
      const fade = transition === "fade" ? "0.5" : transition === "slowFade" ? "1.5" : null;
      mapDiv.current.style.zIndex = showView ? "0" : "-1";
      mapDiv.current.style.opacity = showView ? "1" : "0";
      mapDiv.current.style.transition = fade ? `opacity ${fade}s ease-in-out 0s` : "unset";
    }
  }, [showView, transition, viewReady]);

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

  useEffect(() => {
    if (viewReady && slide) {
      const { filter, includePopup, popup, visibleLayers } = slide.map;
      view.current.popup.autoOpenEnabled = true;
      view.current.popup.visible = false;
      if (popup) {
        const { layerId, objectId } = popup;
        if (includePopup && popup && visibleLayers.includes(layerId)) {
          const handleIncludePopup = async () => {
            const graphic = await getGraphic(map.allLayers.toArray(), layerId, objectId);
            if (graphic) {
              view.current.popup.open({
                features: [graphic],
                location: graphic.geometry
              });
            }
            view.current.popup.autoOpenEnabled = false;
          };
          handleIncludePopup();
        }
      }

      map.allLayers.toArray().forEach((layer) => {
        if (layer.type === "feature") {
          const featureLayer = layer as __esri.FeatureLayer;
          if (!visibleLayers.includes(layer.id)) {
            featureLayer.visible = false;
          } else {
            if (filter && filter?.[featureLayer.id]) {
              featureLayer.definitionExpression = featureLayer.definitionExpression
                ? featureLayer.definitionExpression + " AND " + filter[featureLayer.id]
                : filter[featureLayer.id];
            }
          }
        }
      });
    }
  }, [slide, map.allLayers, viewReady]);

  useEffect(() => {
    if (slide) {
      const { basemapId, disableScroll, goTo } = slide.map;
      const { legendEnabled } = slide.slideContent;
      const updateBasemap = async (): Promise<void> => {
        if (basemapId) {
          map.basemap = await new Basemap({
            portalItem: {
              id: basemapId,
              portal
            }
          }).loadAll();
        }
      };
      updateBasemap();
      handleWidget(
        legendEnabled,
        legendPosition as WidgetPosition,
        "legend",
        () => {
          return new Expand({
            view: view.current,
            content: new Legend({ view: view.current, id: "legend" }),
            id: "legend",
            expanded: legendOpenAtStart,
            mode: "floating"
          });
        },
        true,
        legendOpenAtStart
      );
      view.current.goTo(goTo, {
        animate: false
      });
      if (disableScroll) {
        view.current.constraints = {
          ...view.current.constraints,
          maxZoom: goTo.zoom,
          minZoom: goTo.zoom
        };
      }
    }
  }, [
    slide,
    slide?.map.disableScroll,
    slide?.slideContent.legendEnabled,
    legendOpenAtStart,
    legendPosition,
    map,
    portal
  ]);

  useEffect(() => {
    if (slide) {
      const { slideNote1Enabled, slideNote1 } = slide.slideContent;
      const { backgroundColor, content, position } = slideNote1;
      const noteId = "slide-note-1";
      if (slideNote1Enabled) {
        let note = view.current.ui.find(noteId) as HTMLElement;
        if (!note) {
          note = document.createElement("div");
          note.id = noteId;
        }
        note.style.background = backgroundColor;
        note.innerHTML = content;
        view.current.ui.add(note, position);
      } else {
        view.current.ui.remove(noteId);
      }
    }
  }, [slide, slide?.slideContent.slideNote1Enabled]);

  useEffect(() => {
    if (slide) {
      const { slideNote2Enabled, slideNote2 } = slide.slideContent;
      const { backgroundColor, content, position } = slideNote2;
      const noteId = "slide-note-2";
      if (slideNote2Enabled) {
        let note = view.current.ui.find(noteId) as HTMLElement;
        if (!note) {
          note = document.createElement("div");
          note.id = noteId;
        }
        note.style.background = backgroundColor;
        note.innerHTML = content;
        view.current.ui.add(note, position);
      } else {
        view.current.ui.remove(noteId);
      }
    }
  }, [slide, slide?.slideContent.slideNote2Enabled]);

  useEffect(() => {
    if (slide.slideContent.legendEnabled && messages?.legend) {
      const legendWidget = view.current.ui.find("legend") as __esri.Expand;
      legendWidget.expandTooltip = messages?.legend;
      legendWidget.collapseTooltip = messages?.legend;
    }
  }, [slide.slideContent.legendEnabled, messages?.legend]);

  useEffect(() => {
    if (messages?.controlPanel) {
      const controlPanelWidget = view.current.ui.find("control-panel") as __esri.Expand;
      controlPanelWidget.expandTooltip = messages?.controlPanel;
      controlPanelWidget.collapseTooltip = messages?.controlPanel;
    }
  }, [messages?.controlPanel]);

  useEffect(() => {
    if (viewReady) {
      handleExtentSelector();
    }
  }, [extentSelector, extentSelectorConfig, handleExtentSelector, viewReady]);

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
        if (classRef === "control-panel") {
          if (controlPanelWidget.current) {
            controlPanelWidget.current.style.display = "block";
          }
        }
      }
    } else {
      view.current.ui.remove(widget);
    }
  }

  function setMapRotation(rotation: number): void {
    if (view.current.type === "2d") {
      if (view.current.constraints && !view.current.constraints.rotationEnabled) {
        view.current.constraints.rotationEnabled = true;
        view.current.rotation = rotation;
        view.current.constraints.rotationEnabled = false;
      } else {
        view.current.rotation = rotation;
      }
    }
  }

  return (
    <div className={CSS.base} ref={mapDiv}>
      <div id="mapDescription" ref={mapDescription} className="sr-only"></div>
      <div id="exhibit-control-panel-widget" ref={controlPanelWidget}>
        <ControlPanel view={view.current} />
      </div>
    </div>
  );
};

export default View;
