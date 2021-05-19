import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import PanelT9n from "../../t9n/Panel/resources.json";

import Intro from "../Intro/Intro";
import Countdown from "../Countdown/Countdown";
import Leaderboard from "../Leaderboard/Leaderboard";
import Summary from "../Summary/Summary";
import Paging from "../Paging/Paging";
import NextButton from "../NextButton/NextButton";
import Header from "../Header/Header";

import "./Panel.scss";

import { IGraphic, SectionState } from "../../types/interfaces";
import { activeToggle, sectionsSelector, updateFilters, updateGraphics } from "../../redux/slices/sectionsSlice";
import { mapSelector } from "../../redux/reducers/map";
import { getPopupTitle } from "../../utils/utils";
import { mobileSelector } from "../../redux/slices/mobileSlice";
import View from "../View/View";
import Filter from "../Filter/Filter";
import MobileSwitch from "../MobileSwitch/MobileSwitch";

const CSS = {
  base: "esri-countdown-app__panel",
  header: "esri-countdown-app__panel-header",
  pane: "esri-countdown-app__panel-pane",
  paneContainer: "esri-countdown-app__panel-pane-container",
  viewContainer: "esri-countdown-app__panel-view-container",
  search: "esri-countdown-app__panel-search",
  section: "esri-countdown-app__panel-section"
};

interface ActionProps {
  active: boolean;
  disabled: boolean;
  icon: string;
  title: string;
  handleClick: () => void;
}

const Action: FC<ActionProps> = ({ active, disabled, icon, title, handleClick }): ReactElement => {
  const action = useRef<HTMLCalciteActionElement>(null);

  useEffect(() => {
    action.current.active = active;
    action.current.addEventListener("click", handleClick);
  }, [active, handleClick]);

  return (
    <calcite-action
      ref={action}
      text={title}
      icon={icon}
      appearance="solid"
      scale="m"
      text-enabled
      // disabled={disabled}
    />
  );
};

