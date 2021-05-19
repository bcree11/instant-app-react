import { FC, Fragment, ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { updateFeatureIndex } from "../../redux/slices/popupSlice";
import { SectionState } from "../../types/interfaces";

import { fetchMessageBundle } from "@arcgis/core/intl";
import { getMessageBundlePath } from "../../utils/t9nUtils";
import PagingT9n from "../../t9n/Paging/resources.json";

import "./Paging.scss";

const CSS = {
  base: "esri-countdown-app__paging"
};

interface Ranking {
  rank: number;
  title: string;
}

interface PagingProps {
  section: SectionState;
}

interface DropdownItemProps {
  handleClick: () => void;
  index: number;
  rank: number;
  active: boolean;
  title: string;
}

const DropdownItem: FC<DropdownItemProps> = ({ handleClick, index, rank, active, title }): ReactElement => {
  const dropdownItem = useRef<HTMLCalciteDropdownItemElement>(null);

  useEffect(() => {
    if (!document.getElementById(`title-${index}`)) {
      const itemStyle = document.createElement("style");
      itemStyle.innerHTML = `:host::before {
        content: '${rank}'!important;
        opacity: 1!important;
        color: var(--calcite-ui-text-3)!important;
      }`;
      itemStyle.id = `title-${index}`;
      dropdownItem.current.shadowRoot.prepend(itemStyle);
    }
  }, [active, index, rank]);

  return (
    <calcite-dropdown-item ref={dropdownItem} key={`${title}-${index}`} onClick={handleClick} data-active={active}>
      {title}
    </calcite-dropdown-item>
  );
};

const Paging: FC<PagingProps> = ({ section }): ReactElement => {
  const [messages, setMessages] = useState<typeof PagingT9n>(null);
  const [rank, setRank] = useState<number>(section.featuresDisplayed);
  const [countdown, setCountdown] = useState<Ranking[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMessages(): Promise<void> {
      const data = await fetchMessageBundle(getMessageBundlePath("Paging"));
      setMessages(data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    const tmpCountdown: Ranking[] = [];
    for (let i = 0; i < section.featuresDisplayed; i++) {
      tmpCountdown.push({
        rank: section?.graphics?.[i].rank,
        title: section?.graphics?.[i].title
      });
    }
    setCountdown(tmpCountdown);
  }, [section?.graphics, section?.graphics?.length, section.featuresDisplayed]);

  useEffect(() => {
    dispatch(updateFeatureIndex(rank - 1));
  }, [dispatch, rank]);

  function rankDecrement(event): void {
    if (event.detail < 2) {
      if (rank > 1) {
        setRank(rank - 1);
      } else {
        setRank(section.featuresDisplayed);
      }
    }
  }

  function rankIncrement(event): void {
    if (event.detail < 2) {
      if (rank < section.featuresDisplayed) {
        setRank(rank + 1);
      }
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
      {countdown && countdown.length && messages?.rankLabel && (
        <div className={CSS.base}>
          <calcite-button appearance="outline" icon-end="chevron-left" scale="s" onClick={rankIncrement} />
          <div>
            <calcite-dropdown max-items="5" placement="top-start">
              <calcite-button slot="dropdown-trigger" appearance="outline" icon-end="caret-down" scale="s">
                {createPaginationText()}
              </calcite-button>
              <calcite-dropdown-group>
                {countdown.map((item, index) => {
                  return (
                    <DropdownItem
                      key={`${item.title}-${index}`}
                      index={index}
                      rank={item.rank}
                      active={index + 1 === rank}
                      title={item.title}
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
