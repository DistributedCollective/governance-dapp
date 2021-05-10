/**
 *
 * StakePage
 *
 */

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import Rsk3 from '@rsksmart/rsk3';
import moment from 'moment-timezone';
import { bignumber } from 'mathjs';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { gas } from '../BlockChainProvider/gas-price';
import { Asset } from '../../../types/assets';
import { useAccount } from '../../hooks/useAccount';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { AssetsDictionary } from '../BlockChainProvider/dictionary/assets-dictionary';
import {
  genesisAddress,
  getContract,
  numberFromWei,
  weiToFixed,
  numberToUSD,
} from '../../../utils/helpers';
import { useSoV_balanceOf } from '../../hooks/sov/useSoV_balanceOf';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { LoadableValue } from '../../components/LoadableValue';
import { useStaking_WEIGHT_FACTOR } from '../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useStaking_getAccumulatedFees } from '../../hooks/staking/useStaking_getAccumulatedFees';
import { useStaking_computeWeightByDate } from '../../hooks/staking/useStaking_computeWeightByDate';
import {
  staking_allowance,
  staking_approve,
  staking_extendStakingDuration,
  staking_stake,
  staking_withdraw,
  staking_delegate,
  staking_withdrawFee,
  staking_numTokenCheckpoints,
} from '../BlockChainProvider/requests/staking';
import { Modal } from '../../components/Modal';
import { StakeForm } from './components/StakeForm';
import { DelegateForm } from './components/DelegateForm';
import { WithdrawForm } from './components/WithdrawForm';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { useIsConnected } from '../../hooks/useIsConnected';
import { ExtendStakeForm } from './components/ExtendStakeForm';
import { IncreaseStakeForm } from './components/IncreaseStakeForm';
import { HistoryEventsTable } from './components/HistoryEventsTable';
import { useCachedAssetPrice } from '../../hooks/useCachedAssetPrice';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
// import {
//   governance_proposalCount,
//   governance_propose,
// } from '../BlockChainProvider/requests/governance';
// import { Icon, Button } from '@blueprintjs/core';
// import { Popover2 } from '@blueprintjs/popover2';
import logoSvg from 'assets/images/sovryn-icon.svg';
import { CurrentVests } from './components/CurrentVests';
import { StyledTable } from './components/StyledTable';
import { isAddress, toWei } from 'web3-utils';
import { ContractName } from '../BlockChainProvider/types';
import { walletService } from '@sovryn/react-wallet';

const now = new Date();

