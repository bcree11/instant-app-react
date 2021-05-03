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

import "./Panel.scss";

import { SectionState } from "../../types/interfaces";
import { activeToggle, sectionsSelector, updateFeatures } from "../../redux/slices/sectionsSlice";
import { mapSelector } from "../../redux/reducers/map";

const CSS = {
  base: "esri-countdown-app__panel",
  header: "esri-countdown-app__panel-header",
  pane: "esri-countdown-app__panel-pane",
  paneContainer: "esri-countdown-app__panel-pane-container",
  search: "esri-countdown-app__panel-search",
  section: "esri-countdown-app__panel-section"
};

interface ActionProps {
  icon: string;
  handleClick: () => void;
  active: boolean;
  title: string;
}

const Action: FC<ActionProps> = ({ active, handleClick, icon, title }): ReactElement => {
  const action = useRef<HTMLCalciteActionElement>(null);

  useEffect(() => {
    action.current.active = active;
    action.current.addEventListener("click", handleClick);
  }, [active, handleClick]);

  return <calcite-action ref={action} text={title} icon={icon} appearance="solid" scale="m" text-enabled />;
};

const Panel: FC = (): ReactElement => {
  const [messages, setMessages] = useState<typeof PanelT9n>(null);
  const { sections } = useSelector(sectionsSelector);
  const map = useSelector(mapSelector);
  const sectionEl = useRef<HTMLDivElement>(null);
  const actionBar = useRef<HTMLCalciteActionBarElement>(null);
  const layers = useRef<__esri.Collection<__esri.Layer>>(map.layers);
  const sectionsRef = useRef<SectionState[]>(sections);
  const dispatch = useDispatch();
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
    } else if (active && type === "countdown" && position !== lastIndex) {
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
    async function calculateStatistics(section: SectionState) {
      const { field, layerId, order } = section;
      const layer = layers.current.find(({ id }) => id === layerId) as __esri.FeatureLayer;
      if (layer && layer.type === "feature") {
        const query = layer.createQuery();
        query.where = "1=1";
        const fieldName = field;
        if (fieldName) {
          query.orderByFields = [`${fieldName} ${order}`];
          query.outFields = ["*"];
          const results = await layer.queryFeatures(query);
          return results.features;
        }
      }
    }
    async function setSectionFeatures() {
      sectionsRef.current.map(async (section, index) => {
        if (section.type === "countdown" || section.type === "leaderboard") {
          const features = await calculateStatistics(section);
          dispatch(updateFeatures({ index, features }));
        }
      });
    }
    setSectionFeatures();
  }, [dispatch]);

  return (
    <div className={CSS.base}>
      <div className={CSS.header}>
        <p>Top counties in Virginia</p>
      </div>
      <div className={CSS.paneContainer}>
        <div>
          <div ref={sectionEl} className={CSS.section}>
            <div className={CSS.pane}>
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
                sectionEl.current.style.height = "calc(100% - 55px)";
              }
            }
            return footer(section, lastIndex);
          })}
        </div>
        <calcite-action-bar ref={actionBar} expanded="true" theme="dark">
          <calcite-action-group layout="vertical">
            {sections.map((action, index) => (
              <Action
                key={`${action.navTitle}-${index}`}
                title={action.navTitle}
                active={action.active}
                icon={action.icon}
                handleClick={() => dispatch(activeToggle(index))}
              />
            ))}
          </calcite-action-group>
        </calcite-action-bar>
      </div>
    </div>
  );
};

export default Panel;
