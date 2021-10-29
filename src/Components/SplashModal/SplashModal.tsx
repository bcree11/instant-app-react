import { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import SplashModalT9n from "../../t9n/SplashModal/resources.json";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { useMessages } from "../../hooks/useMessages";
import { updateOpenInfo } from "../../redux/slices/exhibitSlice";

interface ContentProps {
  messages: typeof SplashModalT9n;
  splashContent: string;
}

interface HeaderProps {
  splashTitle: string;
}

function removePTags(splashContent: string): string {
  const openPTags = splashContent.replace("<p>", "");
  return openPTags.replace("</p>", "");
}

const Content: FC<ContentProps> = ({ messages, splashContent }): ReactElement => {
  const contentToDisplay = removePTags(splashContent);
  const content = contentToDisplay ? contentToDisplay : messages?.defaultSplashContent;
  return <div slot="content" dangerouslySetInnerHTML={{ __html: content }} />;
};

const Header: FC<HeaderProps> = ({ splashTitle }): ReactElement => (
  <h2 slot="header" id="modal-title">
    {splashTitle}
  </h2>
);

const SplashModal: FC = (): ReactElement => {
  const { splashButtonText, splashTitle, splashContent, splashOnStart, theme } = useSelector(configParamsSelector);
  const messages: typeof SplashModalT9n = useMessages("Modal");
  const calciteModal = useRef<HTMLCalciteModalElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleModalClose(): void {
      dispatch(updateOpenInfo(false));
    }
    calciteModal.current.addEventListener("calciteModalClose", handleModalClose);
    const modal = calciteModal.current;
    return () => modal.removeEventListener("calciteModalClose", handleModalClose);
  }, [dispatch]);

  return (
    <calcite-modal
      ref={calciteModal}
      class={theme === "light" ? "calcite-theme-light" : "calcite-theme-dark"}
      aria-labelledby="modal-title"
      active={splashOnStart}
    >
      <Header splashTitle={splashTitle} />
      <Content messages={messages} splashContent={splashContent} />
      <calcite-button onClick={() => (calciteModal.current.active = false)} slot="primary" width="full">
        {splashButtonText}
      </calcite-button>
    </calcite-modal>
  );
};

export default SplashModal;
