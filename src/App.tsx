import { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "./Components/Header/Header";
import CoverPage from "./Components/CoverPage/CoverPage";
import SplashModal from "./Components/SplashModal/SplashModal";
import Telemetry from "./Components/Telemetry/Telemetry";

import { toggleShowMobileMode } from "./redux/slices/mobileSlice";
import { configParamsSelector } from "./redux/slices/configParamsSlice";

import "./App.scss";
import { exhibitSelector } from "./redux/slices/exhibitSlice";
import SlideContainer from "./Components/SlideContainer/SlideContainer";

const CSS = {
  body: "esri-instant-app"
};

const App: FC = (): ReactElement => {
  const { coverPage, coverPageIsVisible, header, theme } = useSelector(configParamsSelector);
  const { openInfo } = useSelector(exhibitSelector);
  const appRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleShowMobileMode(window.innerWidth));
    function handleResize() {
      dispatch(toggleShowMobileMode(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, header]);

  useEffect(() => {
    if (!coverPage) {
      const container = appRef.current;
      container.style.overflow = "";
      container.style.position = "";
      container.style.top = "0";
      container.style.transition = "";
    }
  }, [coverPage]);

  return (
    <div className="App" ref={appRef}>
      {coverPage && <CoverPage />}
      <div id="srLive" aria-live="polite" className="sr-only"></div>
      <div id="instant-app-container" className={CSS.body} data-theme={theme}>
        {header && <Header />}
        <SlideContainer />
        {openInfo && !coverPageIsVisible && <SplashModal />}
        <Telemetry />
      </div>
    </div>
  );
};

export default App;
