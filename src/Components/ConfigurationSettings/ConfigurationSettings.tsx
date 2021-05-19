import { FC, ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";

import { updateConfigParam } from "../../redux/slices/configParamsSlice";

const ConfigurationSettings: FC = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    function handleConfigurationUpdates(e: MessageEvent) {
      if (e?.data?.type === "cats-app") {
        const dataKeys = Object.keys(e.data);
        const key = dataKeys.filter((key) => key !== "type")[0];
        dispatch(updateConfigParam({ key, value: e.data[key] }));
      }
    }
    const withinConfigurationExperience: boolean = window.location !== window.parent.location;
    if (withinConfigurationExperience) {
      window.addEventListener("message", handleConfigurationUpdates, false);
    }
  }, [dispatch]);

  return <></>;
};

export default ConfigurationSettings;
