import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessageBundle } from "@arcgis/core/intl";

import HeaderT9n from "../../t9n/Header/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";

import { activeToggle, sectionsSelector } from "../../redux/slices/sectionsSlice";

import "./Header.scss";
import { mobileSelector } from "../../redux/slices/mobileSlice";

const CSS = {
  base: "esri-countdown-app__header",
  dropdownContainer: "esri-countdown-app__header-dropdown-container"
};

interface DropdownItemProps {
  handleClick: () => void;
  index: number;
  icon: string;
  active: boolean;
  title: string;
}

const DropdownItem: FC<DropdownItemProps> = ({ handleClick, icon, index, active, title }): ReactElement => {
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
      <calcite-dropdown-item
        ref={dropdownItem}
        key={`${title}-${index}`}
        onClick={handleClick}
        onKeypress={handleClick}
        icon-start={icon}
        data-active={active}
      >
        {title}
      </calcite-dropdown-item>
    );
};

const Header: FC = (): ReactElement => {
  const [messages, setMessages] = useState<typeof HeaderT9n>(null);
  const { currentSection, sections } = useSelector(sectionsSelector);
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
    if (!dropdown.current?.shadowRoot?.getElementById("header-dropdown-style")) {
      const style = document.createElement("style");
      style.id = "header-dropdown-style";
      style.innerHTML = `.calcite-dropdown-wrapper { transform: translate(-6px, 50px)!important; }`;
      dropdown.current?.shadowRoot.prepend(style);
    }
    // dropdown.current?.addEventListener("")
  }, [showMobileMode]);

  return (
    <div className={CSS.base}>
      {showMobileMode && (
        <div className={CSS.dropdownContainer}>
          <calcite-dropdown ref={dropdown}>
            <calcite-button slot="dropdown-trigger" label={messages?.menu} icon-start="hamburger" />
            <calcite-dropdown-group>
              {sections.map((item, index) => (
                <DropdownItem
                  key={`${item.navTitle}-${index}`}
                  icon={item.icon}
                  index={index}
                  active={index === currentSection?.position}
                  title={item.title}
                  handleClick={() => dispatch(activeToggle(index))}
                />
              ))}
            </calcite-dropdown-group>
          </calcite-dropdown>
        </div>
      )}
      <p>Top counties in Virginia</p>
    </div>
  );
};

export default Header;
