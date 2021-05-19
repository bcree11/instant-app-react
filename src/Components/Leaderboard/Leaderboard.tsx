import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Feature from "@arcgis/core/widgets/Feature";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import LeaderboardT9n from "../../t9n/Leaderboard/resources.json";

import "./Leaderboard.scss";

import { IGraphic, SectionState } from "../../types/interfaces";
import {
  popupSelector,
  addCompareGraphic,
  toggleCompareGraphicActive,
  updateFeatureIndex
} from "../../redux/slices/popupSlice";
import { sectionsSelector, updateCurrentSection } from "../../redux/slices/sectionsSlice";
import { mobileSelector } from "../../redux/slices/mobileSlice";

const CSS = {
  base: "esri-countdown-app__leaderboard",
  container: "esri-countdown-app__leaderboard-container",
  content: "esri-countdown-app__leaderboard-content",
  itemContent: "esri-countdown-app__leaderboard-item-content",
  search: "esri-countdown-app__leaderboard-search-container"
};

interface LeaderboardItemProps {
  graphic: IGraphic;
  index: number;
  pin: string;
}

interface LeaderboardProps {
  section: SectionState;
}

const LeaderboardItem: FC<LeaderboardItemProps> = ({ graphic, index, pin }): ReactElement => {
  const { activeComparePanels, compareGraphics } = useSelector(popupSelector);
  const { showMobileMode } = useSelector(mobileSelector);
  const feature = useRef<__esri.Feature>(null);
  const contentEl = useRef<HTMLDivElement>(null);
  const pinCheckbox = useRef<HTMLCalciteCheckboxElement>(null);
  const accordion = useRef<HTMLCalciteAccordionElement>(null);
  const accordionItem = useRef<HTMLCalciteAccordionItemElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (pinCheckbox.current && !pinCheckbox.current?.shadowRoot?.getElementById("checkbox-style")) {
      const checkboxStyle = document.createElement("style");
      checkboxStyle.id = "checkbox-style";
      checkboxStyle.innerHTML = "svg { border-radius: 50% }";
      pinCheckbox.current?.shadowRoot.prepend(checkboxStyle);
    }
  }, [pin, showMobileMode]);

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
    accordionItem.current.addEventListener("click", (e) => {
      const node = e.target as HTMLCalciteAccordionItemElement;
      if (node.active && !feature.current) {
        feature.current = new Feature({
          container: contentEl.current,
          graphic,
          visibleElements: {
            title: false
          }
        });
      }
      if (node.active) {
        dispatch(updateFeatureIndex(index));
      }
    });
  }, [dispatch, graphic, index]);

  useEffect(() => {
    if (graphic) {
      if (pinCheckbox.current) {
        let checked = false;
        for (const compare of compareGraphics) {
          if (compare.active && compare.title === graphic.title) {
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
    }
  }, [activeComparePanels, compareGraphics, graphic, pin]);

  useEffect(() => {
    if (graphic.active) {
      accordion.current.style.display = "block";
    } else {
      accordion.current.style.display = "none";
    }
  }, [graphic.active]);

  function handleCheckboxClick(): void {
    if (pinCheckbox.current.checked) {
      const compare = {
        active: true,
        graphic: feature.current.graphic,
        title: graphic.title
      };
      dispatch(addCompareGraphic(compare));
    } else {
      dispatch(toggleCompareGraphicActive(graphic.title));
    }
  }

  return (
    <calcite-accordion ref={accordion} scale={showMobileMode ? "m" : "l"}>
      <calcite-accordion-item ref={accordionItem} item-title={graphic.rankTitle}>
        <div className={CSS.itemContent}>
          {!showMobileMode && pin && (
            <calcite-checkbox ref={pinCheckbox} scale="s" onClick={handleCheckboxClick} onKeydown={handleCheckboxClick}>
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
  const { filteredGraphics } = useSelector(sectionsSelector)
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Leaderboard"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    section?.graphics?.forEach((graphic) => (graphic.active = true));
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section?.graphics, section?.graphics?.length, section.position]);

  return (
    <div className={CSS.base}>
      <div className={CSS.container}>
        {filteredGraphics.map((graphic, index) => (
          <LeaderboardItem key={`leaderboard-item-${index}`} index={index} graphic={graphic} pin={messages?.pin} />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
