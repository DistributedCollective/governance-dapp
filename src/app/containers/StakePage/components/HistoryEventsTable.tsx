import React, { useEffect, useState } from 'react';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { numberFromWei } from 'utils/helpers';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';
import { useSoV_balanceOf } from '../../../hooks/sov/useSoV_balanceOf';

export function HistoryEventsTable() {
  const account = useAccount();
  const sovBalanceOf = useSoV_balanceOf(account);
  const vesting = useVesting_getVesting(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const [eventsHistory, setEventsHistory] = useState<any>();
  const [eventsHistoryVesting, setEventsHistoryVesting] = useState<any>();
  const [eventsHistoryVestingTeam, setEventsHistoryVestingTeam] = useState<
    any
  >();
  const [historyLoading, setHistoryLoading] = useState(false);
  useEffect(() => {
    let cleanupFunction = false;
    async function getHistoryEvent() {
      setHistoryLoading(true);
      try {
        const stakes = await network.getPastEvents(
          'staking',
          'TokensStaked',
          { staker: account },
          0,
          'latest',
        );
        const stakesVesting = await network.getPastEvents(
          'staking',
          'TokensStaked',
          { staker: vesting.value },
          0,
          'latest',
        );
        const stakesVestingTeam = await network.getPastEvents(
          'staking',
          'TokensStaked',
          { staker: vestingTeam.value },
          0,
          'latest',
        );
        if (!cleanupFunction) {
          setEventsHistory(stakes);
          setEventsHistoryVesting(stakesVesting);
          setEventsHistoryVestingTeam(stakesVestingTeam);
        }
        setHistoryLoading(false);
      } catch (e) {
        console.error(e);
        setHistoryLoading(false);
      }
    }
    getHistoryEvent();
    return () => {
      cleanupFunction = true;
    };
  }, [account, sovBalanceOf, vestingTeam.value, vesting.value]);

  return (eventsHistory && eventsHistory.length > 0) ||
    (eventsHistoryVesting && eventsHistoryVesting.length > 0) ||
    (eventsHistoryVestingTeam && eventsHistoryVestingTeam.length > 0) ? (
    <>
      {eventsHistory &&
        !historyLoading &&
        eventsHistory.map((item, i: string) => {
          return (
            <tr key={i}>
              <td>
                <div className="username flex items-center">
                  <div>
                    <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                  </div>
                  <div className="text-sm font-normal hidden xl:block">SOV</div>
                </div>
              </td>
              <td className="text-left font-normal">
                {numberFromWei(item.returnValues.amount)} SOV
              </td>
              <td className="text-left hidden lg:table-cell font-normal relative">
                <div className="flex items-center">
                  <div>
                    {moment(
                      new Date(parseInt(item.returnValues.lockedUntil) * 1e3),
                    ).format('DD/MM/YYYY - h:mm:ss a')}
                    <br />
                    <LinkToExplorer
                      txHash={item.transactionHash}
                      className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                    />
                  </div>
                </div>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {numberFromWei(item.returnValues.totalStaked)} SOV
              </td>
            </tr>
          );
        })}
      {eventsHistoryVesting &&
        !historyLoading &&
        eventsHistoryVesting.map(item => {
          return (
            <tr key={item.id}>
              <td>
                <div className="username flex items-center">
                  <div>
                    <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                  </div>
                  <div className="text-sm font-normal hidden xl:block">
                    CSOV
                  </div>
                </div>
              </td>
              <td className="text-left font-normal">
                {numberFromWei(item.returnValues.amount)} CSOV
                <br />
              </td>
              <td className="text-left hidden lg:table-cell font-normal relative">
                <div className="flex items-center">
                  <div>
                    {moment(
                      new Date(parseInt(item.returnValues.lockedUntil) * 1e3),
                    ).format('DD/MM/YYYY - h:mm:ss a')}
                    <br />
                    <LinkToExplorer
                      txHash={item.transactionHash}
                      className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                    />
                  </div>
                </div>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {numberFromWei(item.returnValues.totalStaked)} CSOV
              </td>
            </tr>
          );
        })}
      {eventsHistoryVestingTeam &&
        !historyLoading &&
        eventsHistoryVestingTeam.map(item => {
          return (
            <tr key={item.id}>
              <td>
                <div className="username flex items-center">
                  <div>
                    <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                  </div>
                  <div className="text-sm font-normal hidden xl:block">
                    CSOV
                  </div>
                </div>
              </td>
              <td className="text-left font-normal">
                {numberFromWei(item.returnValues.amount)} CSOV
                <br />
              </td>
              <td className="text-left hidden lg:table-cell font-normal relative">
                <div className="flex items-center">
                  <div>
                    {moment(
                      new Date(parseInt(item.returnValues.lockedUntil) * 1e3),
                    ).format('DD/MM/YYYY - h:mm:ss a')}
                    <br />
                    <LinkToExplorer
                      txHash={item.transactionHash}
                      className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                    />
                  </div>
                </div>
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {numberFromWei(item.returnValues.totalStaked)} CSOV
              </td>
            </tr>
          );
        })}
    </>
  ) : (
    <>
      <tr>
        <td
          colSpan={4}
          className={`text-center font-normal ${!historyLoading && 'skeleton'}`}
        >
          No history yet
        </td>
      </tr>
    </>
  );
}
