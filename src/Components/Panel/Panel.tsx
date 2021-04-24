import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import PanelT9n from "../../t9n/Panel/resources.json";
import Intro from "../Intro/Intro";
import Countdown from "../Countdown/Countdown";
import Summary from "../Summary/Summary";
import Paging from "../Paging/Paging";
import View from "../View/View";

import "./Panel.scss";
import { SectionState } from "../../types/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { activeToggle, sectionsSelector, updateFeatures } from "../../redux/slices/sectionsSlice";
import { mapSelector } from "../../redux/reducers/map";

const CSS = {
  base: "esri-countdown-app__panel",
  header: "esri-countdown-app__panel-header",
  container: "esri-countdown-app__panel-container",
  search: "esri-countdown-app__panel-search"
};

interface ActionProps {
  icon: string;
  handleClick: () => void;
  active: boolean;
  title: string;
}

function updatePane(section: SectionState, index: number): ReactElement {
  if (section.active) {
    if (section.type === "intro") {
      return (
        <Intro
          key={`${section.title}-${index}`}
          title={section.title}
          content={section.content}
          position={section.position}
        />
      );
    } else if (section.type === "countdown") {
      return <Countdown key={`${section.title}-${index}`} section={section} />;
    } else if (section.type === "summary") {
      return <Summary key={`${section.title}-${index}`} title={section.title} content={section.content} />;
    }
  }
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
  const actionBar = useRef<HTMLCalciteActionBarElement>(null);
  const shellPanel = useRef<HTMLCalciteShellPanelElement>(null);
  const map = useSelector(mapSelector);
  const layers = useRef<__esri.Collection<__esri.Layer>>(map.layers)
  const sectionsRef = useRef<SectionState[]>(sections)
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Panel"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect((): any => {
    if (!document.getElementById("shell-panel-style")) {
      const style = document.createElement("style");
      style.innerHTML = ".content { width: 30vw!important; }";
      style.id = "shell-panel-style";
      shellPanel.current?.shadowRoot?.prepend(style);
    }
  }, []);

  useEffect(() => {
    async function calculateStatistics(section: SectionState) {
      const layer = layers.current.find(({ id }) => id === section.layerId) as __esri.FeatureLayer;
      if (layer && layer.type === "feature") {
        const query = layer.createQuery();
        query.where = "1=1";
        const fieldName = section.field;
        if (fieldName) {
          query.orderByFields = [`${fieldName} ${section.order}`];
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
      <calcite-shell>
        <View />
        <calcite-shell-panel ref={shellPanel} slot="contextual-panel" position="end">
          <calcite-action-bar ref={actionBar} expanded="true" slot="action-bar" theme="dark">
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
          <div className={CSS.header}>
            <p>Top counties in Virginia</p>
          </div>
          <div className={CSS.container}>
            {sections.map((section, index) => {
              return updatePane(section, index);
            })}
          </div>
          {sections.map((section, index) => {
            return (
              section.active &&
              section.type === "countdown" && <Paging key={`${section.title}-${index}`} section={section} />
            );
          })}
        </calcite-shell-panel>
      </calcite-shell>
    </div>
    //     {/* <calcite-input
    //       class={CSS.search}
    //       scale="s"
    //       type="search"
    //       placeholder={messages?.placeholder}
    //       icon="search"
    //       autocomplete="off"
    //       theme="dark"
    //     /> */}
  );
};

export default Panel;
