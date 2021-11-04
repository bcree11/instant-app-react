import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DistanceMeasurement2D from "@arcgis/core/widgets/DistanceMeasurement2D";
import AreaMeasurement2D from "@arcgis/core/widgets/AreaMeasurement2D";

import Share from "../Share/Share";

import {
  decreaseCurrentSlideIndex,
  exhibitSelector,
  increaseCurrentSlideIndex,
  updateAutoPlaying,
  updateOpenInfo
} from "../../redux/slices/exhibitSlice";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { ISlide, WidgetPosition } from "../../types/interfaces";

import "./ControlPanel.scss";

interface ControlPanelProps {
  slide: ISlide;
  view: __esri.MapView;
}

interface ControlPanelButtonProps {
  active?: boolean;
  actionRef?: React.MutableRefObject<HTMLCalciteActionElement>;
  icon: string;
  id?: string;
  showAction: boolean;
  title: string;
  onClick: Function;
}

interface ExpandedGroupProps {
  currentSlide: ISlide;
  exportToPDF: boolean;
  home: boolean;
  measure: boolean;
  measureRef: React.MutableRefObject<HTMLCalciteActionElement>;
  share: boolean;
  splash: boolean;
  theme: "light" | "dark";
  view: __esri.MapView;
  handleAddMeasureSelector: Function;
}

const CSS = {
  base: "esri-control-panel",
  dark: "esri-control-panel esri-control-panel--dark"
};

const ControlPanelButton: FC<ControlPanelButtonProps> = ({
  actionRef,
  icon,
  id,
  showAction,
  title,
  onClick
}): ReactElement => {
  return (
    showAction && (
      <calcite-action
        id={id}
        ref={actionRef}
        scale="s"
        title={title}
        text={title}
        icon={icon}
        onClick={onClick ? () => onClick() : null}
      ></calcite-action>
    )
  );
};

const ExpandedGroup: FC<ExpandedGroupProps> = ({
  currentSlide,
  exportToPDF,
  home,
  measure,
  measureRef,
  share,
  splash,
  theme,
  view,
  handleAddMeasureSelector
}): ReactElement => {
  const dispatch = useDispatch();

  function handleHomeClick(): void {
    const { goTo } = currentSlide.map;
    view.goTo(goTo, {
      animate: false
    });
  }

  return (
    <calcite-action-group layout="horizontal">
      <ControlPanelButton icon="compass-north-circle" showAction={home} title="Home" onClick={handleHomeClick} />
      <ControlPanelButton
        actionRef={measureRef}
        icon="measure"
        showAction={measure}
        title="Measurement tools"
        onClick={handleAddMeasureSelector}
      />
      <ControlPanelButton
        icon="question"
        showAction={splash}
        title="Open information panel"
        onClick={() => {
          dispatch(updateOpenInfo(true));
        }}
      />
      {share && (
        <calcite-popover-manager>
          <calcite-popover id="share-calcite-popup" reference-element="popover-share-button" disable-pointer>
            <Share view={view} theme={theme} />
          </calcite-popover>
          <ControlPanelButton
            id="popover-share-button"
            title="Toggle share panel"
            icon="share"
            showAction={share}
            onClick={null}
          />
        </calcite-popover-manager>
      )}
      {exportToPDF && <calcite-action scale="s" title="Print" text="Print" icon="file-pdf"></calcite-action>}
    </calcite-action-group>
  );
};

const SlideActionGroup: FC<any> = ({ autoPlay, autoplaying, playButton, handleAutoplaying }): ReactElement => {
  const dispatch = useDispatch();

  return (
    <calcite-action-group layout="horizontal">
      <ControlPanelButton
        title="Previous slide"
        icon="beginning"
        showAction={true}
        onClick={() => {
          dispatch(decreaseCurrentSlideIndex());
        }}
      />
      <ControlPanelButton
        id="control-panel-play-button"
        actionRef={playButton}
        title="Play slides"
        icon={autoplaying ? "pause" : "play"}
        showAction={autoPlay}
        onClick={handleAutoplaying}
      />
      <ControlPanelButton
        title="Next slide"
        icon="end"
        showAction={true}
        onClick={() => {
          dispatch(increaseCurrentSlideIndex());
        }}
      />
    </calcite-action-group>
  );
};

