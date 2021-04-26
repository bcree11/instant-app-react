import { FC, ReactElement, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { portalSelector } from "../../redux/slices/portalSlice";
import { headerSelector } from "../../redux/slices/headerSlice";
import { themeSelector } from "../../redux/slices/themeSlice";
import { Theme } from "../../types/interfaces";
import "./Header.scss";

const CSS = {
  base: "esri-instant-app__header",
  baseLight: "esri-instant-app__header--light"
};

interface SharedThemeItem {
  background: string;
  text: string;
}

interface SharedThemeLogoItem {
  small: string;
  link: string;
}

interface SharedTheme {
  header: SharedThemeItem;
  logo: SharedThemeLogoItem;
}

interface HeaderStyle {
  backgroundColor: string;
  color: string;
}

interface LogoProps {
  link: string;
  logo: string;
}

function getDefaultHeaderTheme(theme: Theme): HeaderStyle {
  if (theme === "dark") {
    return {
      backgroundColor: "#242424",
      color: "#fff"
    };
  } else {
    return {
      backgroundColor: "#fff",
      color: "#949494"
    };
  }
}

const Logo: FC<LogoProps> = ({ link, logo }): ReactElement => {
  return link && logo ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <img src={logo} alt="Logo" />
    </a>
  ) : !link && logo ? (
    <img src={logo} alt="Logo" />
  ) : null;
};

const Header: FC = (): ReactElement => {
  const { title } = useSelector(headerSelector);
  const { applySharedTheme, theme } = useSelector(themeSelector);
  const portal = useSelector(portalSelector);
  const [sharedTheme, setSharedTheme] = useState<SharedTheme>(null);
  const headerRef = useRef<HTMLElement>(null);
  const sharedThemeLogo = useRef<LogoProps>({
    logo: portal?.portalProperties?.sharedTheme?.logo?.small,
    link: portal?.portalProperties?.sharedTheme?.logo?.link
  });

  useLayoutEffect(() => {
    const { style } = headerRef.current;
    const { backgroundColor, color } = getDefaultHeaderTheme(theme);
    setSharedTheme(portal?.portalProperties?.sharedTheme);
    if (sharedTheme) {
      style.backgroundColor = sharedTheme?.header?.background ?? backgroundColor;
      style.color = sharedTheme?.header?.text ?? color;
      sharedThemeLogo.current.logo = sharedTheme?.logo?.small;
      sharedThemeLogo.current.link = sharedTheme?.logo?.link;
    } else {
      style.backgroundColor = backgroundColor;
      style.color = color;
    }
  }, [headerRef, portal, sharedTheme, theme]);

  return (
    <header ref={headerRef} className={CSS.base}>
      <h1>
        {applySharedTheme && <Logo link={sharedThemeLogo.current.link} logo={sharedThemeLogo.current.logo} />}
        {title}
      </h1>
    </header>
  );
};

export default Header;
