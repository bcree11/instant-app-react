import React, { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

import Header from "./Components/Header/Header";
import View from "./Components/View/View";
import Modal from "./Components/Modal/Modal";

import "./App.scss";
import { ApplicationConfig } from "./ApplicationBase/interfaces";
import { splashSelector } from "./redux/slices/splashSlice";
import { headerSelector } from "./redux/slices/headerSlice";

interface AppProps {
  portal?: __esri.Portal;
  config?: ApplicationConfig;
  webmap?: string;
  setWebmap?: any;
}

const App: FC<AppProps> = (): ReactElement => {
  const { splash, splashOnStart } = useSelector(splashSelector);
  const { header } = useSelector(headerSelector);

  return (
    <div className="App">
      <div className={`esri-instant__body ${header ? "esri-instant__body--header" : ""}`}>
       {header && <Header />}
        <View />
        {splash && splashOnStart && <Modal />}
      </div>
    </div>
  );
};

export default App;