const ControlPanel: FC<ControlPanelProps> = ({ slide, view }): ReactElement => {
  const { autoPlay, autoPlayDuration, controlPanelPosition, exportToPDF, home, measure, share, splash, theme } =
    useSelector(configParamsSelector);
  const { autoPlaying, currentSlide, currentSlideIndex, slides } = useSelector(exhibitSelector);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [addMeasureSelector, setAddMeasureSelector] = useState<boolean>(false);
  const expandButton = useRef<HTMLCalciteActionElement>(null);
  const playButton = useRef<HTMLCalciteActionElement>(null);
  const measureButton = useRef<HTMLCalciteActionElement>(null);
  const measureWidget = useRef<DistanceMeasurement2D | AreaMeasurement2D>(null);
  const interval = useRef<NodeJS.Timeout>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (autoPlay) {
      if (!playButton.current?.shadowRoot?.getElementById("control-panel-play-style")) {
        const style = document.createElement("style");
        style.id = "control-panel-play-style";
        style.innerHTML = `button {
            height: 26px!important;
            width: 26px!important;
            display: flex!important;
            justify-content: center!important;
            border-radius:50%!important;
          }`;
        playButton.current?.shadowRoot?.prepend(style);
      }
    }
  }, [autoPlay]);

  useEffect(() => {
    if (autoPlay) {
      if (autoPlaying && currentSlideIndex < slides.length - 1) {
        if (slide.id === currentSlide.id) {
          const duration = autoPlayDuration * 1000;
          interval.current = setTimeout(() => {
            dispatch(increaseCurrentSlideIndex());
          }, duration);
        }
      } else {
        if (interval.current) {
          clearTimeout(interval.current);
          interval.current = null;
          dispatch(updateAutoPlaying(false));
        }
      }
    }
  }, [
    autoPlay,
    autoPlayDuration,
    autoPlaying,
    currentSlide.id,
    currentSlideIndex,
    dispatch,
    slide.id,
    slides.length,
    theme
  ]);

  useEffect(() => {
    const measureSelector = view.ui.find("measure-widget-bar");
    const removeMeasureWidget = (): void => {
      if (measureWidget.current) {
        view.ui.remove("measure");
        measureWidget.current.destroy();
        measureWidget.current = null;
      }
    };
    const setMeasureWidget = (type: string): void => {
      removeMeasureWidget();
      const measurePosition: WidgetPosition = {
        index: controlPanelPosition.index + 2,
        position: controlPanelPosition.position
      };
      if (type === "distance") {
        measureWidget.current = new DistanceMeasurement2D({
          view,
          id: "measure"
        });
        measureWidget.current.viewModel.start();
        view.ui.add(measureWidget.current, measurePosition);
      } else if (type === "area") {
        measureWidget.current = new AreaMeasurement2D({
          view,
          id: "measure"
        });
        measureWidget.current.viewModel.start();
        view.ui.add(measureWidget.current, measurePosition);
      }
    };
    const closeWidget = (): void => {
      removeMeasureWidget();
      view.ui.remove("measure-widget-bar");
      setAddMeasureSelector(false);
    };
    if (measureButton.current) {
      measureButton.current.active = addMeasureSelector;
    }
    if (addMeasureSelector && !measureSelector) {
      const distance = createMeasureAction(
        "measure-line",
        "Measure line",
        "Measure distance between two or more points",
        () => setMeasureWidget("distance")
      );
      const area = createMeasureAction("measure-area", "Measure area", "Measure area", () => setMeasureWidget("area"));
      const close = createMeasureAction("x", "Close measure widget", "Close measure widget", () => closeWidget());
      const container = document.createElement("div");
      container.id = "measure-widget-bar";
      container.append(distance, area, close);
      const measurePosition: WidgetPosition = {
        index: controlPanelPosition.index + 1,
        position: controlPanelPosition.position
      };
      container.addEventListener("click", (e) => {
        const action = e.target as HTMLCalciteActionElement;
        action.active = true;
        if (action.icon !== "measure-line") {
          distance.active = false;
        }
        if (action.icon !== "measure-area") {
          area.active = false;
        }
      });
      view.ui.add(container, measurePosition);
    } else {
      removeMeasureWidget();
      view.ui.remove("measure-widget-bar");
      setAddMeasureSelector(false);
    }
  }, [addMeasureSelector, controlPanelPosition.index, controlPanelPosition.position, view, view.ui]);

  useEffect(() => {
    if (expandButton.current) {
      expandButton.current.active = expanded;
    }
  }, [expanded]);

  function createMeasureAction(icon: string, title: string, text: string, func: () => void): HTMLCalciteActionElement {
    const action = document.createElement("calcite-action") as HTMLCalciteActionElement;
    action.scale = "m";
    action.title = title;
    action.text = text;
    action.icon = icon;
    action.active = false;
    action.onclick = func;

    return action;
  }

  function handleAddMeasureSelector(): void {
    setAddMeasureSelector(!addMeasureSelector);
  }

  function handleAutoplaying(): void {
    dispatch(updateAutoPlaying(!autoPlaying));
  }

  return (
    <div className={theme === "dark" ? CSS.dark : CSS.base}>
      <calcite-action-pad expand-disabled layout="horizontal" scale="s">
        {(home || measure || splash || share || exportToPDF) && (
          <calcite-action-group layout="horizontal">
            <ControlPanelButton
              actionRef={expandButton}
              icon={expanded ? "caret-right" : "caret-left"}
              showAction={true}
              title="Expand control panel"
              onClick={() => setExpanded(!expanded)}
            />
          </calcite-action-group>
        )}
        {expanded && (
          <ExpandedGroup
            currentSlide={currentSlide}
            exportToPDF={exportToPDF}
            home={home}
            measure={measure}
            measureRef={measureButton}
            share={share}
            splash={splash}
            theme={theme}
            view={view}
            handleAddMeasureSelector={handleAddMeasureSelector}
          />
        )}
        <SlideActionGroup
          autoPlay={autoPlay}
          autoplaying={autoPlaying}
          handleAutoplaying={handleAutoplaying}
          playButton={playButton}
        />
      </calcite-action-pad>
    </div>
  );
};

export default ControlPanel;
