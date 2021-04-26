import { FC, ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/actions";

const ConfigurationSettings: FC = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    function handleConfigurationUpdates(e) {
      if (e?.data?.type === "cats-app") {
        const dataKeys = Object.keys(e.data);
        const key = dataKeys.filter((key) => key !== "type")[0];
        if (actions[key]) {
          dispatch(actions[key](e.data[key]));
        } else {
          console.error("Error: Missing action")
        }
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
