import { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { SectionState } from "../../types/interfaces";
import { updateCurrentSection } from "../../redux/slices/sectionsSlice";

import "./Intro.scss";

const CSS = {
  base: "esri-countdown-app__intro",
  container: "esri-countdown-app__intro-container",
  title: "esri-countdown-app__intro-title",
  content: "esri-countdown-app__intro-content",
  start: "esri-countdown-app__intro-start"
};

interface IntroProps {
  section: SectionState;
}

const Intro: FC<IntroProps> = ({ section }): ReactElement => {
  const contentEl = useRef<HTMLDivElement>(null);
  const introEl = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    contentEl.current.innerHTML = section.content;
    dispatch(updateCurrentSection(section.position));
  }, [dispatch, section.content, section.position]);

  return (
    <div ref={introEl} className={CSS.base}>
      <div className={CSS.container}>
        <h2 className={CSS.title}>{section.title}</h2>
        <div ref={contentEl} className={CSS.content} />
      </div>
    </div>
  );
};

export default Intro;
