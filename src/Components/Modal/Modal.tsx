import { FC, ReactElement, useRef } from "react";
import { useSelector } from "react-redux";

import ModalT9n from "../../t9n/Modal/resources.json";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";
import { useMessages } from "../../hooks/useMessages";

interface ContentProps {
  messages: typeof ModalT9n;
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

const Modal: FC = (): ReactElement => {
  const { splashButtonText, splashTitle, splashContent, splashOnStart, theme } = useSelector(configParamsSelector);
  const messages: typeof ModalT9n = useMessages("Modal");
  const calciteModal = useRef<HTMLCalciteModalElement>(null);

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

export default Modal;
