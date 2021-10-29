import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { configParamsSelector, updateConfigParam } from "../../redux/slices/configParamsSlice";
import { updateExhibit } from "../../redux/slices/exhibitSlice";
import { ExtentSelector } from "../../types/interfaces";

const ConfigurationSettings: FC = (): ReactElement => {
  const debounceTimeout = useRef<NodeJS.Timeout>(null);
  const { extentSelector, extentSelectorConfig } = useSelector(configParamsSelector);
  const [isExtentSelector, setIsExtentSelector] = useState<boolean>(extentSelector);
  const extentSelectorRef = useRef<boolean>(extentSelector);
  const extentSelectorConfigRef = useRef<ExtentSelector>(extentSelectorConfig);
  const dispatch = useDispatch();

  useEffect(() => {
    extentSelectorRef.current = extentSelector;
  }, [extentSelector]);

  useEffect(() => {
    extentSelectorConfigRef.current = extentSelectorConfig;
  }, [extentSelectorConfig]);

  useEffect(() => {
    function debounce(): void {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(
        () => dispatch(updateConfigParam({ key: "extentSelector", value: isExtentSelector })),
        750
      );
    }
    debounce();
  }, [dispatch, isExtentSelector]);

  useEffect(() => {
    function handleConfigurationUpdates(e: MessageEvent) {
      if (e?.data?.type === "cats-app") {
        const dataKeys = Object.keys(e.data);
        const key = dataKeys.filter((key) => key !== "type")[0];
        if (key === "extentSelector") {
          setIsExtentSelector(e.data[key]);
        } else if (key === "exhibitConfig") {
          dispatch(updateExhibit(e.data[key]));
        } else {
          dispatch(updateConfigParam({ key, value: e.data[key] }));
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
