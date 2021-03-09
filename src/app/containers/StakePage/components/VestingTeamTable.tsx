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
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';
import { useStaking_getCurrentVotes } from '../../../hooks/staking/useStaking_getCurrentVotes';

export function VestingTeamTable() {
  const account = useAccount();
  const vestingTeam = useVesting_getTeamVesting(account);
  const lockedAmountTeam = useStaking_balanceOf(vestingTeam.value);
  const [teamLoading, setTeamLoading] = useState(false);
  const [stakingPeriodTeamStart, setStakingPeriodTeamStart] = useState('');
  const [stakingTeamPeriod, setStakingTeamPeriod] = useState('');
  const [unlockTeamDate, setUnlockTeamDate] = useState('');
  const dispatch = useDispatch();
  const votingPower = useStaking_getCurrentVotes(vestingTeam.value);

  useEffect(() => {
    setTeamLoading(true);
    async function getVestsTeamList() {
      try {
        await network
          .callCustomContract(
            vestingTeam.value as any,
            VestingABI,
            'startDate',
            [],
          )
          .then(res => {
            return setStakingPeriodTeamStart(res);
          });
        await network
          .callCustomContract(
            vestingTeam.value as any,
            VestingABI,
            'duration',
            [],
          )
          .then(res => {
            return setStakingTeamPeriod(res);
          });
        await network
          .callCustomContract(
            vestingTeam.value as any,
            VestingABI,
            'endDate',
            [],
          )
          .then(res => {
            return setUnlockTeamDate(res);
          });

        setTeamLoading(false);
      } catch (e) {
        console.error(e);
        setTeamLoading(false);
      }
    }
    getVestsTeamList();
  }, [vestingTeam.value, account]);

  return (
    <>
      {vestingTeam.value !== genesisAddress && !teamLoading && (
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
            ${!lockedAmountTeam.value && 'skeleton'}`}
          >
            {numberFromWei(lockedAmountTeam.value)} CSOV
          </td>
          <td
            className={`text-left hidden lg:table-cell font-normal
            ${!stakingPeriodTeamStart && 'skeleton'}`}
          >
            {moment(new Date(parseInt(stakingPeriodTeamStart) * 1e3)).format(
              'DD/MM/YYYY - h:mm:ss a',
            )}
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            {numberFromWei(votingPower.value).toLocaleString()}
          </td>
          <td
            className={`text-left hidden lg:table-cell font-normal
            ${!stakingTeamPeriod && 'skeleton'}`}
          >
            {moment(new Date(parseInt(stakingTeamPeriod))).format('d')} weeks
          </td>
          <td
            className={`text-left hidden lg:table-cell font-normal
            ${!unlockTeamDate && 'skeleton'}`}
          >
            <p>
              {moment(new Date(parseInt(unlockTeamDate) * 1e3)).format(
                'DD/MM/YYYY',
              )}
              <br />
              {moment().diff(
                moment(new Date(parseInt(unlockTeamDate) * 1e3)),
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
                  dispatch(actions.vestingType('team'));
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
      )}
    </>
  );
}
