import { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { activeToggle } from "../../redux/slices/sectionsSlice";

import "./Intro.scss";

const CSS = {
  base: "esri-countdown-app__intro",
  container: "esri-countdown-app__intro-container",
  title: "esri-countdown-app__intro-title",
  content: "esri-countdown-app__intro-content",
  start: "esri-countdown-app__intro-start"
};

interface IntroProps {
  content: string;
  position: number;
  title: string;
}

const Intro: FC<IntroProps> = ({ content, position, title }): ReactElement => {
  const contentEl = useRef<HTMLDivElement>(null);
  const introEl = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    contentEl.current.innerHTML = content;
    if (introEl.current.clientHeight < introEl.current.parentElement.clientHeight) {
      introEl.current.style.height = `${introEl.current.parentElement.clientHeight}px`;
    }
  }, [content]);

  return (
    <div ref={introEl} className={CSS.base}>
      <div className={CSS.container}>
        <h2 className={CSS.title}>{title}</h2>
        <div ref={contentEl} className={CSS.content} />
      </div>
      <div className={CSS.start}>
        <calcite-button width="full" scale="s" onClick={() => dispatch(activeToggle(position+1))}>
          Start
        </calcite-button>
      </div>
    </div>
  );
};

export default Intro;
