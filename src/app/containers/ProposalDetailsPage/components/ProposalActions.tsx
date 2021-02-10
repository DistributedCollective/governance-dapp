import React, { useEffect, useState } from 'react';
// import { Scrollbars } from 'react-custom-scrollbars';
import { useContractCall } from '../../../hooks/useContractCall';
import { RowSkeleton } from '../../../components/PageSkeleton';
// import { functionsText } from '../../HomePage/functionsText';

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
        <div key={item.signature}>
          <p className="font-semibold text-lg mt-16 tracking-normal">
            Function to invoke: {item.signature}
          </p>
          <p
            className="break-words text-sm tracking-normal"
            title={item.calldata}
          >
            {item.calldata}
          </p>
          <p className="break-words text-sm tracking-normal">
            Contract Address:{' '}
            <span className="text-gold break-words">{item.target}</span>
          </p>
          {/* <p className="font-thin">Amount to transfer: {item.value} (r)BTC</p>
          <Scrollbars
            className="border rounded-xl bg-gray-200 mt-3 mb-10 whitespace-pre h-64"
            style={{ height: 300 }}
          >
            <p className="text-xs font-gray-600 p-4">{functionsText}</p>
          </Scrollbars> */}
        </div>
      ))}
    </div>
  );
}
