import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { numberFromWei, genesisAddress } from 'utils/helpers';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment-timezone';
import { actions } from 'app/containers/BlockChainProvider/slice';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { useStaking_balanceOf } from '../../../hooks/staking/useStaking_balanceOf';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { Modal } from '../../../components/Modal';
import { WithdrawVesting } from './WithdrawVesting';
import {
  vesting_getEndDate,
  vesting_getStartDate,
} from '../../BlockChainProvider/requests/vesting';

interface Props {
  vestingAddress: string;
  type: 'genesis' | 'origin' | 'team' | 'reward';
}

export function VestingContract(props: Props) {
  const account = useAccount();
  const dispatch = useDispatch();
  const getStakes = useStaking_getStakes(props.vestingAddress);
  const lockedAmount = useStaking_balanceOf(props.vestingAddress);
  const [stakingPeriodStart, setStakingPeriodStart] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [vestLoading, setVestLoading] = useState(false);
  const [locked, setLocked] = useState(true);
  const [delegate, setDelegate] = useState<any>([]);
  const [delegateLoading, setDelegateLoading] = useState(false);

  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    async function getVestsList() {
      try {
        setVestLoading(true);
        Promise.all([
          vesting_getStartDate(props.vestingAddress).then(res =>
            setStakingPeriodStart(res),
          ),
          vesting_getEndDate(props.vestingAddress).then(res =>
            setUnlockDate(res),
          ),
        ]).then(_ => setVestLoading(false));
        setVestLoading(false);
      } catch (e) {
        console.error(e);
        setVestLoading(false);
      }
    }
    setVestLoading(false);
    if (props.vestingAddress !== genesisAddress) {
      getVestsList().catch(console.error);
    }
  }, [props.vestingAddress, account]);

  useEffect(() => {
    async function getDelegate() {
      setDelegateLoading(true);
      try {
        await network
          .call('staking', 'delegates', [
            props.vestingAddress,
            Number(
              getStakes.value['dates'][getStakes.value['dates'].length - 2],
            ),
          ])
          .then(res => {
            setDelegateLoading(false);
            if (
              res.toString().toLowerCase() !==
              props.vestingAddress.toLowerCase()
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
    if (unlockDate !== '') {
      getDelegate();
      setLocked(Number(unlockDate) > Math.round(new Date().getTime() / 1e3));
    }
  }, [props.vestingAddress, unlockDate, delegate, getStakes.value]);

  return (
    <>
      {vestLoading ? (
        <tr>
          <td colSpan={7} className="skeleton" />
        </tr>
      ) : (
        <tr>
          <td>
            <div className="assetname flex items-center">
              <div>
                <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
              </div>
              <div className="text-sm font-normal hidden xl:block pl-3">
                {props.type === 'genesis' && 'CSOV Genesis'}
                {props.type === 'origin' && 'SOV Origin'}
                {props.type === 'team' && 'SOV Team'}
                {props.type === 'reward' && 'Reward SOV'}
              </div>
            </div>
          </td>
          <td className="text-left font-normal">
            <p className={`${lockedAmount.loading && 'skeleton'}`}>
              {numberFromWei(lockedAmount.value || '0')}{' '}
              {props.type === 'genesis' ? 'CSOV' : 'SOV'}
            </p>
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            <p className={`${delegateLoading && 'skeleton'}`}>
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
              {!delegate.length && <>No delegate</>}
            </p>
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            <p>
              {stakingPeriodStart !== '0' ? (
                moment
                  .tz(new Date(parseInt(stakingPeriodStart) * 1e3), 'GMT')
                  .format('DD/MM/YYYY - h:mm:ss a z')
              ) : (
                <>-</>
              )}
            </p>
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            {locked ? (
              <p className={`${!unlockDate && 'skeleton'}`}>
                {unlockDate !== '0' ? (
                  Math.abs(
                    moment().diff(
                      moment(new Date(parseInt(unlockDate) * 1e3)),
                      'days',
                    ),
                  )
                ) : (
                  <>-</>
                )}{' '}
                days
              </p>
            ) : (
              <>-</>
            )}
          </td>
          <td className="text-left hidden lg:table-cell font-normal">
            <p className={`${!unlockDate && 'skeleton'}`}>
              {unlockDate !== '0' ? (
                moment
                  .tz(new Date(parseInt(unlockDate) * 1e3), 'GMT')
                  .format('DD/MM/YYYY - h:mm:ss a z')
              ) : (
                <>-</>
              )}
            </p>
          </td>
          <td className="md:text-left lg:text-right hidden md:table-cell max-w-15 min-w-15">
            <div className="flex flex-nowrap justify-end">
              <button
                className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                onClick={() => {
                  dispatch(actions.vestingType(props.type));
                  dispatch(actions.toggleDelagationDialog(true));
                }}
              >
                Delegate
              </button>
              <button
                type="button"
                className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-12 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                onClick={() => setShowWithdraw(true)}
                disabled={
                  !props.vestingAddress ||
                  props.vestingAddress === genesisAddress
                }
              >
                Withdraw
              </button>
            </div>
          </td>
        </tr>
      )}
      <Modal
        show={showWithdraw}
        content={
          <>
            <WithdrawVesting
              vesting={props.vestingAddress}
              onCloseModal={() => setShowWithdraw(false)}
            />
          </>
        }
      />
    </>
  );
}
