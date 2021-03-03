import React, { useEffect, useState } from 'react';
import { numberFromWei } from 'utils/helpers';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import VestingABI from '../../BlockChainProvider/abi/Vesting.json';
import { genesisAddress } from 'utils/helpers';

export function VestingTeamTable() {
  const account = useAccount();
  const vestingTeam = useVesting_getTeamVesting(account);
  const lockedAmountTeam = useStaking_balanceOf(vestingTeam.value as string);

  const [teamLoading, setTeamLoading] = useState(false);
  const [stakingPeriodTeamStart, setStakingPeriodTeamStart] = useState('');
  const [stakingTeamPeriod, setStakingTeamPeriod] = useState('');
  const [unlockTeamDate, setUnlockTeamDate] = useState('');

  useEffect(() => {
    setTeamLoading(true);
    async function getVestsTeamList() {
      try {
        if (vestingTeam.value) {
          const stakingPeriodTeamStart = await network.callCustomContract(
            vestingTeam.value as any,
            VestingABI,
            'startDate',
            [],
          );
          const stakingTeamPeriod = await network.callCustomContract(
            vestingTeam.value as any,
            VestingABI,
            'duration',
            [],
          );
          const unlockTeamDate = await network.callCustomContract(
            vestingTeam.value as any,
            VestingABI,
            'endDate',
            [],
          );
          setStakingPeriodTeamStart(stakingPeriodTeamStart);
          setStakingTeamPeriod(stakingTeamPeriod);
          setUnlockTeamDate(unlockTeamDate);
          setTeamLoading(false);
        }
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
          <td className="text-left font-normal">
            {numberFromWei(lockedAmountTeam.value)} CSOV
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            {moment(new Date(parseInt(stakingPeriodTeamStart) * 1e3)).format(
              'DD/MM/YYYY - h:mm:ss a',
            )}
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            {moment(new Date(parseInt(stakingTeamPeriod))).format('d')} weeks
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
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
