import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feature from "@arcgis/core/widgets/Feature";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import CountdownT9n from "../../t9n/Countdown/resources.json";

import "./Countdown.scss";

import { popupSelector, addCompareGraphic, toggleCompareGraphicActive } from "../../redux/slices/popupSlice";
import { SectionState } from "../../types/interfaces";
import { updateCurrentSection } from "../../redux/slices/sectionsSlice";

import Paging from "../Paging/Paging";
import { mobileSelector } from "../../redux/slices/mobileSlice";

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
  const { activeComparePanels, compareGraphics, featureIndex } = useSelector(popupSelector);
  const { showMobileMode } = useSelector(mobileSelector);
  const [messages, setMessages] = useState<typeof CountdownT9n>(null);
  const [title, setTitle] = useState<string>(null);
  const contentEl = useRef<HTMLDivElement>(null);
  const countdownEl = useRef<HTMLDivElement>(null);
  const pinCheckbox = useRef<HTMLCalciteCheckboxElement>(null);
  const feature = useRef<__esri.Feature>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Countdown"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section?.graphics?.length, section.position]);

  useEffect(() => {
    if (!pinCheckbox.current?.shadowRoot?.getElementById("checkbox-style")) {
      const checkboxStyle = document.createElement("style");
      checkboxStyle.id = "checkbox-style";
      checkboxStyle.innerHTML = "svg { border-radius: 50% }";
      pinCheckbox.current?.shadowRoot.prepend(checkboxStyle);
    }
  }, [messages?.pin, showMobileMode]);

  useEffect(() => {
    const graphic = section?.graphics?.[featureIndex];
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
      if (pinCheckbox.current) {
        let checked = false;
        for (const compare of compareGraphics) {
          if (compare.active && compare.title === graphic.rankTitle) {
            checked = true;
          }
        }

        if (!checked && activeComparePanels === 2) {
          pinCheckbox.current.disabled = true;
        } else {
          pinCheckbox.current.disabled = false;
        }
        pinCheckbox.current.checked = checked;
      }
      setTitle(graphic.rankTitle);
    }
  }, [activeComparePanels, compareGraphics, featureIndex, section?.graphics]);

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
      <div className={CSS.container}>
        <h2 className={CSS.title}>{title}</h2>
        {!showMobileMode && messages?.pin && (
          <calcite-checkbox ref={pinCheckbox} scale="s" onClick={handleCheckboxClick}>
            {messages?.pin}
          </calcite-checkbox>
        )}
        <div id="feature-node" ref={contentEl} className={CSS.content} />
      </div>
      {showMobileMode && <Paging section={section} />}
    </div>
  );
};

export default Countdown;
