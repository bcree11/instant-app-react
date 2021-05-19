import { ChangeEvent, FC, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import FilterT9n from "../../t9n/Filter/resources.json";

import "./Filter.scss";

import { IGraphic, SectionState } from "../../types/interfaces";
import { updateFilteredGraphics } from "../../redux/slices/sectionsSlice";
import { mobileSelector } from "../../redux/slices/mobileSlice";

const CSS = {
  base: "esri-countdown-app__filter",
  search: "esri-countdown-app__filter-search-container",
  select: "esri-widget esri-select"
};

interface FilterProps {
  section: SectionState;
}

interface ComboboxProps {
  placeholder: string;
  section: SectionState;
  handleSelect: (event) => void;
}

const Combobox: FC<ComboboxProps> = ({ placeholder, section, handleSelect }): ReactElement => {
  const combobox = useRef<HTMLCalciteComboboxElement>(null);

  useEffect(() => {
    combobox.current?.addEventListener("calciteLookupChange", handleSelect);
    const select = combobox.current;
    return () => select.removeEventListener("calciteLookupChange", handleSelect);
  }, [handleSelect]);

  return (
    <calcite-combobox
      ref={combobox}
      label={placeholder}
      selection-mode="multi"
      placeholder={placeholder}
      max-items="10"
      scale="s"
    >
      {section?.filterFields?.map((field) => {
        return <calcite-combobox-item key={field} value={field} text-label={field} scale="s" tabindex="-1" />;
      })}
    </calcite-combobox>
  );
};

const Filter: FC<FilterProps> = ({ section }): ReactElement => {
  const { showMobileMode } = useSelector(mobileSelector);
  const [messages, setMessages] = useState<typeof FilterT9n>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Filter"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    section?.graphics?.forEach((graphic) => (graphic.active = true));
  }, [section]);

  function handleComboboxSelect(event: CustomEvent): void {
    const items = event.detail as HTMLCalciteComboboxItemElement[];
    if (items && items.length) {
      const values = items.map((item) => item.value);
      const tmpGraphics = section.graphics.map((graphic) => {
        const compare = graphic.attributes[section.filterField];
        if (values.includes(compare)) {
          return { ...graphic, active: true };
        } else {
          return { ...graphic, active: false };
        }
      }) as IGraphic[];
      dispatch(updateFilteredGraphics(tmpGraphics));
    } else {
      dispatch(updateFilteredGraphics(section.graphics));
    }
  }

  function handleSelect(event: ChangeEvent<HTMLSelectElement>): void {
    const node = event.target as HTMLSelectElement;
    if (node.value === "default") {
      dispatch(updateFilteredGraphics(section.graphics));
    } else {
      const tmpGraphics = section.graphics.map((graphic) => {
        const compare = graphic.attributes[section.filterField];
        if (compare === node.value) {
          return { ...graphic, active: true };
        } else {
          return { ...graphic, active: false };
        }
      }) as IGraphic[];
      dispatch(updateFilteredGraphics(tmpGraphics));
    }
  }

  function handlePlaceholder(): string {
    return messages?.filterBy ? `${messages?.filterBy} ${section.filterField.toLocaleLowerCase()}` : "";
  }

  return (
    <div className={CSS.base}>
      <div className={CSS.search}>
        <div id="search-widget-container" />
      </div>
      {showMobileMode ? (
        <select className={CSS.select} onChange={handleSelect}>
          <option value="default">{handlePlaceholder()}</option>
          {section?.filterFields?.map((field) => {
            return (
              <option key={field} value={field}>
                {field}
              </option>
            );
          })}
        </select>
      ) : (
        <Combobox placeholder={handlePlaceholder()} section={section} handleSelect={handleComboboxSelect} />
      )}
    </div>
  );
};

export default Filter;
