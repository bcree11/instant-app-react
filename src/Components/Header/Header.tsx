import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { portalSelector } from "../../redux/slices/portalSlice";
import { exhibitSelector } from "../../redux/slices/exhibitSlice";
import { SharedTheme } from "../../types/interfaces";

import "./Header.scss";

const CSS = {
  base: "esri-instant-app__header",
  container: "esri-instant-app__header-container",
  titleContainer: "esri-instant-app__header-title-container",
  dropdownContainer: "esri-instant-app__header-dropdown-container"
};

interface HeaderLogoProps {
  sharedTheme: SharedTheme;
}

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
  const { applySharedTheme, header, titleLink } = useSelector(configParamsSelector);
  const { portalProperties } = useSelector(portalSelector);
  const { currentSlide } = useSelector(exhibitSelector);

  return (
    <div className={CSS.base}>
      {header && (
        <div className={CSS.container}>
          {applySharedTheme && <HeaderLogo sharedTheme={portalProperties?.sharedTheme} />}
          <div className={CSS.titleContainer}>
            <h1>
              {titleLink ? (
                <a target="_blank" rel="noopener noreferrer" href={titleLink}>
                  {currentSlide?.slideContent.title}
                </a>
              ) : currentSlide?.slideContent.title}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
