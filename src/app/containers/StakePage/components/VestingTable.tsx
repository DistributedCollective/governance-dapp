import React, { useEffect, useState } from 'react';
import { numberFromWei } from 'utils/helpers';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import VestingABI from '../../BlockChainProvider/abi/Vesting.json';
import { genesisAddress } from 'utils/helpers';

export function VestingTable() {
  const account = useAccount();
  const vesting = useVesting_getVesting(account);
  const lockedAmount = useStaking_balanceOf(vesting.value as string);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);

  useEffect(() => {
    setVestLoading(true);
    async function getVestsList() {
      try {
        if (vesting.value) {
          const stakingPeriodStart = await network.callCustomContract(
            vesting.value as any,
            VestingABI,
            'startDate',
            [],
          );
          const stakingPeriod = await network.callCustomContract(
            vesting.value as any,
            VestingABI,
            'duration',
            [],
          );
          const unlockDate = await network.callCustomContract(
            vesting.value as any,
            VestingABI,
            'endDate',
            [],
          );

          setStakingPeriodStart(stakingPeriodStart);
          setStakingPeriod(stakingPeriod);
          setUnlockDate(unlockDate);
          setVestLoading(false);
        }
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    getVestsList();
  }, [vesting.value, account]);
  return vesting.value !== genesisAddress && !vestLoading ? (
    <>
      <tr>
        <td>
          <div className="username flex items-center">
            <div>
              <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
            </div>
            <div className="text-sm font-normal hidden xl:block">CSOV</div>
          </div>
        </td>
        <td className="text-left font-normal">
          {numberFromWei(lockedAmount.value)} CSOV
        </td>
        <td className="text-left hidden lg:table-cell font-normal">
          {moment(new Date(parseInt(stakingPeriodStart) * 1e3)).format(
            'DD/MM/YYYY - h:mm:ss a',
          )}
        </td>
        <td className="text-left hidden lg:table-cell font-normal">
          {moment(new Date(parseInt(stakingPeriod))).format('d')} weeks
        </td>
        <td className="text-left hidden lg:table-cell font-normal">
          <p>
            {moment(new Date(parseInt(unlockDate) * 1e3)).format('DD/MM/YYYY')}
            <br />
            {moment().diff(
              moment(new Date(parseInt(unlockDate) * 1e3)),
              'days',
            )}{' '}
            days
          </p>
        </td>
        <td className="md:text-left lg:text-right hidden md:table-cell max-w-15 min-w-15">
          <div className="flex flex-nowrap justify-end">
            <button
              type="button"
              disabled
              className="opacity-30 text-gold tracking-normal hover:text-gold hover:no-underline mr-1 xl:mr-12 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
              onClick={() => {}}
            >
              Unstake
            </button>
          </div>
        </td>
      </tr>
    </>
  ) : (
    <tr>
      <td
        colSpan={6}
        className={`text-center font-normal ${vestLoading && 'skeleton'}`}
      >
        No vests yet
      </td>
    </tr>
  );
}
