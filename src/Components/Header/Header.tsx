import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessageBundle } from "@arcgis/core/intl";

import HeaderT9n from "../../t9n/Header/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";

import { activeToggle, sectionsSelector } from "../../redux/slices/sectionsSlice";

import "./Header.scss";
import { mobileSelector } from "../../redux/slices/mobileSlice";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";

const CSS = {
  base: "esri-countdown-app__header",
  container: "esri-countdown-app__header-container",
  dropdownContainer: "esri-countdown-app__header-dropdown-container"
};

interface DropdownItemProps {
  index: number;
  icon: string;
  title: string;
}

const DropdownItem: FC<DropdownItemProps> = ({ icon, index, title }): ReactElement => {
  const dropdownItem = useRef<HTMLCalciteDropdownItemElement>(null);

  useEffect(() => {
    if (!document.getElementById(`title-${index}`)) {
      const itemStyle = document.createElement("style");
      itemStyle.innerHTML = `:host::before {
        content: unset!important;
      }`;
      itemStyle.id = `title-${index}`;
      dropdownItem.current.shadowRoot.prepend(itemStyle);
    }
  }, [index]);

  return (
    <calcite-dropdown-item ref={dropdownItem} key={`${title}-${index}`} icon-start={icon} data-position={index}>
      {title}
    </calcite-dropdown-item>
  );
};

const Header: FC = (): ReactElement => {
  const [messages, setMessages] = useState<typeof HeaderT9n>(null);
  const { title } = useSelector(configParamsSelector);
  const { sections } = useSelector(sectionsSelector);
  const { showMobileMode } = useSelector(mobileSelector);
  const dropdown = useRef<HTMLCalciteDropdownElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Header"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    dropdown.current?.addEventListener("calciteDropdownSelect", () => {
      const item = dropdown.current.selectedItems?.[0];
      if (item) {
        dispatch(activeToggle(parseInt(item.dataset?.position)));
      }
    });
  }, [dispatch, showMobileMode]);

  return (
    <div className={CSS.base}>
      {showMobileMode && (
        <div className={CSS.dropdownContainer}>
          <calcite-dropdown ref={dropdown} type="hover">
            <calcite-button slot="dropdown-trigger" label={messages?.menu} icon-start="hamburger" scale="l" />
            <calcite-dropdown-group>
              {sections.map((item, index) => (
                <DropdownItem key={`${item.navTitle}-${index}`} icon={item.icon} index={index} title={item.title} />
              ))}
            </calcite-dropdown-group>
          </calcite-dropdown>
        </div>
      )}
      <div className={CSS.container}>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Header;
