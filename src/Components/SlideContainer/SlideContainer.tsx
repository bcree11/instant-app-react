import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";

import View from "../View/View";

import { exhibitSelector } from "../../redux/slices/exhibitSlice";
import { configParamsSelector } from "../../redux/slices/configParamsSlice";

import "./SlideContainer.scss";

const CSS = {
  base: "esri-slide-container"
};

const SlideContainer: FC = (): ReactElement => {
  const { header } = useSelector(configParamsSelector)
  const { currentSlide, slides, transition } = useSelector(exhibitSelector);

  return (
    <div className={CSS.base} data-header={header}>
      {slides.length ? (
        slides.map((slide, index) => <View key={slide.id} isInitialSlide={index === 0} showView={slide.id === currentSlide.id} slide={slide} transition={transition} />)
      ) : (
        <View key="no-slides" isInitialSlide={true} showView={true} slide={null} transition={null} />
      )}
    </div>
  );
};

export default SlideContainer;
