import { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { SectionState } from "../../types/interfaces";
import { updateCurrentSection } from "../../redux/slices/sectionsSlice";

import "./Summary.scss";

const CSS = {
  base: "esri-countdown-app__summary",
  container: "esri-countdown-app__summary-container",
  title: "esri-countdown-app__summary-title",
  content: "esri-countdown-app__summary-content"
};

interface SummaryProps {
  section: SectionState;
}

const Summary: FC<SummaryProps> = ({ section }): ReactElement => {
  const contentEl = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    contentEl.current.innerHTML = section.content;
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section.content, section.position]);

  return (
    <div className={CSS.base}>
      <div className={CSS.container}>
        <h2 className={CSS.title}>{section.title}</h2>
        <div ref={contentEl} className={CSS.content} />
      </div>
    </div>
  );
};

export default Summary;