export function StakePage() {
  const isConnected = useIsConnected();
  if (isConnected) {
    return <InnerStakePage />;
  }
  return (
    <>
      <Helmet>
        <title>Stake</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-gray-700 tracking-normal">
          <div className="container">
            <h2 className="text-white pt-8 pb-5 pl-10">Staking/Vesting</h2>
            <div className="w-full bg-gray-light text-center rounded-b shadow p-3">
              <i>Please connect with your wallet to use staking.</i>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InnerStakePage() {
  const account = useAccount();
  const balanceOf = useStaking_balanceOf(account);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const voteBalance = useStaking_getCurrentVotes(account);
  const kickoffTs = useStaking_kickoffTs();
  const getStakes = useStaking_getStakes(account);
  const sovBalanceOf = useSoV_balanceOf(account);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0 as any);
  const [timestamp, setTimestamp] = useState<number>(0 as any);
  const [loading, setLoading] = useState(false);
  const weiAmount = useWeiAmount(amount);
  const [stakeAmount, setStakeAmount] = useState(0);
  const weiWithdrawAmount = useWeiAmount(withdrawAmount);
  const [until, setUntil] = useState<number>(0 as any);
  const [prevTimestamp, setPrevTimestamp] = useState<number>(undefined as any);
  const [stakeForm, setStakeForm] = useState(false);
  const [delegateForm, setDelegateForm] = useState(false);
  const [extendForm, setExtendForm] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [increaseForm, setIncreaseForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [lockDate, setLockDate] = useState<number>(0 as any);
  const [votingPower, setVotingPower] = useState<number>(0 as any);
  const getWeight = useStaking_computeWeightByDate(
    Number(lockDate),
    Math.round(now.getTime() / 1e3),
  );

  const [stakesArray, setStakesArray] = useState([]);
  const [fee, setFee] = useState('');
  const [stakeLoad, setStakeLoad] = useState(false);
  const dates = getStakes.value['dates'];
  const stakes = getStakes.value['stakes'];
  const assets = useMemo(() => AssetsDictionary.list(), []);
  const [usdTotal, setUsdTotal] = useState(0) as any;

  useEffect(() => {
    async function getStakesEvent() {
      try {
        Promise.all(
          dates.map(async (value, index) => {
            const delegate = await network
              .call('staking', 'delegates', [account, value])
              .then(res => {
                if (res.toString().toLowerCase() !== account.toLowerCase()) {
                  return res;
                }
                return false;
              });
            return [stakes[index], value, delegate];
          }),
        ).then(result => {
          setStakesArray(result as any);
        });
        setStakeLoad(false);
      } catch (e) {
        console.error(e);
      }
    }
    if (dates && stakes !== undefined) {
      setStakeLoad(true);
      getStakesEvent().finally(() => {
        setStakeLoad(false);
      });
    }

    return () => {
      setStakesArray([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, getStakes.value, setStakesArray]);

  useEffect(() => {
    if (timestamp && weiAmount && (stakeForm || increaseForm || extendForm)) {
      setLockDate(timestamp);
      setWeight(getWeight.value);
      setVotingPower(
        (Number(weiAmount) * Number(weight)) / Number(WEIGHT_FACTOR.value),
      );
    } else {
      setLockDate(timestamp);
      setWeight('');
      setVotingPower(0);
    }
  }, [
    getWeight.value,
    weight,
    stakeForm,
    WEIGHT_FACTOR.value,
    weiAmount,
    timestamp,
    increaseForm,
    extendForm,
  ]);

  //Form Validations
  const validateStakeForm = useCallback(() => {
    if (loading) return false;
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf, timestamp]);

  const validateDelegateForm = useCallback(() => {
    if (loading) return false;
    if (!timestamp || timestamp < Math.round(now.getTime() / 1e3)) return false;
    return Rsk3.utils.isAddress(address.toLowerCase());
  }, [loading, address, timestamp]);

  const validateIncreaseForm = useCallback(() => {
    if (loading) return false;
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf]);

  const validateWithdrawForm = useCallback(
    amount => {
      if (loading) return false;
      const num = Number(withdrawAmount);
      if (!num || isNaN(num) || num <= 0) return false;
      return num <= Number(amount);
    },
    [withdrawAmount, loading],
  );

  const validateExtendTimeForm = useCallback(() => {
    if (loading) return false;
    return timestamp >= Math.round(now.getTime() / 1e3);
  }, [loading, timestamp]);

  //Submit Forms
  const handleStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        let nonce = await network.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(sovBalanceOf.value, account, nonce);
          nonce += 1;
        }
        await staking_stake(weiAmount, timestamp + 86400, account, nonce);
        setLoading(false);
        setStakeForm(!stakeForm);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [weiAmount, sovBalanceOf.value, account, timestamp, stakeForm],
  );

  const handleDelegateSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        await staking_delegate(address.toLowerCase(), timestamp, account);
        setLoading(false);
        setDelegateForm(!delegateForm);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [address, account, timestamp, delegateForm],
  );

  const handleIncreaseStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        let nonce = await network.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(weiAmount, account, nonce);
          nonce += 1;
        }
        await staking_stake(weiAmount, timestamp, account, nonce);
        setLoading(false);
        setIncreaseForm(!increaseForm);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [weiAmount, account, timestamp, increaseForm],
  );

  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);

      if (bignumber(weiWithdrawAmount).greaterThan(stakeAmount)) {
        await staking_withdraw(stakeAmount.toString(), until, account);
      } else {
        await staking_withdraw(weiWithdrawAmount, until, account);
      }

      setLoading(false);
      setWithdrawForm(!withdrawForm);
    },
    [weiWithdrawAmount, until, account, withdrawForm, stakeAmount],
  );

  const handleExtendTimeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        await staking_extendStakingDuration(prevTimestamp, timestamp, account);
        setLoading(false);
        setExtendForm(!extendForm);
      } catch (e) {
        setLoading(false);
      }
    },
    [prevTimestamp, timestamp, account, extendForm],
  );
  useEffect(() => {
    const updateFee = async () => {
      let contractName: ContractName = 'staking';
      let contractMethod = '';
      let args;
      if (delegateForm) {
        if (!isAddress(address.toLowerCase())) return;
        contractMethod = 'delegate';
        args = [address.toLowerCase(), timestamp];
      } else if (stakeForm) {
        contractMethod = 'stake';
        args = [
          toWei(amount || '0'),
          timestamp,
          genesisAddress,
          genesisAddress,
        ];
      } else if (increaseForm) {
        contractName = 'sovToken';
        contractMethod = 'allowance';
        args = [account, getContract('staking').address];
      } else if (extendForm) {
        contractMethod = 'extendStakingDuration';
        args = [prevTimestamp, timestamp + 86400];
      } else if (withdrawForm) {
        contractMethod = 'withdraw';
        args = [weiWithdrawAmount, until, account];
      }

      if (!contractMethod) return;

      const nonce = await network.nonce(walletService.address.toLowerCase());
      const gasEstimate = await network.estimateGas(
        contractName,
        contractMethod,
        args,
        nonce,
      );
      const gasPrice = gas.get();
      const feePrice = bignumber(gasPrice).mul(numberFromWei(gasEstimate));
      setFee(feePrice.toFixed(7));
    };
    updateFee();
  }, [
    timestamp,
    amount,
    delegateForm,
    stakeForm,
    increaseForm,
    extendForm,
    withdrawForm,
    address,
    account,
    prevTimestamp,
    weiWithdrawAmount,
    until,
  ]);

  let usdTotalValue = [] as any;
  const updateUsdTotal = e => {
    usdTotalValue.push(e);
    setUsdTotal(getUSDSum(usdTotalValue));
  };

  return (
    <>
      <Helmet>
        <title>Stake</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-gray-700 tracking-normal">
          <div className="container">
            <h2 className="text-white pt-8 pb-5 pl-10">Staking/Vesting</h2>
            <div className="xl:flex items-stretch justify-around mt-2">
              <div className="mx-2 bg-gray-800 staking-box p-8 pb-6 rounded-2xl w-full xl:w-1/4 mb-5 xl:mb-0">
                <p className="text-lg -mt-1">Total staked SOV</p>
                <p
                  className={`text-4-5xl mt-2 mb-6 ${
                    balanceOf.loading && 'skeleton'
                  }`}
                >
                  {numberFromWei(balanceOf.value).toLocaleString()} SOV
                </p>
                <Modal
                  show={stakeForm}
                  content={
                    <>
                      <StakeForm
                        handleSubmit={handleStakeSubmit}
                        amount={amount}
                        timestamp={timestamp}
                        fee={fee}
                        onChangeAmount={e => setAmount(e)}
                        onChangeTimestamp={e => setTimestamp(e)}
                        sovBalanceOf={sovBalanceOf}
                        isValid={validateStakeForm()}
                        kickoff={kickoffTs}
                        stakes={getStakes.value['dates']}
                        votePower={votingPower}
                        onCloseModal={() => setStakeForm(!stakeForm)}
                      />
                    </>
                  }
                />
                {sovBalanceOf.value !== '0' && (
                  <button
                    type="button"
                    className="bg-gold bg-opacity-10 hover:text-gold focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out text-lg text-gold hover:text-gray-light py-3 px-8 border transition-colors duration-300 ease-in-out border-gold rounded-xl"
                    onClick={() => {
                      setTimestamp(0);
                      setAmount('');
                      setStakeForm(!stakeForm);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(false);
                    }}
                  >
                    Add New Stake
                  </button>
                )}
              </div>

              <div className="mx-2 bg-gray-800 staking-box p-8 pb-6 rounded-2xl w-full xl:w-1/4 text-sm mb-5 xl:mb-0">
                <p className="text-lg -mt-1">Total earned fees Available</p>
                <p className="text-4-5xl mt-2 mb-6">
                  ≈ {numberToUSD(usdTotal, 4)}
                </p>
                {assets.map((item, i) => {
                  return (
                    <FeeBlock
                      usdTotal={e => updateUsdTotal(e)}
                      key={i}
                      contractToken={item}
                    />
                  );
                })}
              </div>

              <div className="mx-2 bg-gray-800 staking-box p-8 pb-6 rounded-2xl w-full xl:w-1/4 mb-5 xl:mb-0">
                <p className="text-lg -mt-1">Combined Voting Power</p>
                <p
                  className={`text-4-5xl mt-2 mb-6 ${
                    voteBalance.loading && 'skeleton'
                  }`}
                >
                  {numberFromWei(voteBalance.value).toLocaleString()}
                </p>
                <div className="flex flex-col items-start">
                  <Link
                    to={'/'}
                    className="bg-gold bg-opacity-10 hover:text-gold focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out px-8 py-3 text-lg text-gold hover:text-gray-light border transition-colors duration-300 ease-in-out border-gold rounded-xl hover:no-underline no-underline inline-block"
                  >
                    View Governance
                  </Link>
                </div>
              </div>
            </div>

            <p className="font-semibold text-lg ml-6 mb-4 mt-6">
              Current Stakes
            </p>
            <div className="bg-gray-light rounded-b shadow">
              <div className="rounded-lg border sovryn-table pt-1 pb-0 pr-5 pl-5 mb-5 max-h-96 overflow-y-auto">
                <StyledTable className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left assets">Asset</th>
                      <th className="text-left">Locked Amount</th>
                      <th className="text-left font-normal hidden lg:table-cell">
                        Voting Power:
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Staking Period
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Unlock Date
                      </th>
                      <th className="text-left hidden md:table-cell max-w-15 min-w-15">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="mt-5 font-montserrat text-xs">
                    <StakesOverview
                      stakes={stakesArray}
                      loading={stakeLoad || getStakes.loading}
                      onDelegate={a => {
                        setTimestamp(a);
                        setDelegateForm(!delegateForm);
                      }}
                      onExtend={(a, b) => {
                        setPrevTimestamp(b);
                        setTimestamp(b);
                        setAmount(numberFromWei(a).toString());
                        setStakeForm(false);
                        setExtendForm(true);
                        setIncreaseForm(false);
                        setWithdrawForm(false);
                      }}
                      onIncrease={(a, b) => {
                        setTimestamp(b);
                        setAmount(numberFromWei(a).toString());
                        setUntil(b);
                        setStakeForm(false);
                        setExtendForm(false);
                        setIncreaseForm(true);
                        setWithdrawForm(false);
                      }}
                      onUnstake={(a, b) => {
                        setAmount(numberFromWei(a).toString());
                        setWithdrawAmount(0);
                        setStakeAmount(a);
                        setTimestamp(b);
                        setUntil(b);
                        setStakeForm(false);
                        setExtendForm(false);
                        setIncreaseForm(false);
                        setWithdrawForm(true);
                      }}
                    />
                  </tbody>
                </StyledTable>
                <Modal
                  show={delegateForm}
                  content={
                    <>
                      <DelegateForm
                        handleSubmit={handleDelegateSubmit}
                        address={address}
                        fee={fee}
                        onChangeAddress={e => setAddress(e)}
                        isValid={validateDelegateForm()}
                        onCloseModal={() => setDelegateForm(!delegateForm)}
                      />
                    </>
                  }
                />
              </div>
            </div>
            <CurrentVests />
            <HistoryEventsTable />
          </div>
          <>
            {balanceOf.value !== '0' && (
              <>
                {increaseForm === true && (
                  <Modal
                    show={increaseForm}
                    content={
                      <>
                        <IncreaseStakeForm
                          handleSubmit={handleIncreaseStakeSubmit}
                          amount={amount}
                          fee={fee}
                          timestamp={timestamp}
                          onChangeAmount={e => setAmount(e)}
                          sovBalanceOf={sovBalanceOf}
                          isValid={validateIncreaseForm()}
                          balanceOf={balanceOf}
                          votePower={votingPower}
                          onCloseModal={() => setIncreaseForm(!increaseForm)}
                        />
                      </>
                    }
                  />
                )}
                {extendForm === true && (
                  <Modal
                    show={extendForm}
                    content={
                      <>
                        {kickoffTs.value !== '0' && (
                          <ExtendStakeForm
                            handleSubmit={handleExtendTimeSubmit}
                            amount={amount}
                            fee={fee}
                            timestamp={timestamp}
                            onChangeTimestamp={e => setTimestamp(e)}
                            sovBalanceOf={sovBalanceOf}
                            kickoff={kickoffTs}
                            isValid={validateExtendTimeForm()}
                            stakes={getStakes.value['dates']}
                            balanceOf={balanceOf}
                            votePower={votingPower}
                            prevExtend={prevTimestamp}
                            onCloseModal={() => setExtendForm(!extendForm)}
                          />
                        )}
                      </>
                    }
                  />
                )}
                {withdrawForm === true && (
                  <Modal
                    show={withdrawForm}
                    content={
                      <>
                        <WithdrawForm
                          handleSubmit={handleWithdrawSubmit}
                          withdrawAmount={withdrawAmount}
                          amount={amount}
                          fee={fee}
                          until={timestamp}
                          onChangeAmount={e => {
                            setWithdrawAmount(e);
                            setLoading(false);
                          }}
                          sovBalanceOf={sovBalanceOf}
                          balanceOf={balanceOf}
                          isValid={validateWithdrawForm(amount)}
                          onCloseModal={() => setWithdrawForm(!withdrawForm)}
                        />
                      </>
                    }
                  />
                )}
              </>
            )}
          </>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface Stakes {
  stakes: any[] | any;
  loading: boolean;
  onIncrease: (a: number, b: number) => void;
  onExtend: (a: number, b: number) => void;
  onUnstake: (a: number, b: number) => void;
  onDelegate: (a: number) => void;
}

const StakesOverview: React.FC<Stakes> = ({
  stakes,
  loading,
  onIncrease,
  onExtend,
  onUnstake,
  onDelegate,
}) => {
  return (
    <>
      {loading && !stakes.length && (
        <tr>
          <td colSpan={99} className="text-center font-normal">
            Loading, please wait...
          </td>
        </tr>
      )}
      {!loading && !stakes.length && (
        <tr>
          <td colSpan={99} className="text-center font-normal">
            No stakes yet.
          </td>
        </tr>
      )}
      {stakes.map((item, i: string) => {
        const locked = Number(item[1]) > Math.round(now.getTime() / 1e3); //check if date is locked
        return (
          <tr key={i}>
            <td>
              <div className="assetname flex items-center">
                <div>
                  <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                </div>
                <div className="text-sm font-normal hidden xl:block pl-3">
                  SOV
                </div>
              </div>
            </td>
            <td className="text-left font-normal">
              {numberFromWei(item[0])} SOV
            </td>
            <td className="text-left hidden lg:table-cell font-normal">
              {item[2].length && (
                <>
                  Delegated to{' '}
                  <LinkToExplorer
                    isAddress={true}
                    txHash={item[2]}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  />
                </>
              )}
              {!item[2].length && <>No delegate</>}
            </td>
            <td className="text-left hidden lg:table-cell font-normal">
              {locked && (
                <>
                  {Math.abs(
                    moment().diff(
                      moment(new Date(parseInt(item[1]) * 1e3)),
                      'days',
                    ),
                  )}{' '}
                  days
                </>
              )}
            </td>
            <td className="text-left hidden lg:table-cell font-normal">
              <>
                {moment
                  .tz(new Date(parseInt(item[1]) * 1e3), 'GMT')
                  .format('DD/MM/YYYY - h:mm:ss a z')}
              </>
            </td>
            <td className="md:text-left lg:text-right hidden md:table-cell max-w-15 min-w-15">
              <div className="flex flex-nowrap">
                <button
                  type="button"
                  className={`text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat ${
                    !locked &&
                    'bg-transparent hover:bg-opacity-0 opacity-50 cursor-not-allowed hover:bg-transparent'
                  }`}
                  onClick={() => onIncrease(item[0], item[1])}
                  disabled={!locked}
                >
                  Increase
                </button>
                <button
                  type="button"
                  className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-8 px-5 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                  onClick={() => onExtend(item[0], item[1])}
                >
                  Extend
                </button>
                <button
                  type="button"
                  className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-8 px-5 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                  onClick={() => onUnstake(item[0], item[1])}
                >
                  Unstake
                </button>
                <button
                  className={`text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat ${
                    !locked &&
                    'bg-transparent hover:bg-opacity-0 opacity-50 cursor-not-allowed hover:bg-transparent'
                  }`}
                  onClick={() => onDelegate(item[1])}
                  disabled={!locked}
                >
                  Delegate
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
};

interface FeeProps {
  contractToken: any;
  usdTotal: (e: any) => void;
}

function FeeBlock({ contractToken, usdTotal }: FeeProps) {
  const account = useAccount();
  const token = (contractToken.asset + '_token') as any;
  const dollars = useCachedAssetPrice(contractToken.asset, Asset.USDT);
  const tokenAddress = getContract(token).address;
  const currency = useStaking_getAccumulatedFees(account, tokenAddress);
  const dollarValue = useMemo(() => {
    if (currency.value === null) return '';
    return bignumber(currency.value)
      .mul(dollars.value)
      .div(10 ** contractToken.decimals)
      .toFixed(0);
  }, [dollars.value, currency.value, contractToken.decimals]);

  const handleWithdrawFee = useCallback(
    async e => {
      e.preventDefault();
      try {
        const numTokenCheckpoints = (await staking_numTokenCheckpoints(
          tokenAddress,
        )) as string;
        await staking_withdrawFee(tokenAddress, numTokenCheckpoints, account);
      } catch (e) {
        console.error(e);
      }
    },
    [tokenAddress, account],
  );

  useEffect(() => {
    usdTotal(Number(weiToFixed(dollarValue, 4)));
  }, [currency.value, dollarValue, usdTotal]);

  return (
    <>
      {Number(currency.value) > 0 && (
        <div className="flex justify-between items-center mb-1 mt-1 leading-6">
          <div className="w-1/5">{contractToken.asset}</div>
          <div className="w-1/2 ml-6">
            {numberFromWei(currency.value).toFixed(3)} ≈{' '}
            <LoadableValue
              value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
              loading={dollars.loading}
            />
          </div>
          <button
            onClick={handleWithdrawFee}
            type="button"
            className="text-gold hover:text-gold p-0 text-normal lowercase hover:underline font-medium font-montserrat tracking-normal"
          >
            Withdraw
          </button>
        </div>
      )}
    </>
  );
}

function getUSDSum(array) {
  return array.reduce(function (sum, value) {
    return sum + value;
  }, 0);
}
