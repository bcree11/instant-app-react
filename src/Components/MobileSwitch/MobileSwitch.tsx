import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import MobileSwitchT9n from "../../t9n/MobileSwitch/resources.json";

import "./MobileSwitch.scss";

import { sectionsSelector } from "../../redux/slices/sectionsSlice";
import { mobileSelector, toggleShowMap, toggleShowSection } from "../../redux/slices/mobileSlice";

const CSS = {
  base: "esri-countdown-app__mobile-switch"
};

const MobileSwitch: FC = (): ReactElement => {
  const [messages, setMessages] = useState<typeof MobileSwitchT9n>(null);
  const { currentSection } = useSelector(sectionsSelector);
  const { showMap, showSection } = useSelector(mobileSelector);
  const sectionBtn = useRef<HTMLCalciteButtonElement>(null);
  const mapBtn = useRef<HTMLCalciteButtonElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("MobileSwitch"));
      setMessages(data);
    }
    fetchMessages();
    const style = document.createElement("style");
    style.id = "mobile-btn-style";
    style.innerHTML = `:host button:hover { color: #000!important; background:#e2f3ff!important }`;
    // check active for btn hover
    function handleBtnStyle(button: HTMLCalciteButtonElement): void {
      if (!button.shadowRoot?.getElementById("mobile-btn-style")) {
        button.shadowRoot.prepend(style);
      }
    }
    handleBtnStyle(sectionBtn.current);
    handleBtnStyle(mapBtn.current);
  }, []);

  useEffect(() => {
    const button = mapBtn.current?.shadowRoot.querySelector("button");
    if (button) {
      if (showMap) {
        button.style.background = "#e2f3ff";
      } else {
        button.style.background = "#fff";
      }
    }
  }, [showMap]);

  useEffect(() => {
    const button = sectionBtn.current?.shadowRoot.querySelector("button");
    if (button) {
      if (showSection) {
        button.style.background = "#e2f3ff";
      } else {
        button.style.background = "#fff";
      }
    }
  }, [showSection]);

  function handleMapBtnClick(): void {
    dispatch(toggleShowMap());
  }

  function handleSectionBtnClick(): void {
    dispatch(toggleShowSection());
  }

  return (
    <div className={CSS.base}>
      <calcite-button
        ref={sectionBtn}
        width="half"
        icon-start={currentSection?.icon}
        onClick={handleSectionBtnClick}
        data-active={showSection}
      >
        {messages?.types?.[currentSection?.type]}
      </calcite-button>
      <calcite-button ref={mapBtn} width="half" icon-start="map" onClick={handleMapBtnClick} data-active={showMap}>
        {messages?.map}
      </calcite-button>
    </div>
  );
};

export default MobileSwitch;
