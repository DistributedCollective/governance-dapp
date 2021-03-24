import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { numberFromWei, genesisAddress } from 'utils/helpers';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import { actions } from 'app/containers/BlockChainProvider/slice';
import VestingABI from '../../BlockChainProvider/abi/Vesting.json';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';

export function VestingTable() {
  const account = useAccount();
  const vesting = useVesting_getVesting(account);
  const dispatch = useDispatch();
  const getStakes = useStaking_getStakes(vesting.value);
  const lockedAmount = useStaking_balanceOf(vesting.value as string);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);
  const [delegate, setDelegate] = useState<any>([]);
  const [delegateLoading, setDelegateLoading] = useState(false);

  useEffect(() => {
    setVestLoading(true);
    async function getVestsList() {
      try {
        Promise.all([
          network
            .callCustomContract(
              vesting.value as any,
              VestingABI,
              'startDate',
              [],
            )
            .then(res => setStakingPeriodStart(res)),
          network
            .callCustomContract(
              vesting.value as any,
              VestingABI,
              'duration',
              [],
            )
            .then(res => setStakingPeriod(res)),
          network
            .callCustomContract(vesting.value as any, VestingABI, 'endDate', [])
            .then(res => setUnlockDate(res)),
        ]).then(_ => setVestLoading(false));
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    if (vesting.value !== genesisAddress) {
      getVestsList().catch(console.error);
    }
  }, [vesting.value, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      try {
        await network
          .call('staking', 'delegates', [
            vesting.value,
            Number(
              getStakes.value['dates'][getStakes.value['dates'].length - 2],
            ),
          ])
          .then(res => {
            setDelegateLoading(false);
            if (res.toString().toLowerCase() !== vesting.value.toLowerCase()) {
              setDelegate(res);
            }
            return false;
          });
      } catch (e) {
        console.error(e);
        setDelegateLoading(false);
      }
    }
    if (unlockDate !== '') {
      getDelegate();
    }
  }, [vesting.value, unlockDate, delegate, getStakes.value]);

  const locked = Number(unlockDate) > Math.round(new Date().getTime() / 1e3); //check if date is locked

  return (
    <>
      {vesting.value !== genesisAddress && (
        <>
          {vestLoading ? (
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
                    CSOV Genesis
                  </div>
                </div>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p className={`${!lockedAmount.value && 'skeleton'}`}>
                  {numberFromWei(lockedAmount.value)} CSOV
                </p>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p className={`${!stakingPeriodStart && 'skeleton'}`}>
                  {moment(new Date(parseInt(stakingPeriodStart) * 1e3)).format(
                    'DD/MM/YYYY - h:mm:ss a',
                  )}
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
                <p className={`${!stakingPeriod && 'skeleton'}`}>
                  {moment(new Date(parseInt(stakingPeriod))).format('d')} weeks
                </p>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p className={`${!unlockDate && 'skeleton'}`}>
                  {moment(new Date(parseInt(unlockDate) * 1e3)).format(
                    'DD/MM/YYYY',
                  )}
                  {locked && (
                    <>
                      <br />
                      {Math.abs(
                        moment().diff(
                          moment(new Date(parseInt(unlockDate) * 1e3)),
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
          )}
        </>
      )}
    </>
  );
}
