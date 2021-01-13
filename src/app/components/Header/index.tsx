import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { WalletConnectorButton } from '../../containers/BlockChainProvider/components/WalletConnectorButton';

export function Header() {
  return (
    <header className="bg-black text-white py-5">
      <div className="container flex flex-row justify-between items-center">
        <div>
          <Link to="/">Sovryn</Link>
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
          {/*<NavLink
            to="/stake"
            exact
            activeClassName="text-white"
            className="px-3 py-2 text-sm font-bold transition duration-300 easy-in-out hover:text-gray-500"
          >
            Staking
          </NavLink>*/}

          <WalletConnectorButton />

          {/*<a*/}
          {/*  href="https://live.sovryn.app"*/}
          {/*  className="px-3 py-2 border-2 border-green-600 rounded text-sm text-green-600 font-bold transition duration-300 easy-in-out hover:text-white hover:bg-green-600"*/}
          {/*  target="_blank"*/}
          {/*  rel="noreferrer"*/}
          {/*>*/}
          {/*  App*/}
          {/*</a>*/}
        </div>
      </div>
    </header>
  );
}
