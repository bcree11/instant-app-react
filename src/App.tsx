import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

import View from "./Components/View/View";
import Modal from "./Components/Modal/Modal";
import Telemetry from "./Components/Telemetry/Telemetry";
import Panel from "./Components/Panel/Panel";

import "./App.scss";

import { splashSelector } from "./redux/slices/splashSlice";

const CSS = {
  body: "esri-countdown-app__body"
};

const App: FC = (): ReactElement => {
  const { splash, splashOnStart } = useSelector(splashSelector);

  return (
    <div className="App">
      <div className={CSS.body}>
        <div style={{ display: "flex", height: "100%" }}>
          <View />
          <Panel />
        </div>
        {false && splash && splashOnStart && <Modal />}
        <Telemetry />
      </div>
    </div>
  );
};

export default App;
