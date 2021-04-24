import { FC, ReactElement } from "react";

const CSS = {
  compare: "esri-countdown-app__compare-header",
};

const Compare: FC = (): ReactElement => {
  return (
    <calcite-panel className={CSS.compare} dismissible heading="Header">
      <div style={{padding: "0 12px"}}>
        <p>Slotted content!</p>
      </div>
    </calcite-panel>
  );
};

export default Compare;