import React, { useEffect, useState } from 'react';
import { useContractCall } from '../../../hooks/useContractCall';
import { RowSkeleton } from '../../../components/PageSkeleton';

interface Props {
  proposalId: number;
}

interface ActionsResponse {
  calldatas: string[];
  targets: string[];
  values: string[];
  signatures: string[];
}

interface FormattedAction {
  calldata: string;
  target: string;
  value: string;
  signature: string;
}

export function ProposalActions(props: Props) {
  const { loading, value: actions } = useContractCall(
    'governorAlpha',
    'getActions',
    props.proposalId || '0',
  );

  const [items, setItems] = useState<FormattedAction[]>([]);

  useEffect(() => {
    if (actions) {
      const _items = (actions as unknown) as ActionsResponse;
      const _count = _items.calldatas.length;
      const _list: FormattedAction[] = [];
      for (let index = 0; index < _count; index++) {
        _list.push({
          calldata: _items.calldatas[index],
          target: _items.targets[index],
          value: _items.values[index],
          signature: _items.signatures[index],
        });
      }
      setItems(_list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(actions)]);

  if (loading || !props.proposalId) {
    return (
      <div className="p-3">
        <RowSkeleton />
      </div>
    );
  }

  return (
    <div className="py-3">
      {items.map(item => (
        <div
          className="bordered-list-item px-5 py-3 flex flex-row space-x-4"
          key={item.signature}
        >
          <div className="truncate w-1/4">{item.target}</div>
          <div className="truncate w-1/4">{item.signature}</div>
          <div className="truncate w-1/4">{item.calldata}</div>
          <div className="truncate w-1/4">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
