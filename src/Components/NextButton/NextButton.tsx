import { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { activeToggle, sectionsSelector } from "../../redux/slices/sectionsSlice";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";

import NextButtonT9n from "../../t9n/NextButton/resources.json";

import "./NextButton.scss";

const CSS = {
  base: "esri-countdown-app__next-button"
};

interface NextButtonProps {
  nextPosition: number;
  text: string;
}

const NextButton: FC<NextButtonProps> = ({ nextPosition, text }): ReactElement => {
  const [messages, setMessages] = useState<typeof NextButtonT9n>(null);
  const { sections } = useSelector(sectionsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("NextButton"));
      setMessages(data);
    }
    if (isSubscribed) {
      fetchMessages();
    }

    return () => {
      isSubscribed = false;
    };
  }, []);

  function handleButtonText() {
    return text ? text : messages?.next + sections[nextPosition].title;
  }

  return (
    <div className={CSS.base}>
      <calcite-button width="full" scale="s" onClick={() => dispatch(activeToggle(nextPosition))}>
        {handleButtonText()}
      </calcite-button>
    </div>
  );
};

export default NextButton;
