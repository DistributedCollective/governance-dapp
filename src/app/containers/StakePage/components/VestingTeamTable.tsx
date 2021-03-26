import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { numberFromWei, genesisAddress } from 'utils/helpers';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import VestingABI from '../../BlockChainProvider/abi/Vesting.json';
import { network } from '../../BlockChainProvider/network';
import { actions } from 'app/containers/BlockChainProvider/slice';
import { useAccount } from '../../../hooks/useAccount';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { vesting_withdraw } from '../../BlockChainProvider/requests/vesting';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';

export function VestingTeamTable() {
  const account = useAccount();
  const vestingTeam = useVesting_getTeamVesting(account);
  const lockedAmountTeam = useStaking_balanceOf(vestingTeam.value);
  const [teamLoading, setTeamLoading] = useState(false);
  const [stakingPeriodTeamStart, setStakingPeriodTeamStart] = useState('');
  const [unlockTeamDate, setUnlockTeamDate] = useState('');
  const dispatch = useDispatch();
  const [locked, setLocked] = useState(true);
  const [delegate, setDelegate] = useState<any>([]);
  const [delegateLoading, setDelegateLoading] = useState(true);
  const getStakes = useStaking_getStakes(vestingTeam.value);

  useEffect(() => {
    async function getVestsTeamList() {
      try {
        Promise.all([
          network
            .callCustomContract(
              vestingTeam.value as any,
              VestingABI,
              'startDate',
              [],
            )
            .then(res => setStakingPeriodTeamStart(res)),
          network
            .callCustomContract(
              vestingTeam.value as any,
              VestingABI,
              'endDate',
              [],
            )
            .then(res => setUnlockTeamDate(res)),
        ]).then(_ => setTeamLoading(false));
      } catch (e) {
        console.error(e);
        setTeamLoading(false);
      }
    }
    setTeamLoading(false);

    if (vestingTeam.value !== genesisAddress) {
      getVestsTeamList().catch(console.error);
    }
  }, [vestingTeam.value, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      try {
        await network
          .call('staking', 'delegates', [
            vestingTeam.value,
            Number(
              getStakes.value['dates'][getStakes.value['dates'].length - 2],
            ),
          ])
          .then(res => {
            setDelegateLoading(false);
            if (
              res.toString().toLowerCase() !== vestingTeam.value.toLowerCase()
            ) {
              setDelegate(res);
            }
            return false;
          });
      } catch (e) {
        console.error(e);
        setDelegateLoading(false);
      }
    }
    if (unlockTeamDate !== '') {
      getDelegate();
      setLocked(
        Number(unlockTeamDate) > Math.round(new Date().getTime() / 1e3),
      );
    }
  }, [vestingTeam.value, unlockTeamDate, delegate, getStakes.value]);

  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        await vesting_withdraw(vestingTeam.value.toLowerCase(), account);
      } catch (e) {
        console.error(e);
      }
    },
    [vestingTeam.value, account],
  );

  return (
    <>
      {vestingTeam.value !== genesisAddress && (
        <>
          {teamLoading ? (
            <tr>
              <td colSpan={7} className="skeleton"></td>
            </tr>
          ) : (
            <tr>
              <td>
                <div className="username flex items-center">
                  <div>
                    <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                  </div>
                  <div className="text-sm font-normal hidden xl:block">
                    SOV Team
                  </div>
                </div>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p className={`${!lockedAmountTeam.value && 'skeleton'}`}>
                  {numberFromWei(lockedAmountTeam.value)} CSOV
                </p>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {delegate.length > 0 && (
                  <>
                    Delegated to{' '}
                    <LinkToExplorer
                      isAddress={true}
                      txHash={delegate}
                      className={`text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal ${
                        delegateLoading && 'skeleton'
                      }`}
                    />
                  </>
                )}
                {!delegate.length && <p>No delegate</p>}
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p className={`${!stakingPeriodTeamStart && 'skeleton'}`}>
                  {moment(
                    new Date(parseInt(stakingPeriodTeamStart) * 1e3),
                  ).format('DD/MM/YYYY - h:mm:ss a')}
                </p>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {locked && (
                  <p className={`${!unlockTeamDate && 'skeleton'}`}>
                    {Math.abs(
                      moment().diff(
                        moment(new Date(parseInt(unlockTeamDate) * 1e3)),
                        'days',
                      ),
                    )}{' '}
                    days
                  </p>
                )}
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p className={`${!unlockTeamDate && 'skeleton'}`}>
                  {moment(new Date(parseInt(unlockTeamDate) * 1e3)).format(
                    'DD/MM/YYYY',
                  )}
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
                    disabled={locked}
                    className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-12 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                    onClick={handleWithdrawSubmit}
                  >
                    Unstake
                  </button>
                </div>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
}
