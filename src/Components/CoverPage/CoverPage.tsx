import { FC, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./CoverPage.scss";

import { on } from "@arcgis/core/core/watchUtils";
import Handles from "@arcgis/core/core/Handles";

import { configParamsSelector, updateCoverPageIsVisible } from "../../redux/slices/configParamsSlice";
import { portalSelector } from "../../redux/slices/portalSlice";
import { useIsMounted } from "../../hooks/useIsMounted";
import { updateOpenInfo } from "../../redux/slices/exhibitSlice";

const CSS = {
  base: "esri-cover-page",
  title: "esri-cover-page__title-text",
  subtitle: "esri-cover-page__subtitle-text",
  textContainer: "esri-cover-page__text-container",
  scrollContainer: "esri-cover-page__scroll-container",
  scrollText: "esri-cover-page__scroll-text"
};

const CoverPage: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const { coverPageConfig } = useSelector(configParamsSelector);
  const portal = useSelector(portalSelector);
  const container = useRef<HTMLElement>(null);
  const handles = useRef<__esri.Handles>(new Handles());
  const [token, updateToken] = useState(null);
  const isMounted = useIsMounted();
  const handleBackgroundImgToken = useCallback(() => {
    const { background } = coverPageConfig;
    if (
      background?.backgroundType === "image" &&
      background?.backgroundImage?.url &&
      background.backgroundImage.url.indexOf("resources/media/instantAppsConfigPanel") !== -1
    ) {
      const tokenVal = portal.get("credential.token") as string;

      if (tokenVal) {
        updateToken(tokenVal);
      }
    }
  }, [coverPageConfig, portal]);

  useEffect(() => {
    if (isMounted) {
    }
  }, [isMounted]);

  useEffect(() => {
    dispatch(updateCoverPageIsVisible(true));
    dispatch(updateOpenInfo(false));
    handleBackgroundImgToken();
    const tmpContainer = container.current;
    const tmpHandles = handles.current;
    return () => {
      tmpHandles.removeAll();
      tmpHandles.destroy();
      if (!tmpContainer) {
        return;
      }
      tmpContainer.style.overflow = "";
      tmpContainer.style.position = "";
      tmpContainer.style.top = "0";
      tmpContainer.style.transition = "";
    };
  }, [dispatch, handleBackgroundImgToken]);

  useEffect(() => {
    handles.current.add(
      on(portal, "credential", "token-change", () => {
        handleBackgroundImgToken();
      })
    );
    container.current = document.querySelector(".App");
    if (container.current) {
      container.current.style.position = "relative";
      container.current.style.overflow = "hidden";
      container.current.style.top = "0";
      container.current.style.transition = "top 0.5s ease 0s";
    }
  }, [handleBackgroundImgToken, handles, portal]);

  useEffect(() => {
    handleBackgroundImgToken();
  }, [handleBackgroundImgToken, coverPageConfig?.background]);

  function getBackgroundStyles() {
    const { backgroundImage } = coverPageConfig.background;
    const backgroundImageVal = backgroundImage?.url
      ? token
        ? `url('${backgroundImage?.url}?token=${token}')`
        : `url('${backgroundImage?.url}')`
      : "none";
    return {
      backgroundImage: backgroundImageVal,
      backgroundSize: "cover"
    };
  }

  function renderTextContainer() {
    const { title, titleColor, subtitle, subtitleColor } = coverPageConfig;
    return (
      <div className={CSS.textContainer}>
        <h1 className={CSS.title} style={{ color: titleColor }}>
          {title}
        </h1>
        <span className={CSS.subtitle} style={{ color: subtitleColor }}>
          {subtitle}
        </span>
      </div>
    );
  }

  function renderScrollContainer() {
    const { buttonTextColor } = coverPageConfig;
    return (
      <div className={CSS.scrollContainer}>
        <button
          style={{ color: buttonTextColor }}
          onClick={() => {
            handleScroll();
          }}
        >
          <span className={CSS.scrollText}>{coverPageConfig.buttonText}</span>
          <calcite-icon style={{ color: buttonTextColor }} icon="chevron-down" scale="l" />
        </button>
      </div>
    );
  }

  function handleScroll() {
    container.current.style.top = "-100%";
    container.current.style.overflow = "";
    dispatch(updateCoverPageIsVisible(false));
    dispatch(updateOpenInfo(true));
  }

  const { background } = coverPageConfig;
  const textContainer = renderTextContainer();
  const scrollContainer = renderScrollContainer();
  return (
    <div
      className={CSS.base}
      style={
        background?.backgroundType === "image" && background?.backgroundImage?.url
          ? getBackgroundStyles()
          : {
              backgroundColor: background?.backgroundColor
            }
      }
    >
      {textContainer}
      {scrollContainer}
    </div>
  );
};

export default CoverPage;
