import React, { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

import Header from "./Components/Header/Header";
import View from "./Components/View/View";
import Modal from "./Components/Modal/Modal";

import "./App.scss";
import { ApplicationConfig } from "./ApplicationBase/interfaces";
import { splashSelector } from "./redux/slices/splashSlice";

interface AppProps {
  portal?: __esri.Portal;
  config?: ApplicationConfig;
  webmap?: string;
  setWebmap?: any;
}

const App: FC<AppProps> = (): ReactElement => {
  const { splash, splashOnStart } = useSelector(splashSelector);
  return (
    <div className="App">
      <Header />
      <View />
      {splash && splashOnStart && <Modal />}
    </div>
  );
};

export default App;
