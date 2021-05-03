import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import Feature from "@arcgis/core/widgets/Feature";

import { getMessageBundlePath } from "../../utils/t9nUtils";
import LeaderboardT9n from "../../t9n/Leaderboard/resources.json";

import "./Leaderboard.scss";

import { CompareGraphic, SectionState } from "../../types/interfaces";
import { popupSelector, addCompareGraphic, toggleCompareGraphicActive } from "../../redux/slices/popupSlice";
import { updateCurrentSection } from "../../redux/slices/sectionsSlice";
import { getPopupTitle } from "../../utils/utils";

const CSS = {
  base: "esri-countdown-app__leaderboard",
  container: "esri-countdown-app__leaderboard-container",
  content: "esri-countdown-app__leaderboard-content",
  itemContent: "esri-countdown-app__leaderboard-item-content",
  search: "esri-countdown-app__leaderboard-search"
};

interface LeaderboardItemProps {
  compareGraphics: CompareGraphic[];
  graphic: __esri.Graphic;
  pin: string;
}

interface LeaderboardProps {
  section: SectionState;
}

const LeaderboardItem: FC<LeaderboardItemProps> = ({ compareGraphics, graphic, pin }): ReactElement => {
  const [title, setTitle] = useState<string>(null);
  const feature = useRef<__esri.Feature>(null);
  const contentEl = useRef<HTMLDivElement>(null);
  const pinCheckbox = useRef<HTMLCalciteCheckboxElement>(null);
  const accordionItem = useRef<HTMLCalciteAccordionItemElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (pinCheckbox.current && !pinCheckbox.current?.shadowRoot?.getElementById("checkbox-style")) {
      const checkboxStyle = document.createElement("style");
      checkboxStyle.id = "checkbox-style";
      checkboxStyle.innerHTML = "svg { border-radius: 50% }";
      pinCheckbox.current?.shadowRoot.prepend(checkboxStyle);
    }
  }, [pin]);

  useEffect(() => {
    if (!accordionItem.current.shadowRoot.getElementById("accordion-item-style")) {
      const style = document.createElement("style");
      style.id = "accordion-item-style";
      style.innerHTML = `.accordion-item-header,.accordion-item-content { border-radius: 6px; }
        .accordion-item-content { padding-top: 24px!important; }
        :host([active]) .accordion-item-header {
          border-bottom-color: #e9e9e9!important;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
        }`;
      accordionItem.current.shadowRoot.prepend(style);
    }
  }, []);

  useEffect(() => {
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
  }, [graphic]);

  useEffect(() => {
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
  }, [compareGraphics, graphic, pin]);

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
    <calcite-accordion scale="l">
      <calcite-accordion-item ref={accordionItem} item-title={title}>
        <div className={CSS.itemContent}>
          {pin && (
            <calcite-checkbox ref={pinCheckbox} scale="s" onClick={handleCheckboxClick}>
              {pin}
            </calcite-checkbox>
          )}
          <div id="feature-node" ref={contentEl} className={CSS.content} />
        </div>
      </calcite-accordion-item>
    </calcite-accordion>
  );
};

const Leaderboard: FC<LeaderboardProps> = ({ section }): ReactElement => {
  const [messages, setMessages] = useState<typeof LeaderboardT9n>(null);
  const leaderboard = useRef<__esri.Graphic[]>([]);
  const { compareGraphics } = useSelector(popupSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Leaderboard"));
      setMessages(data);
    }
    fetchMessages();
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section.position]);

  useEffect(() => {
    for (let i = 0; i < section.featuresDisplayed; i++) {
      leaderboard.current.push(section.features[i]);
    }
  }, [section.features, section.featuresDisplayed]);

  return (
    <div className={CSS.base}>
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
        {leaderboard.current.map((graphic, index) => {
          return (
            <LeaderboardItem
              key={`leaderboard-item-${index}`}
              compareGraphics={compareGraphics}
              graphic={graphic}
              pin={messages?.pin}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
