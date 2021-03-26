import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { numberFromWei, genesisAddress } from 'utils/helpers';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import VestingABI from '../../BlockChainProvider/abi/Vesting.json';
import { actions } from 'app/containers/BlockChainProvider/slice';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { vesting_withdraw } from '../../BlockChainProvider/requests/vesting';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useVesting_getOriginVesting } from '../../../hooks/vesting-registry/useVesting_getOriginVesting';

export function VestingOriginTable() {
  const account = useAccount();
  const dispatch = useDispatch();
  const vestingOrigin = useVesting_getOriginVesting(account);
  const getStakes = useStaking_getStakes(vestingOrigin.value);
  const lockedAmountOrigin = useStaking_balanceOf(vestingOrigin.value);
  const [originLoading, setOriginLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [stakingPeriodOriginStart, setStakingPeriodOriginStart] = useState('');
  const [unlockOriginDate, setUnlockOriginDate] = useState('');
  const [delegate, setDelegate] = useState<any>([]);
  const [delegateLoading, setDelegateLoading] = useState(false);

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
              'endDate',
              [],
            )
            .then(res => setUnlockOriginDate(res)),
        ]).then(_ => setOriginLoading(false));
        setOriginLoading(false);
      } catch (e) {
        console.error(e);
        setOriginLoading(false);
      }
    }
    if (vestingOrigin.value !== genesisAddress) {
      getVestsOriginList().catch(console.error);
    }
  }, [vestingOrigin.value, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      try {
        await network
          .call('staking', 'delegates', [
            vestingOrigin.value,
            Number(
              getStakes.value['dates'][getStakes.value['dates'].length - 2],
            ),
          ])
          .then(res => {
            setDelegateLoading(false);
            if (
              res.toString().toLowerCase() !== vestingOrigin.value.toLowerCase()
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
    if (unlockOriginDate !== '') {
      getDelegate();
      setLocked(
        Number(unlockOriginDate) > Math.round(new Date().getTime() / 1e3),
      );
    }
  }, [vestingOrigin.value, unlockOriginDate, delegate, getStakes.value]);

  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        await vesting_withdraw(vestingOrigin.value.toLowerCase(), account);
      } catch (e) {
        console.error(e);
      }
    },
    [vestingOrigin.value, account],
  );

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
              <td
                className={`text-left hidden lg:table-cell font-normal
                ${!stakingPeriodOriginStart && 'skeleton'}`}
              >
                {moment(
                  new Date(parseInt(stakingPeriodOriginStart) * 1e3),
                ).format('DD/MM/YYYY - h:mm:ss a')}
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {locked && (
                  <p className={`${!unlockOriginDate && 'skeleton'}`}>
                    {Math.abs(
                      moment().diff(
                        moment(new Date(parseInt(unlockOriginDate) * 1e3)),
                        'days',
                      ),
                    )}{' '}
                    days
                  </p>
                )}
              </td>
              <td
                className={`text-left hidden lg:table-cell font-normal
                ${!unlockOriginDate && 'skeleton'}`}
              >
                <p>
                  {moment(new Date(parseInt(unlockOriginDate) * 1e3)).format(
                    'DD/MM/YYYY',
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
                    disabled={locked}
                    className={`text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-12 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat ${
                      locked &&
                      'bg-transparent hover:bg-opacity-0 opacity-50 cursor-not-allowed hover:bg-transparent'
                    }`}
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
