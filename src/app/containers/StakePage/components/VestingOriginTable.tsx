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
import { useVesting_getOriginVesting } from '../../../hooks/vesting-registry/useVesting_getOriginVesting';
import { useStaking_getCurrentVotes } from '../../../hooks/staking/useStaking_getCurrentVotes';

export function VestingOriginTable() {
  const account = useAccount();
  const vestingOrigin = useVesting_getOriginVesting(account);
  const lockedAmountOrigin = useStaking_balanceOf(vestingOrigin.value);
  const [originLoading, setOriginLoading] = useState(false);
  const [stakingPeriodOriginStart, setStakingPeriodOriginStart] = useState('');
  const [stakingOriginPeriod, setStakingOriginPeriod] = useState('');
  const [unlockOriginDate, setUnlockOriginDate] = useState('');
  const dispatch = useDispatch();
  const votingPower = useStaking_getCurrentVotes(vestingOrigin.value);

  useEffect(() => {
    setOriginLoading(true);
    async function getVestsOriginList() {
      try {
        Promise.all([
          network
            .callCustomContract(
              vestingOrigin.value as any,
              VestingABI,
              'startDate',
              [],
            )
            .then(res => setStakingPeriodOriginStart(res)),
          network
            .callCustomContract(
              vestingOrigin.value as any,
              VestingABI,
              'duration',
              [],
            )
            .then(res => setStakingOriginPeriod(res)),
          network
            .callCustomContract(
              vestingOrigin.value as any,
              VestingABI,
              'endDate',
              [],
            )
            .then(res => setUnlockOriginDate(res)),
        ]).then(_ => setOriginLoading(false));
      } catch (e) {
        console.error(e);
        setOriginLoading(false);
      }
    }
    if (vestingOrigin.value !== genesisAddress) {
      getVestsOriginList().catch(console.error);
    }
  }, [vestingOrigin.value, account]);

  const locked =
    Number(unlockOriginDate) > Math.round(new Date().getTime() / 1e3); //check if date is locked

  return (
    <>
      {vestingOrigin.value !== genesisAddress && (
        <>
          {originLoading ? (
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
                    CSOV Origin
                  </div>
                </div>
              </td>
              <td
                className={`text-left font-normal
                ${!lockedAmountOrigin.value && 'skeleton'}`}
              >
                {numberFromWei(lockedAmountOrigin.value)} CSOV
              </td>
              <td
                className={`text-left hidden lg:table-cell font-normal
                ${!stakingPeriodOriginStart && 'skeleton'}`}
              >
                {moment(
                  new Date(parseInt(stakingPeriodOriginStart) * 1e3),
                ).format('DD/MM/YYYY - h:mm:ss a')}
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {numberFromWei(votingPower.value).toLocaleString()}
              </td>
              <td
                className={`text-left hidden lg:table-cell font-normal
                ${!stakingOriginPeriod && 'skeleton'}`}
              >
                {moment(new Date(parseInt(stakingOriginPeriod))).format('d')}{' '}
                weeks
              </td>
              <td
                className={`text-left hidden lg:table-cell font-normal
                ${!unlockOriginDate && 'skeleton'}`}
              >
                <p>
                  {moment(new Date(parseInt(unlockOriginDate) * 1e3)).format(
                    'DD/MM/YYYY',
                  )}
                  {locked && (
                    <>
                      <br />
                      {Math.abs(
                        moment().diff(
                          moment(new Date(parseInt(unlockOriginDate) * 1e3)),
                          'days',
                        ),
                      )}{' '}
                      days
                    </>
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
      )}
    </>
  );
}
