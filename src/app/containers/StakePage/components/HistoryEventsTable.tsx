import React, { useEffect, useState } from 'react';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { numberFromWei } from 'utils/helpers';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';

export function HistoryEventsTable() {
  const account = useAccount();
  const vesting = useVesting_getVesting(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const [eventsHistory, setEventsHistory] = useState<any>();
  const [eventsHistoryVesting, setEventsHistoryVesting] = useState<any>();
  const [eventsHistoryVestingTeam, setEventsHistoryVestingTeam] = useState<
    any
  >();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    let cleanupFunction = false;
    async function getHistoryEvent() {
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
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    getHistoryEvent();
    return () => {
      cleanupFunction = true;
    };
  }, [account, vestingTeam.value, vesting.value]);

  return eventsHistory || eventsHistoryVesting || eventsHistoryVestingTeam ? (
    <>
      {eventsHistory &&
        !loading &&
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
        !loading &&
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
        !loading &&
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
      {loading && (
        <tr>
          <td colSpan={4} className="skeleton"></td>
        </tr>
      )}
    </>
  ) : (
    <>
      <tr>
        <td
          colSpan={4}
          className={`text-center font-normal ${loading && 'skeleton'}`}
        >
          No history yet
        </td>
      </tr>
    </>
  );
}
