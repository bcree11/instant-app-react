import React, { FC, ReactElement, useEffect } from "react";
import { ApplicationConfig } from "../../ApplicationBase/interfaces";
import "./Header.scss";
import { useTypedSelector } from "../../redux/reducers";

interface HeaderProps {
  title?: string;
  config?: ApplicationConfig;
  setTitle?: (title: string) => void;
}

const CSS = {
  base: "esri-map-series__header"
};

const Header: FC<HeaderProps> = (props): ReactElement => {
  const { title } = useTypedSelector(state => state.header);

  useEffect(() => {
  }, []);

  return <header className={CSS.base}>{title}</header>;
};

export default Header;
