import { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "./Components/Header/Header";
import View from "./Components/View/View";
import Modal from "./Components/Modal/Modal";
import Telemetry from "./Components/Telemetry/Telemetry";

import { toggleShowMobileMode } from "./redux/slices/mobileSlice";
import { configParamsSelector } from "./redux/slices/configParamsSlice";

import "./App.scss";

const CSS = {
  body: "esri-instant-app__body"
};

const App: FC = (): ReactElement => {
  const { header, splash, splashOnStart, theme } = useSelector(configParamsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleShowMobileMode(window.innerWidth));
    function handleResize() {
      dispatch(toggleShowMobileMode(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, header]);

  return (
    <div className="App">
      <div id="srLive" aria-live="polite" className="sr-only"></div>
      <div id="instant-app-container" className={CSS.body} data-theme={theme}>
        {header && <Header />}
        <View />
        {splash && splashOnStart && <Modal />}
        <Telemetry />
      </div>
    </div>
  );
};

export default App;
