import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import HeaderT9n from "../../t9n/Header/resources.json";
import { mobileSelector } from "../../redux/slices/mobileSlice";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { mapSelector } from "../../redux/reducers/map";
import { portalSelector } from "../../redux/slices/portalSlice";
import { handlePaneHeight } from "../../utils/utils";
import { SharedTheme } from "../../types/interfaces";
import { useMessages } from "../../hooks/useMessages";

import "./Header.scss";

const CSS = {
  base: "esri-instant-app__header",
  container: "esri-instant-app__header-container",
  titleContainer: "esri-instant-app__header-title-container",
  dropdownContainer: "esri-instant-app__header-dropdown-container"
};

interface DropdownItemProps {
  active: boolean;
  index: number;
  title: string;
}

interface HeaderLogoProps {
  sharedTheme: SharedTheme;
}

const DropdownItem: FC<DropdownItemProps> = ({ active, index, title }): ReactElement => {
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
      data-position={index}
      data-active={active}
    >
      {title}
    </calcite-dropdown-item>
  );
};

const HeaderLogo: FC<HeaderLogoProps> = ({ sharedTheme }): ReactElement => {
  const logo = sharedTheme?.logo?.small;
  const logoLink = sharedTheme?.logo?.link;
  const logoImg = logo ? <img src={logo} alt="logo" /> : null;
  if (logoImg) {
    return logoLink ? (
      <a rel="noreferrer noopener" target="_blank" href={logoLink}>
        {logoImg}
      </a>
    ) : (
      logoImg
    );
  } else {
    return null;
  }
};

const Header: FC = (): ReactElement => {
  const { applySharedTheme, header, title, titleLink } = useSelector(configParamsSelector);
  const { showMobileMode } = useSelector(mobileSelector);
  const { portalProperties } = useSelector(portalSelector);
  const map = useSelector(mapSelector);
  const messages: typeof HeaderT9n = useMessages("Header");
  const [headerTitle, setHeaderTitle] = useState<string>(null);
  const dropdown = useRef<HTMLCalciteDropdownElement>(null);
  const headerTitleEl = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dropdown.current?.addEventListener("calciteDropdownSelect", () => {
      const item = dropdown.current.selectedItems?.[0];
      if (item) {
        console.log('item: ',item);
      }
    });
  }, [dispatch, showMobileMode]);

  useEffect(() => {
    setHeaderTitle(title ? title : map?.portalItem?.title);
  }, [map?.portalItem?.title, title]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const checkHeader = header || showMobileMode;
      handlePaneHeight(checkHeader, headerTitleEl.current);
    });
    resizeObserver.observe(headerTitleEl.current);
  }, [header, showMobileMode]);

  return (
    <div ref={headerTitleEl} className={CSS.base}>
      {showMobileMode && (
        <div className={CSS.dropdownContainer}>
          <calcite-dropdown ref={dropdown} type="hover">
            <calcite-button slot="dropdown-trigger" label={messages?.menu} icon-start="hamburger" scale="l" />
            <calcite-dropdown-group>
              {["First","Second","Third"].map((item, index) => (
                <DropdownItem
                  key={`${item}-${index}`}
                  index={index}
                  title={item}
                  active={index === 0}
                />
              ))}
            </calcite-dropdown-group>
          </calcite-dropdown>
        </div>
      )}
      {header && (
        <div className={CSS.container}>
          {applySharedTheme && <HeaderLogo sharedTheme={portalProperties?.sharedTheme} />}
          <div className={CSS.titleContainer}>
            <h1>
              {titleLink ? (
                <a target="_blank" rel="noopener noreferrer" href={titleLink}>
                  {headerTitle}
                </a>
              ) : headerTitle}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
