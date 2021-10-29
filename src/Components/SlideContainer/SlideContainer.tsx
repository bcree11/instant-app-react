import { FC, ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";

import "./SlideContainer.scss";

import { exhibitSelector } from "../../redux/slices/exhibitSlice";
import View from "../View/View";

const CSS = {
  base: "esri-slide-container"
};

const SlideContainer: FC = (): ReactElement => {
  const { currentSlide, currentSlideIndex, slides, transition } = useSelector(exhibitSelector);

  useEffect(() => {
    console.log("currentSlideIndex ", currentSlideIndex);
  }, [currentSlideIndex]);

  return (
    <div className={CSS.base}>
      {slides.length ? (
        slides.map((slide) => <View key={slide.id} showView={slide.id === currentSlide.id} slide={slide} transition={transition} />)
      ) : (
        <View key="no-slides" showView={true} slide={null} transition={null} />
      )}
    </div>
  );
};

export default SlideContainer;
