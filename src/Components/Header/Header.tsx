import React, { FC, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { headerSelector } from "../../redux/slices/headerSlice";
import "./Header.scss";

const CSS = {
  base: "esri-countdown__header"
};

const Header: FC = (): ReactElement => {
  const { title } = useSelector(headerSelector);

  useEffect(() => {
  }, []);

  return <header className={CSS.base}>{title}</header>;
};

export default Header;
