import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { numberFromWei, genesisAddress } from 'utils/helpers';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import VestingABI from '../../BlockChainProvider/abi/Vesting.json';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { actions } from 'app/containers/BlockChainProvider/slice';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';
import { useStaking_getCurrentVotes } from '../../../hooks/staking/useStaking_getCurrentVotes';

export function VestingTable() {
  const account = useAccount();
  const vesting = useVesting_getVesting(account);
  const lockedAmount = useStaking_balanceOf(vesting.value as string);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);
  const dispatch = useDispatch();
  const votingPower = useStaking_getCurrentVotes(vesting.value);

  useEffect(() => {
    setVestLoading(true);
    async function getVestsList() {
      try {
        await network
          .callCustomContract(vesting.value as any, VestingABI, 'startDate', [])
          .then(res => {
            return setStakingPeriodStart(res);
          });
        await network
          .callCustomContract(vesting.value as any, VestingABI, 'duration', [])
          .then(res => {
            return setStakingPeriod(res);
          });
        await network
          .callCustomContract(vesting.value as any, VestingABI, 'endDate', [])
          .then(res => {
            return setUnlockDate(res);
          });
        setVestLoading(false);
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
        <td
          className={`text-left font-normal
          ${!lockedAmount.value && 'skeleton'}`}
        >
          {numberFromWei(lockedAmount.value)} CSOV
        </td>
        <td
          className={`text-left hidden lg:table-cell font-normal
          ${!stakingPeriodStart && 'skeleton'}`}
        >
          {moment(new Date(parseInt(stakingPeriodStart) * 1e3)).format(
            'DD/MM/YYYY - h:mm:ss a',
          )}
        </td>
        <td className="text-left hidden lg:table-cell font-normal">
          {numberFromWei(votingPower.value).toLocaleString()}
        </td>
        <td
          className={`text-left hidden lg:table-cell font-normal
          ${!stakingPeriod && 'skeleton'}`}
        >
          {moment(new Date(parseInt(stakingPeriod))).format('d')} weeks
        </td>
        <td
          className={`text-left hidden lg:table-cell font-normal
          ${!unlockDate && 'skeleton'}`}
        >
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
              className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
              onClick={() => {
                dispatch(actions.vestingType('genesis'));
                dispatch(actions.toggleDelagationDialog(true));
              }}
            >
              Delegate
            </button>
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
        colSpan={7}
        className={`text-center font-normal ${vestLoading && 'skeleton'}`}
      >
        No vests yet
      </td>
    </tr>
  );
}
