import { useState, useEffect } from "react";
import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../utils/t9nUtils";

export const useMessages = (fileName: string) => {
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath(fileName));
      setMessages(data);
    }
    fetchMessages();
  });

  return messages;
}