import React, { FC, ReactElement, useEffect, useState } from "react";
import { fetchMessageBundle } from "@arcgis/core/intl";
import ModalT9n from "../../t9n/Modal/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import { useTypedSelector } from "../../redux/reducers";
import { useDispatch } from "react-redux";
import { openInfoPanel } from "../../redux/actions";

interface ContentProps {
  messages: typeof ModalT9n;
  splashContent: string;
}

interface HeaderProps {
  splashTitle: string;
}

interface ButtonProps {
  splashButtonText: string;
  closeModal: Function;
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

const Button: FC<ButtonProps> = ({ splashButtonText, closeModal }): ReactElement => (
  <calcite-button onClick={closeModal} slot="primary" width="full">
    {splashButtonText}
  </calcite-button>
);

const Modal: FC = (): ReactElement => {
  const {
    splashButtonText,
    splashTitle,
    splashContent,
    splashOnStart
  } = useTypedSelector((state) => state.splash);
  const [messages, setMessages] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("calciteModalClose", () => {
      dispatch(openInfoPanel(false));
    });
    const fetchMessages = async () => {
      const data = await fetchMessageBundle(getMessageBundlePath("Modal"));
      setMessages(data);
    };
    fetchMessages();
  }, [dispatch,messages]);

  return (
    <calcite-modal aria-labelledby="modal-title" active={splashOnStart}>
      <Header splashTitle={splashTitle} />
      <Content messages={messages} splashContent={splashContent} />
      <Button splashButtonText={splashButtonText} closeModal={() => dispatch(openInfoPanel(false))} />
    </calcite-modal>
  );
};

export default Modal;
