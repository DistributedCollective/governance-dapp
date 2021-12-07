import React, { useEffect, useState } from 'react';
import { StyledTable } from './StyledTable';
import { useAccount } from '../../../hooks/useAccount';
import { genesisAddress } from '../../../../utils/helpers';
import { network } from '../../BlockChainProvider/network';
import { VestingContract } from './VestingContract';

export function CurrentVests() {
  const { items, loading, error } = useGetItems();
  return (
    <>
      <p className="font-semibold text-lg ml-6 mb-4 mt-6">Current Vests</p>
      <div className="bg-gray-light rounded-b shadow">
        <div className="rounded-lg border sovryn-table pt-1 pb-0 pr-5 pl-5 mb-5 max-h-96 overflow-y-auto">
          <StyledTable className="w-full">
            <thead>
              <tr>
                <th className="text-left assets">Asset</th>
                <th className="text-left">Locked Amount</th>
                <th className="text-left hidden lg:table-cell">Voting Power</th>
                <th className="text-left hidden lg:table-cell">Staking Date</th>
                <th className="text-left hidden lg:table-cell">
                  Staking Period
                </th>
                <th className="text-left hidden lg:table-cell">Unlock Date</th>
                <th className="text-left hidden md:table-cell max-w-15 min-w-15">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="mt-5 font-montserrat text-xs">
              {loading && !items.length && (
                <tr>
                  <td colSpan={99} className="text-center font-normal">
                    Loading, please wait...
                  </td>
                </tr>
              )}
              {!loading && !items.length && (
                <tr>
                  <td colSpan={99} className="text-center font-normal">
                    You don't have any vesting contracts.
                  </td>
                </tr>
              )}
              {!!error && (
                <tr>
                  <td colSpan={99} className="text-center font-normal">
                    {error}
                  </td>
                </tr>
              )}
              {items.map(item => (
                <VestingContract
                  key={item.address}
                  vestingAddress={item.address}
                  type={item.type}
                />
              ))}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
}

function useGetItems() {
  const account = useAccount();
  const [state, setState] = useState<{
    items: {
      address: string;
      type: 'genesis' | 'origin' | 'team' | 'reward';
    }[];
    error: string;
    loading: boolean;
  }>({
    items: [],
    error: '',
    loading: false,
  });

  useEffect(() => {
    const run = () =>
      new Promise(async (resolve, reject) => {
        try {
          const items: {
            address: string;
            type: 'genesis' | 'origin' | 'team' | 'reward';
          }[] = [];
          const vesting1 = (await network.call(
            'vestingRegistry',
            'getVesting',
            [account],
          )) as string;
          if (vesting1 && vesting1 !== genesisAddress) {
            items.push({ address: vesting1, type: 'genesis' });
          }

          setState(prevState => ({ ...prevState, items }));

          const vesting2 = (await network.call(
            'vestingRegistry',
            'getTeamVesting',
            [account],
          )) as string;
          if (vesting2 && vesting2 !== genesisAddress) {
            items.push({ address: vesting2, type: 'team' });
            setState(prevState => ({ ...prevState, items }));
          }

          const vesting3 = (await network.call(
            'vestingRegistry2',
            'getVesting',
            [account],
          )) as string;
          if (vesting3 && vesting3 !== genesisAddress) {
            items.push({ address: vesting3, type: 'origin' });
            setState(prevState => ({ ...prevState, items }));
          }

          const vesting4 = (await network.call(
            'vestingRegistry3',
            'getVesting',
            [account],
          )) as string;
          if (vesting4 && vesting4 !== genesisAddress) {
            items.push({ address: vesting4, type: 'reward' });
            setState(prevState => ({ ...prevState, items }));
          }

          resolve(items);
        } catch (e) {
          reject(e);
        }
      });

    if (account && account !== genesisAddress) {
      console.log('started loading for ', account);
      setState({ items: [], loading: true, error: '' });
      run()
        .then((value: any) => {
          console.log('loaded for ', account, value);
          setState({ items: value, loading: false, error: '' });
        })
        .catch(e => {
          console.log('errored', account, e);
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: e.message,
          }));
        });
    }
  }, [account]);

  return state;
}
