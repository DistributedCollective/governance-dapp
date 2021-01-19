import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { WalletConnectorButton } from '../../containers/BlockChainProvider/components/WalletConnectorButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../../containers/BlockChainProvider/selectors';
import { actions } from 'app/containers/BlockChainProvider/slice';
import { DEFAULT_CHAIN } from '../../containers/BlockChainProvider';

export function Header() {
  const { connected, address } = useSelector(selectBlockChainProvider);
  const dispatch = useDispatch();
  return (
    <header className="bg-black text-white py-5">
      <div className="container flex flex-row justify-between items-center">
        <div>
          <Link to="/">
            Sovryn{' '}
            <small className="text-gray-700">
              {DEFAULT_CHAIN === 30 ? 'MAINNET' : 'TESTNET'}
            </small>
          </Link>
        </div>
        <div className="text-gray-400">
          <NavLink
            to="/"
            isActive={(_, location) => !location.pathname.startsWith('/stake')}
            activeClassName="text-white"
            className="px-3 py-2 text-sm font-bold transition duration-300 easy-in-out hover:text-gray-500"
          >
            Governance
          </NavLink>

          {connected && address && (
            <button
              className="px-3 py-2 text-sm font-bold transition duration-300 easy-in-out hover:text-gray-500 hover:underline"
              onClick={() => dispatch(actions.toggleDelagationDialog(true))}
            >
              Delegate Votes
            </button>
          )}

          <WalletConnectorButton />
        </div>
      </div>
    </header>
  );
}
