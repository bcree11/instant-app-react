import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { telemetrySelector, updateGAConsent } from "../../redux/slices/telemetrySlice";
import { portalSelector } from "../../redux/reducers/portal";
import { themeSelector } from "../../redux/slices/themeSlice";
import TelemetryInstance from "./telemetry/telemetry";

const CSS = {
  optOutButton: "esri-instant__opt-out-button"
};

const Alert: FC<any> = ({
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  handleClick,
  telemetry,
  theme
}): ReactElement => {
  const enableGA = localStorage.getItem(`analytics-opt-in-${telemetry.name}`) || false;
  const isActive = googleAnalytics && googleAnalyticsKey !== null && googleAnalyticsConsent && !enableGA ? true : false;
  return (
    <calcite-alert intl-close="Close" scale="s" theme={theme} active={isActive}>
      <div slot="alert-message" dangerouslySetInnerHTML={{ __html: googleAnalyticsConsentMsg }}></div>
      <calcite-button onClick={() => handleClick()} scale="s" slot="alert-link" class={CSS.optOutButton}>
        Opt in
      </calcite-button>
    </calcite-alert>
  );
};

const Telemetry: FC = (): ReactElement => {
  const {
    googleAnalytics,
    googleAnalyticsKey,
    googleAnalyticsConsent,
    googleAnalyticsConsentMsg,
    telemetry
  } = useSelector(telemetrySelector);
  const { theme } = useSelector(themeSelector);
  const portal = useSelector(portalSelector);
  const dispatch = useDispatch();
  const [initTelemetry, setInitTelemetry] = useState<boolean>(false);
  const [telemetryInstance, setTelemetryInstance] = useState<TelemetryInstance>(null);
  const [optIn, setOptIn] = useState<boolean>(false);

  useEffect(() => {
    handleTelemetry();
    if (optIn) {
      createTelemetry();
      setOptIn(false);
      return;
    }
    if (localStorage.getItem(`analytics-opt-in-${telemetry.name}`) && !initTelemetry) {
      setInitTelemetry(true);
      createTelemetry();
      return;
    }
  }, [optIn]);

  function handleTelemetry() {
    if (googleAnalytics && googleAnalyticsKey && googleAnalyticsConsent && googleAnalyticsConsentMsg) {
      setInitTelemetry(true);
      createTelemetry();
    }
  }

  async function createTelemetry() {
    // add alert to container
    const appName = telemetry?.name;
    const telemetryInstance = await TelemetryInstance.init({
      portal,
      config: {
        googleAnalytics,
        googleAnalyticsKey,
        googleAnalyticsConsent,
        googleAnalyticsConsentMsg
      },
      appName
    });

    telemetryInstance?.logPageView();
    setTelemetryInstance(telemetryInstance);
  }

  function handleClick() {
    // Add opt-in value to local storage
    localStorage.setItem(`analytics-opt-in-${telemetry.name}`, "true");
    // update config setting to trigger GA reset and
    // prevent dialog from showing
    dispatch(updateGAConsent(false));
    setOptIn(true);
  }

  return initTelemetry && telemetryInstance ? (
    <Alert
      googleAnalytics={googleAnalytics}
      googleAnalyticsKey={googleAnalyticsKey}
      googleAnalyticsConsent={googleAnalyticsConsent}
      googleAnalyticsConsentMsg={googleAnalyticsConsentMsg}
      handleClick={handleClick}
      telemetry={telemetry}
      theme={theme}
    />
  ) : (
    <></>
  );
};

export default Telemetry;
