import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import CountdownT9n from "../../t9n/Countdown/resources.json";

import "./Countdown.scss";
import { popupSelector } from "../../redux/slices/popupSlice";
import { useDispatch, useSelector } from "react-redux";
import { SectionState } from "../../types/interfaces";
import { updateCurrentSection } from "../../redux/slices/sectionsSlice";
import Feature from "@arcgis/core/widgets/Feature";
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
  const { featureIndex } = useSelector(popupSelector);

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Countdown"));
      setMessages(data);
    }
    fetchMessages();
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section.position]);

  useEffect(() => {
    // if (countdownEl.current.clientHeight < countdownEl.current.parentElement.clientHeight) {
    //   countdownEl.current.style.height = `${countdownEl.current.parentElement.clientHeight}px`;
    // }
    if (!document.getElementById("checkbox-style")) {
      const checkboxStyle = document.createElement("style");
      checkboxStyle.id = "checkbox-style";
      checkboxStyle.innerHTML = "svg { border-radius: 50% }";
      pinCheckbox.current?.shadowRoot.prepend(checkboxStyle);
    }
  }, []);

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
        <calcite-checkbox ref={pinCheckbox} scale="s">
          Pin to compare
        </calcite-checkbox>
        <div id="feature-node" ref={contentEl} className={CSS.content}></div>
      </div>
    </div>
  );
};

export default Countdown;
