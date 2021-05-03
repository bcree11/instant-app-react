import Feature from "@arcgis/core/widgets/Feature";
import { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popupSelector, toggleCompareGraphicActive } from "../../redux/slices/popupSlice";
import { CompareGraphic } from "../../types/interfaces";

import "./Compare.scss";

const CSS = {
  base: "esri-countdown-app__compare",
  content: "esri-countdown-app__compare-content"
};

interface CompareItemProps {
  compare: CompareGraphic;
}

const CompareItem: FC<CompareItemProps> = ({ compare }): ReactElement => {
  const feature = useRef<__esri.Feature>(null);
  const panel = useRef<HTMLCalcitePanelElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (feature.current) {
      feature.current.graphic = compare.graphic;
    } else {
      feature.current = new Feature({
        container: content.current,
        graphic: compare.graphic,
        visibleElements: {
          title: false
        }
      });
    }
    panel.current.addEventListener("calcitePanelDismissedChange", () => {
      dispatch(toggleCompareGraphicActive(compare.title));
    });
  }, [dispatch, compare.graphic, compare.title]);

  return (
    <calcite-panel ref={panel} dismissible heading={compare.title}>
      <div ref={content} className={CSS.content} />
    </calcite-panel>
  );
};

const Compare: FC = (): ReactElement => {
  const { compareGraphics } = useSelector(popupSelector);
  return (
    <div className={CSS.base}>
      {compareGraphics?.map(
        (compare, index) => compare.active && <CompareItem key={`compare-item-${index}`} compare={compare} />
      )}
    </div>
  );
};

export default Compare;
