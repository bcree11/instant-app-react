import { FC, Fragment, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { updateFeatureIndex } from "../../redux/slices/popupSlice";
import { SectionState } from "../../types/interfaces";
import { getPopupTitle } from "../../utils/utils";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import PagingT9n from "../../t9n/Paging/resources.json";

import "./Paging.scss";

const CSS = {
  base: "esri-countdown-app__paging"
};

interface PagingProps {
  section: SectionState;
}

interface DropdownItemProps {
  handleClick: () => void;
  rank: number;
  selected: boolean;
  title: string;
}

const DropdownItem: FC<DropdownItemProps> = ({ handleClick, rank, selected, title }): ReactElement => {
  const dropdownItem = useRef<HTMLCalciteDropdownItemElement>(null);

  useEffect(() => {
    if (!document.getElementById(`title-${rank}`)) {
      const itemStyle = document.createElement("style");
      itemStyle.innerHTML = `:host::before {
        content: '${rank}'!important;
        opacity: 1!important;
        color: var(--calcite-ui-text-3)!important;
      }`;
      itemStyle.id = `title-${rank}`;
      dropdownItem.current.shadowRoot.prepend(itemStyle);
    }
  }, [rank]);

  if (selected) {
    return (
      <calcite-dropdown-item ref={dropdownItem} key={`${title}-${rank}`} onClick={handleClick} active>
        {title}
      </calcite-dropdown-item>
    );
  } else {
    return (
      <calcite-dropdown-item ref={dropdownItem} key={`${title}-${rank}`} onClick={handleClick}>
        {title}
      </calcite-dropdown-item>
    );
  }
};

const Paging: FC<PagingProps> = ({ section }): ReactElement => {
  const [messages, setMessages] = useState<typeof PagingT9n>(null);
  const [rank, setRank] = useState<number>(section.featuresDisplayed);
  const [titles, setTitles] = useState<string[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Paging"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    const tmpTitles: string[] = [];
    for (let i = 0; i < section.featuresDisplayed; i++) {
      tmpTitles.push(getPopupTitle(section?.features[i]));
    }
    setTitles(tmpTitles);
  }, [section.features, section.featuresDisplayed]);

  useEffect(() => {
    dispatch(updateFeatureIndex(rank - 1));
  }, [dispatch, rank]);

  function rankDecrement(): void {
    if (rank > 1) {
      setRank(rank - 1);
    }
  }

  function rankIncrement(): void {
    if (rank < section.featuresDisplayed) {
      setRank(rank + 1);
    }
  }

  function createPaginationText(): string {
    if (section.pagingLabel) {
      return section.pagingLabel
        .replace(messages?.current, rank.toString())
        .replace(messages?.total, section.featuresDisplayed.toString());
    } else {
      return messages?.rankLabel
        .replace(messages?.current, rank.toString())
        .replace(messages?.total, section.featuresDisplayed.toString());
    }
  }

  return (
    <Fragment>
      {titles && titles.length && messages?.rankLabel && (
        <div className={CSS.base}>
          <calcite-button appearance="outline" icon-end="chevron-left" scale="s" onClick={rankIncrement} />
          <div>
            <calcite-dropdown max-items="5">
              <calcite-button slot="dropdown-trigger" appearance="outline" icon-end="caret-down" scale="s">
                {createPaginationText()}
              </calcite-button>
              <calcite-dropdown-group>
                {titles.map((title, index) => {
                  return (
                    <DropdownItem
                      key={`${title}-${index}`}
                      title={title}
                      rank={index + 1}
                      selected={index + 1 === rank}
                      handleClick={() => setRank(index + 1)}
                    />
                  );
                })}
              </calcite-dropdown-group>
            </calcite-dropdown>
          </div>
          <calcite-button appearance="outline" icon-end="chevron-right" scale="s" onClick={rankDecrement} />
        </div>
      )}
    </Fragment>
  );
};

export default Paging;
