import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { telemetrySelector } from "../../redux/slices/telemetrySlice";
import { portalSelector } from "../../redux/slices/portalSlice";
import { themeSelector } from "../../redux/slices/themeSlice";
import TelemetryInstance from "./telemetry/telemetry";
import { TelemetryState, Theme } from "../../types/interfaces";

const CSS = {
  optOutButton: "esri-instant-app__opt-out-button"
};

interface AlertProps extends TelemetryState {
  theme: Theme;
  handleClick: () => void;
}

const Alert: FC<AlertProps> = ({
  googleAnalytics,
  googleAnalyticsKey,
  googleAnalyticsConsent,
  googleAnalyticsConsentMsg,
  handleClick,
  telemetry,
  theme
}): ReactElement => {
  const enableGA = localStorage.getItem(`analytics-opt-in-${telemetry.name}`) ?? false;
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
  const [initTelemetry, setInitTelemetry] = useState<boolean>(false);
  const [telemetryInstance, setTelemetryInstance] = useState<TelemetryInstance>(null);
  const [optIn, setOptIn] = useState<boolean>(false);
  const createTelemetry = useCallback(async () => {
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
  }, [googleAnalytics, googleAnalyticsConsent, googleAnalyticsConsentMsg, googleAnalyticsKey, portal, telemetry]);

  useEffect(() => {
    if (googleAnalytics && googleAnalyticsKey && googleAnalyticsConsent && googleAnalyticsConsentMsg) {
      setInitTelemetry(true);
      createTelemetry();
    }
  }, [createTelemetry, googleAnalytics, googleAnalyticsConsent, googleAnalyticsConsentMsg, googleAnalyticsKey, optIn]);

  function handleClick(): void {
    localStorage.setItem(`analytics-opt-in-${telemetry.name}`, "true");
    setOptIn(true);
  }

  return (
    initTelemetry &&
    telemetryInstance && (
      <Alert
        googleAnalytics={googleAnalytics}
        googleAnalyticsKey={googleAnalyticsKey}
        googleAnalyticsConsent={googleAnalyticsConsent}
        googleAnalyticsConsentMsg={googleAnalyticsConsentMsg}
        handleClick={handleClick}
        telemetry={telemetry}
        theme={theme}
      />
    )
  );
};

export default Telemetry;
