import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import View from "./Components/View/View";
import Modal from "./Components/Modal/Modal";
import Telemetry from "./Components/Telemetry/Telemetry";
import Panel from "./Components/Panel/Panel";

import "./App.scss";

import { splashSelector } from "./redux/slices/splashSlice";
import { mobileSelector, toggleShowMobileMode } from "./redux/slices/mobileSlice";

const CSS = {
  body: "esri-countdown-app__body",
  viewContainer: "esri-countdown-app__view-container"
};

const App: FC = (): ReactElement => {
  const [isMounted, setIsMounted] = useState<boolean>(null);
  const { splash, splashOnStart } = useSelector(splashSelector);
  const { showMobileMode } = useSelector(mobileSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleShowMobileMode(window.innerWidth));
    const handleResize = () => dispatch(toggleShowMobileMode(window.innerWidth));
    window.addEventListener("resize", handleResize);
    setIsMounted(true);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return (
    <div className="App">
      <div className={CSS.body}>
        {isMounted && (
          <div style={{ display: "flex", height: "100%" }}>
            {!showMobileMode && <View />}
            <Panel />
          </div>
        )}
        {false && splash && splashOnStart && <Modal />}
        <Telemetry />
      </div>
    </div>
  );
};

export default App;
