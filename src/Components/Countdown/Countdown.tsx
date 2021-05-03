import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import Feature from "@arcgis/core/widgets/Feature";

import { getMessageBundlePath } from "../../utils/t9nUtils";
import CountdownT9n from "../../t9n/Countdown/resources.json";

import "./Countdown.scss";

import { popupSelector, addCompareGraphic, toggleCompareGraphicActive } from "../../redux/slices/popupSlice";
import { SectionState } from "../../types/interfaces";
import { updateCurrentSection } from "../../redux/slices/sectionsSlice";
import { getPopupTitle } from "../../utils/utils";

const CSS = {
  base: "esri-countdown-app__countdown",
  container: "esri-countdown-app__countdown-container",
  title: "esri-countdown-app__countdown-title",
  content: "esri-countdown-app__countdown-content",
  search: "esri-countdown-app__countdown-search",
  footer: "esri-countdown-app__countdown-footer"
};

interface CountdownProps {
  section: SectionState;
}

const Countdown: FC<CountdownProps> = ({ section }): ReactElement => {
  const [messages, setMessages] = useState<typeof CountdownT9n>(null);
  const [title, setTitle] = useState<string>(null);
  const contentEl = useRef<HTMLDivElement>(null);
  const countdownEl = useRef<HTMLDivElement>(null);
  const pinCheckbox = useRef<HTMLCalciteCheckboxElement>(null);
  const feature = useRef<__esri.Feature>(null);
  const dispatch = useDispatch();
  const { compareGraphics, featureIndex } = useSelector(popupSelector);

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Countdown"));
      setMessages(data);
    }
    fetchMessages();
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section.position]);

  useEffect(() => {
    if (!pinCheckbox.current?.shadowRoot?.getElementById("checkbox-style")) {
      const checkboxStyle = document.createElement("style");
      checkboxStyle.id = "checkbox-style";
      checkboxStyle.innerHTML = "svg { border-radius: 50% }";
      pinCheckbox.current?.shadowRoot.prepend(checkboxStyle);
    }
  }, [messages?.pin]);

  useEffect(() => {
    const graphic = section?.features?.[featureIndex];
    if (graphic) {
      if (feature.current) {
        feature.current.graphic = graphic;
      } else {
        feature.current = new Feature({
          container: contentEl.current,
          graphic,
          visibleElements: {
            title: false
          }
        });
      }
      setTitle(getPopupTitle(graphic));
    }
  }, [featureIndex, section]);

  useEffect(() => {
    const graphic = section?.features?.[featureIndex];
    if (graphic) {
      const graphicTitle = getPopupTitle(graphic);
      if (pinCheckbox.current) {
        pinCheckbox.current.checked = false;
        for (const compare of compareGraphics) {
          if (compare.active && compare.title === graphicTitle) {
            pinCheckbox.current.checked = true;
          }
        }
      }
    }
  }, [compareGraphics, featureIndex, section?.features]);

  function handleCheckboxClick(): void {
    if (pinCheckbox.current.checked) {
      const compare = {
        active: true,
        graphic: feature.current.graphic,
        title
      };
      dispatch(addCompareGraphic(compare));
    } else {
      dispatch(toggleCompareGraphicActive(title));
    }
  }

  return (
    <div ref={countdownEl} className={CSS.base}>
      <calcite-input
        class={CSS.search}
        scale="s"
        type="search"
        placeholder={messages?.searchPlaceholder}
        icon="search"
        autocomplete="off"
        theme="dark"
      />
      <div className={CSS.container}>
        <h2 className={CSS.title}>{title}</h2>
        {messages?.pin && (
          <calcite-checkbox ref={pinCheckbox} scale="s" onClick={handleCheckboxClick}>
            {messages?.pin}
          </calcite-checkbox>
        )}
        <div id="feature-node" ref={contentEl} className={CSS.content} />
      </div>
    </div>
  );
};

export default Countdown;