const Panel: FC = (): ReactElement => {
  const [messages, setMessages] = useState<typeof PanelT9n>(null);
  const [isFeatureSection, setIsFeatureSection] = useState<boolean>(false);
  const { currentSection, sections } = useSelector(sectionsSelector);
  const map = useSelector(mapSelector);
  const { showMap, showMobileMode, showSection } = useSelector(mobileSelector);
  const sectionEl = useRef<HTMLDivElement>(null);
  const actionBar = useRef<HTMLCalciteActionBarElement>(null);
  const layers = useRef<__esri.Collection<__esri.Layer>>(map.layers);
  const sectionsRef = useRef<SectionState[]>(sections);
  const dispatch = useDispatch();
  const filterBy = (section: SectionState, index: number): ReactElement => {
    const { active, title, type } = section;
    if (active && type === "leaderboard") {
      return <Filter key={`${title}-${index}`} section={section} />;
    }
  };
  const pane = (section: SectionState, index: number): ReactElement => {
    const { active, title, type } = section;
    if (active) {
      if (type === "intro") {
        return <Intro key={`${title}-${index}`} section={section} />;
      } else if (type === "countdown") {
        return <Countdown key={`${title}-${index}`} section={section} />;
      } else if (type === "leaderboard") {
        return <Leaderboard key={`${title}-${index}`} section={section} />;
      } else if (type === "summary") {
        return <Summary key={`${title}-${index}`} section={section} />;
      }
    }
  };
  const footer = (section: SectionState, lastIndex: number): ReactElement => {
    const { active, buttonText, position, type } = section;
    const nextPosition = position + 1;
    if (active && type === "intro" && position !== lastIndex) {
      return <NextButton key={`footer-${position}`} nextPosition={nextPosition} text={buttonText} />;
    } else if (active && type === "countdown" && position !== lastIndex && !showMobileMode) {
      return <Paging key={`footer-${position}`} section={section} />;
    } else if (active && type === "leaderboard" && position !== lastIndex) {
      return <NextButton key={`footer-${position}`} nextPosition={nextPosition} text={buttonText} />;
    } else if (active && type === "summary" && position !== lastIndex) {
      return <NextButton key={`footer-${position}`} nextPosition={nextPosition} text={buttonText} />;
    }
  };

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Panel"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    async function calculateStatistics(section: SectionState): Promise<IGraphic[]> {
      const { field, layerId, order } = section;
      const layer = layers.current.find(({ id }) => id === layerId) as __esri.FeatureLayer;
      if (layer && layer.type === "feature") {
        const query = layer.createQuery();
        query.where = "1=1";
        if (field) {
          query.orderByFields = [`${field} ${order}`];
          query.outFields = ["*"];
          const results = await layer.queryFeatures(query);
          return results.features as IGraphic[];
        }
      }
    }
    function setSectionGraphics(): void {
      sectionsRef.current.map(async (section, index) => {
        if (section.type === "countdown" || section.type === "leaderboard") {
          const filters: string[] = [];
          const graphics = await calculateStatistics(section);
          graphics.forEach((item, i) => {
            if (item.attributes?.[section?.filterField] && !filters.includes(item.attributes?.[section?.filterField])) {
              filters.push(item.attributes?.[section?.filterField]);
            }
            if (i > 0) {
              const prevItem = graphics[i - 1];
              if (prevItem.attributes[section.field] === item.attributes[section.field]) {
                item.rank = prevItem.rank;
              } else {
                item.rank = i + 1;
              }
            } else {
              item.rank = 1;
            }
            item.title = getPopupTitle(item);
            item.rankTitle = `${item.rank}. ${item.title}`;
            if (section.type === "leaderboard") {
              item.active = true;
            }
          });
          filters.sort();
          dispatch(updateGraphics({ index, graphics }));
          dispatch(updateFilters({ index, filters }));
        }
      });
    }
    setSectionGraphics();
  }, [dispatch]);

  useEffect(() => {
    setIsFeatureSection(currentSection?.type === "countdown" || currentSection?.type === "leaderboard");
  }, [currentSection?.type]);

  return (
    <div className={CSS.base}>
      <Header />
      <div className={CSS.paneContainer}>
        <div>
          <div ref={sectionEl} className={CSS.section}>
            {sections.map((section, index) => {
                return filterBy(section, index);
              })}
            {showMobileMode && (
              <div
                key="mobile-view"
                className={CSS.viewContainer}
                data-type={currentSection?.type}
                data-show-map={showMap}
                data-show-section={showSection}
              >
                <View />
              </div>
            )}
            <div
              className={CSS.pane}
              data-type={currentSection?.type}
              data-show-map={showMap}
              data-show-section={showSection}
            >
              {sections.map((section, index) => {
                return pane(section, index);
              })}
            </div>
          </div>
          {sections.map((section, index) => {
            const lastIndex = sections.length - 1;
            if (sectionEl.current) {
              if (section.active && index === lastIndex) {
                sectionEl.current.style.height = "100%";
              } else {
                sectionEl.current.style.height =
                  showMobileMode && isFeatureSection ? "calc(100% - 44px)" : "calc(100% - 55px)";
              }
            }
            if (showMobileMode && isFeatureSection) {
              return null;
            }
            return footer(section, lastIndex);
          })}
          {sections.map((section) => {
            return showMobileMode && section.active && isFeatureSection && <MobileSwitch key="mobile-switch" />;
          })}
        </div>
        {!showMobileMode && (
          <calcite-action-bar ref={actionBar} expanded="true" theme="dark">
            <calcite-action-group layout="vertical">
              {sections.map((action, index) => (
                <Action
                  key={`${action.navTitle}-${index}`}
                  active={action.active}
                  disabled={false}
                  icon={action.icon}
                  title={action.navTitle}
                  handleClick={() => dispatch(activeToggle(index))}
                />
              ))}
            </calcite-action-group>
          </calcite-action-bar>
        )}
      </div>
    </div>
  );
};

export default Panel;
