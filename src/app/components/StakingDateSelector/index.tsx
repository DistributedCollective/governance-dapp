/**
 *
 * StakingDateSelector
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Text } from '@blueprintjs/core/lib/esm/components/text/text';
import { MenuItem } from '@blueprintjs/core/lib/esm/components/menu/menuItem';
import { Select } from '@blueprintjs/select/lib/esm/components/select/select';
import { ItemRenderer } from '@blueprintjs/select/lib/esm/common/itemRenderer';
import { ItemPredicate } from '@blueprintjs/select/lib/esm/common/predicate';

const maxPeriods = 78;

interface DateItem {
  key: number;
  label: string;
  date: Date;
}

const DateSelect = Select.ofType<DateItem>();

interface Props {
  title: string;
  kickoffTs: number;
  onChange: (value: number) => void;
  value?: number;
  startTs?: number;
  stakes?: undefined;
}

export function StakingDateSelector(props: Props) {
  const onItemSelect = item => props.onChange(item.key);
  const [dates, setDates] = useState<Date[]>([]);
  const [filteredDates, setFilteredDates] = useState<DateItem[]>([]);
  const [itemDisabled, setItemDisabled] = useState<any>([]);

  useEffect(() => {
    if (props.kickoffTs) {
      const dates: Date[] = [];
      let lastDate = moment(props.kickoffTs * 1e3).clone();
      for (let i = 1; i <= maxPeriods; i++) {
        const date = lastDate.add(2, 'weeks');
        if (
          (props.value as any) !== undefined &&
          (props.value as any) <= date.unix()
        ) {
          dates.push(date.clone().toDate());
        }
        if ((props.value as any) === undefined) {
          dates.push(date.clone().toDate());
        }
      }
      setDates(dates);
    }
  }, [props.kickoffTs, props.value]);

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
        (props.stakes as any).map(item => ({
          key: item * 1e3,
          label: moment(new Date(item * 1e3)).format('DD.MM.YYYY'),
          date: new Date(item * 1e3),
        })),
      );
    }
  }, [dates, props.startTs, props.stakes]);

  const dateWithoutStake = filteredDates.reduce((unique: any, o: any) => {
    let isFound = itemDisabled.some(b => {
      return b.key === o.key;
    });
    if (!isFound) unique.push(o);
    return unique;
  }, []);

  const getSelected = useCallback(() => {
    return dateWithoutStake.find(item => item.key === props.value);
  }, [dateWithoutStake, props.value]);

  const [selected, setSelected] = useState<DateItem | undefined>(getSelected());

  useEffect(() => {
    setSelected(getSelected());
  }, [getSelected, props.value, dateWithoutStake]);

  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {props.title}
      </label>
      <DateSelect
        items={dateWithoutStake}
        itemRenderer={renderItem}
        filterable={true}
        itemPredicate={filterItem}
        onItemSelect={onItemSelect}
        itemsEqual={areOptionsEqual}
        activeItem={selected}
        noResults={
          <MenuItem
            disabled={true}
            text="No more dates available for staking."
          />
        }
      >
        <Button
          icon="calendar"
          text={
            <Text ellipsize>{selected ? selected.label : 'Select date'}</Text>
          }
          rightIcon="caret-down"
        />
      </DateSelect>
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
