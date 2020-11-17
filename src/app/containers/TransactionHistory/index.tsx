/**
 *
 * TransactionHistory
 *
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from '@blueprintjs/core/lib/esm/components/drawer/drawer';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import { actions } from '../BlockChainProvider/slice';
import { Transaction } from '../BlockChainProvider/types';

export function TransactionHistory() {
  const { transactions, transactionStack, showTransactions } = useSelector(
    selectBlockChainProvider,
  );
  const dispatch = useDispatch();

  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [reversed, setReversed] = useState<string[]>([]);

  useEffect(() => {
    setPendingTransactions(
      Object.values(transactions).filter(item => item.status === 'pending')
        .length,
    );
  }, [transactions]);

  useEffect(() => {
    setReversed([...transactionStack].reverse());
  }, [transactionStack]);

  function ButtonContent() {
    if (pendingTransactions) {
      return (
        <div className="flex flex-row">
          <Spinner size={16} />
          <div className="ml-3">{pendingTransactions} tx pending</div>
        </div>
      );
    }
    return (
      <div className="flex flex-row">
        <div className="ml-3">Transaction history</div>
      </div>
    );
  }

  return (
    <>
      {transactionStack.length > 0 && (
        <div className="fixed bottom-0 right-0 mr-5 mb-5">
          <Button
            className="p-5"
            text={<ButtonContent />}
            onClick={() => dispatch(actions.toggleTransactionDrawer(true))}
          />
        </div>
      )}
      <Drawer
        icon="inbox-filtered"
        onClose={() => dispatch(actions.toggleTransactionDrawer(false))}
        title="Transactions"
        isOpen={showTransactions}
      >
        <div className="py-5">
          {reversed.length === 0 && (
            <div className="px-5">
              <i>No transactions yet.</i>
            </div>
          )}
          {reversed.map(e => (
            <TransactionRow key={e} item={transactions[e]} />
          ))}
        </div>
      </Drawer>
    </>
  );
}

interface Props {
  item: Transaction;
}

function TransactionRow({ item }: Props) {
  return (
    <div className="bordered-list-item px-5 py-3 flex flex-row justify-start space-x-4 items-center">
      <div>
        {item.status === 'pending' && <Spinner size={16} />}
        {item.status === 'confirmed' && <Icon icon="tick" />}
        {item.status === 'failed' && <Icon icon="cross" />}
      </div>
      <LinkToExplorer
        txHash={item.transactionHash}
        className="text-gray-600 hover:text-gray-900"
      />
    </div>
  );
}
