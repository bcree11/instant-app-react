import { FC, ReactElement, useEffect, useState } from "react";
import { fetchMessageBundle } from "@arcgis/core/intl";
import ModalT9n from "../../t9n/Modal/resources.json";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import { useDispatch, useSelector } from "react-redux";
import { splashSelector, toggleOffSplash } from "../../redux/slices/splashSlice";

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
  const { splashButtonText, splashTitle, splashContent, splashOnStart } = useSelector(splashSelector);
  const [messages, setMessages] = useState<typeof ModalT9n>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Modal"));
      setMessages(data);
    }
    document.addEventListener("calciteModalClose", (event) => {
      event.stopImmediatePropagation();
      dispatch(toggleOffSplash());
    });
    fetchMessages();
  }, [dispatch]);

  return (
    <calcite-modal aria-labelledby="modal-title" active={splashOnStart}>
      <Header splashTitle={splashTitle} />
      <Content messages={messages} splashContent={splashContent} />
      <Button splashButtonText={splashButtonText} closeModal={() => dispatch(toggleOffSplash())} />
    </calcite-modal>
  );
};

export default Modal;
