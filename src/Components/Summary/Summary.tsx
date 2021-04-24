import { FC, ReactElement, useEffect, useRef } from "react";

import "./Summary.scss";

const CSS = {
  base: "esri-countdown-app__summary",
  container: "esri-countdown-app__summary-container",
  title: "esri-countdown-app__summary-title",
  content: "esri-countdown-app__summary-content"
};

interface SummaryProps {
  title: string;
  content: string;
}

const Summary: FC<SummaryProps> = ({ title, content }): ReactElement => {
  const contentEl = useRef<HTMLDivElement>(null);
  const summaryEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentEl.current.innerHTML = content;
    if (summaryEl.current.clientHeight < summaryEl.current.parentElement.clientHeight) {
      summaryEl.current.style.height = `${summaryEl.current.parentElement.clientHeight}px`;
    }
  }, [content]);

  return (
    <div ref={summaryEl} className={CSS.base}>
      <div className={CSS.container}>
      <h2 className={CSS.title}>{title}</h2>
      <div ref={contentEl} className={CSS.content} />
      </div>
    </div>
  );
};

export default Summary;