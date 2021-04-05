import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

import Header from "./Components/Header/Header";
import View from "./Components/View/View";
import Modal from "./Components/Modal/Modal";
import Telemetry from "./Components/Telemetry/Telemetry";

import "./App.scss";

import { splashSelector } from "./redux/slices/splashSlice";
import { headerSelector } from "./redux/slices/headerSlice";

const CSS = {
  body: "esri-instant-app__body",
  bodyHeader: "esri-instant-app__body--header"
};

const App: FC = (): ReactElement => {
  const { splash, splashOnStart } = useSelector(splashSelector);
  const { header } = useSelector(headerSelector);

  return (
    <div className="App">
      <div className={CSS.body + ` ${header ? CSS.bodyHeader : ""}`}>
       {header && <Header />}
        <View />
        {splash && splashOnStart && <Modal />}
        <Telemetry />
      </div>
    </div>
  );
};

export default App;
