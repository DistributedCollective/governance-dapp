/**
 *
 * StakingDateSelector
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import Slider from 'react-slick';
import moment from 'moment';
import { Icon } from '@blueprintjs/core';
import { Text } from '@blueprintjs/core/lib/esm/components/text/text';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { ItemRenderer } from '@blueprintjs/select/lib/esm/common/itemRenderer';
import { ItemPredicate } from '@blueprintjs/select/lib/esm/common/predicate';

const maxPeriods = 78;

interface DateItem {
  key: number;
  label: string;
  date: Date;
}
interface Props {
  title: string;
  kickoffTs: number;
  onClick: (value: number) => void;
  value?: number;
  startTs?: number;
  stakes?: undefined;
  prevExtend?: number;
  autoselect?: boolean;
}

export function StakingDateSelector(props: Props) {
  const onItemSelect = (item: { key: number }) => props.onClick(item.key);
  const [dates, setDates] = useState<Date[]>([]);
  const [currentYearDates, setCurrenYearDates] = useState<any>([]);
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [itemDisabled, setItemDisabled] = useState<any>([]);

  let avaliableYears = filteredDates
    .map(yearDate => moment(yearDate.date).format('YYYY'))
    .filter((year, index, arr) => arr.indexOf(year) === index);

  let avaliableMonth = currentYearDates
    .map(yearDate => moment(yearDate.date).format('MMM'))
    .filter((month, index, arr) => arr.indexOf(month) === index);

  const getDatesByYear = year => {
    var theBigDay = new Date();
    theBigDay.setFullYear(year);
    return setCurrenYearDates(
      filteredDates.filter(
        item => new Date(item.date).getFullYear() === theBigDay.getFullYear(),
      ),
    );
  };

  useEffect(() => {
    if (props.kickoffTs) {
      const dates: Date[] = [];
      const datesFutured: Date[] = [];
      let lastDate = moment(props.kickoffTs * 1e3).clone();
      for (let i = 1; i <= maxPeriods; i++) {
        const date = lastDate.add(2, 'weeks');
        dates.push(date.clone().toDate());
        if ((props.prevExtend as any) <= date.unix()) {
          datesFutured.push(date.clone().toDate());
        }
      }
      if (datesFutured.length) {
        setDates(datesFutured);
      } else {
        setDates(dates);
      }
    }
  }, [props.kickoffTs, props.value, props.prevExtend]);

  useEffect(() => {
    let filtered: Date[] = [];
    if (!!props.startTs) {
      filtered = dates.filter(
        item => item.getTime() > ((props.startTs as unknown) as number),
      );
    } else {
      const now = Date.now();

      filtered = dates.filter(item => item.getTime() > now);
    }

    setFilteredDates(
      filtered.map(item => ({
        key: item.getTime(),
        label: item.toLocaleDateString(),
        date: item,
      })),
    );

    if (props.stakes) {
      setItemDisabled(
        (props.stakes as any).map((item: number) => ({
          key: item * 1e3,
          label: moment(new Date(item * 1e3)).format('DD.MM.YYYY'),
          date: new Date(item * 1e3),
        })),
      );
    }
  }, [dates, props.startTs, props.stakes]);

  const dateWithoutStake = filteredDates.reduce((unique: any, o: any) => {
    let isFound = itemDisabled.some((b: { key: any }) => {
      return b.key === o.key;
    });
    if (!isFound) unique.push(o);
    return unique;
  }, []);

  const getSelected = useCallback(() => {
    return dateWithoutStake.find(
      (item: { key: number | undefined }) => item.key === props.value,
    );
  }, [dateWithoutStake, props.value]);

  const [selected, setSelected] = useState<DateItem | undefined>(getSelected());
  console.log(selected);

  useEffect(() => {
    setSelected(getSelected());
  }, [getSelected, props.value, dateWithoutStake]);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon icon="chevron-right" iconSize={25} color="white" />
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <Icon icon="chevron-left" iconSize={25} color="white" />
      </div>
    );
  }

  const settingsSliderYear = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const settingsSliderMonth = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // useEffect(() => {
  //   if (props.autoselect && !props.value && dateWithoutStake.length) {
  //     props.onChange(dateWithoutStake[0].key);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.autoselect, props.value, dateWithoutStake]);

  return (
    <>
      <label className="block mt-8 text-theme-white text-md font-medium mb-2">
        Select Year:
      </label>
      <Slider {...settingsSliderYear}>
        {avaliableYears.map((year, i) => {
          return (
            <div className="mr-6" key={i}>
              <button
                type="button"
                onClick={() => getDatesByYear(year)}
                className="leading-7 rounded border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter"
              >
                {year}
              </button>
            </div>
          );
        })}
      </Slider>
      <div className="sliderMonth mt-5">
        <Slider {...settingsSliderMonth}>
          {avaliableMonth.map((monthName: React.ReactNode, i) => {
            return (
              <div className="w-1/6" key={i}>
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  {monthName}
                  {currentYearDates.map((item, i) => {
                    if (moment(item.date).format('MMM') === monthName) {
                      return (
                        <div
                          key={i}
                          onClick={() => onItemSelect(item)}
                          className="flex items-center justify-center mr-1 mb-1 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter"
                        >
                          {new Date(item.date).getDate()}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
}

export const renderItem: ItemRenderer<DateItem> = (
  item,
  { handleClick, modifiers, query },
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.key}
      onClick={handleClick}
      text={<Text ellipsize>{highlightText(item.label, query)}</Text>}
    />
  );
};

export const filterItem: ItemPredicate<DateItem> = (
  query,
  item,
  _index,
  exactMatch,
) => {
  const normalizedTitle = item.label.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

export function areOptionsEqual(optionA: DateItem, optionB: DateItem) {
  return optionA.key === optionB.key;
}

export function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

export function escapeRegExpChars(text: string) {
  // eslint-disable-next-line no-useless-escape
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
