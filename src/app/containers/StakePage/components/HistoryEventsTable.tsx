import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { numberFromWei } from 'utils/helpers';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { StyledTable } from './StyledTable';
import { genesisAddress } from '../../../../utils/helpers';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import logoSvg from 'assets/images/sovryn-icon.svg';
import moment from 'moment';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';

export function HistoryEventsTable() {
  const account = useAccount();
  const getStakes = useStaking_getStakes(account);
  const vesting = useVesting_getVesting(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const [eventsHistory, setEventsHistory] = useState<any>();
  const [eventsHistoryVesting, setEventsHistoryVesting] = useState<any>();
  const [eventsHistoryVestingTeam, setEventsHistoryVestingTeam] = useState<
    any
  >();
  const [viewHistory, setViewHistory] = useState(false);
  const [viewVestingHistory, setViewVestingHistory] = useState(false);
  const [viewVestingTeamHistory, setViewVestingTeamHistory] = useState(false);

  useEffect(() => {
    async function getHistoryEvent() {
      try {
        await network
          .getPastEvents('staking', 'TokensStaked', { staker: account }, 0)
          .then(res => {
            setEventsHistory(res);
            if (vesting.value !== genesisAddress) {
              setViewVestingHistory(true);
            }
            setViewHistory(false);
          });
      } catch (e) {
        console.error(e);
      }
    }
    async function getHistoryEventVesting() {
      try {
        await network
          .getPastEvents(
            'staking',
            'TokensStaked',
            { staker: vesting.value },
            0,
          )
          .then(res => {
            setEventsHistoryVesting(res);
            if (vestingTeam.value !== genesisAddress) {
              setViewVestingTeamHistory(true);
            }
            setViewVestingHistory(false);
          });
      } catch (e) {
        console.error(e);
      }
    }
    async function getHistoryEventVestingTeam() {
      try {
        await network
          .getPastEvents(
            'staking',
            'TokensStaked',
            { staker: vestingTeam.value },
            0,
          )
          .then(res => {
            setEventsHistoryVestingTeam(res);
            setViewVestingTeamHistory(false);
          });
      } catch (e) {
        console.error(e);
      }
    }
    if (viewHistory) {
      getHistoryEvent();
    }
    if (viewVestingHistory) {
      getHistoryEventVesting();
    }
    if (viewVestingTeamHistory) {
      getHistoryEventVestingTeam();
    }
  }, [
    account,
    viewHistory,
    vestingTeam.value,
    vesting.value,
    getStakes.value,
    viewVestingHistory,
    viewVestingTeamHistory,
  ]);

  return (
    <>
      <p className="font-normal text-lg ml-6 mb-1 mt-16">Staking History</p>
      <div className="bg-gray-light rounded-b shadow max-h-96 overflow-y-auto mb-10">
        <div className="rounded-lg border sovryn-table pt-1 pb-0 pr-5 pl-5 max-h-96 overflow-y-auto">
          <StyledTable className="w-full">
            <thead>
              <tr>
                <th className="text-left assets">Asset</th>
                <th className="text-left">Staked Amount</th>
                <th className="text-left hidden lg:table-cell">Staking Date</th>
                <th className="text-left hidden lg:table-cell">Total Staked</th>
              </tr>
            </thead>
            <tbody className="mt-5 font-montserrat text-xs">
              {eventsHistory &&
                eventsHistory.length > 0 &&
                eventsHistory.map((item, i: string) => {
                  return (
                    <tr key={i}>
                      <td>
                        <div className="username flex items-center">
                          <div>
                            <img
                              src={logoSvg}
                              className="ml-3 mr-3"
                              alt="sov"
                            />
                          </div>
                          <div className="text-sm font-normal hidden xl:block">
                            SOV
                          </div>
                        </div>
                      </td>
                      <td className="text-left font-normal">
                        {numberFromWei(item.returnValues.amount)} SOV
                      </td>
                      <td className="text-left hidden lg:table-cell font-normal relative">
                        <div className="flex items-center">
                          <div>
                            {moment(
                              new Date(
                                parseInt(item.returnValues.lockedUntil) * 1e3,
                              ),
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
                eventsHistoryVesting.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="username flex items-center">
                          <div>
                            <img
                              src={logoSvg}
                              className="ml-3 mr-3"
                              alt="sov"
                            />
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
                              new Date(
                                parseInt(item.returnValues.lockedUntil) * 1e3,
                              ),
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
                eventsHistoryVestingTeam.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="username flex items-center">
                          <div>
                            <img
                              src={logoSvg}
                              className="ml-3 mr-3"
                              alt="sov"
                            />
                          </div>
                          <div className="text-sm font-normal hidden xl:block">
                            SOV
                          </div>
                        </div>
                      </td>
                      <td className="text-left font-normal">
                        {numberFromWei(item.returnValues.amount)} SOV
                        <br />
                      </td>
                      <td className="text-left hidden lg:table-cell font-normal relative">
                        <div className="flex items-center">
                          <div>
                            {moment(
                              new Date(
                                parseInt(item.returnValues.lockedUntil) * 1e3,
                              ),
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
              {viewHistory || viewVestingHistory || viewVestingTeamHistory ? (
                <tr>
                  <td colSpan={4} className="text-center font-normal">
                    <StyledLoading className="loading">
                      <div className="loading__letter">L</div>
                      <div className="loading__letter">o</div>
                      <div className="loading__letter">a</div>
                      <div className="loading__letter">d</div>
                      <div className="loading__letter">i</div>
                      <div className="loading__letter">n</div>
                      <div className="loading__letter">g</div>
                      <div className="loading__letter">.</div>
                      <div className="loading__letter">.</div>
                      <div className="loading__letter">.</div>
                    </StyledLoading>
                  </td>
                </tr>
              ) : (
                <>
                  {!eventsHistory &&
                    !eventsHistoryVesting &&
                    !eventsHistoryVestingTeam && (
                      <tr>
                        <td colSpan={4} className="text-center font-normal">
                          <button
                            type="button"
                            className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                            onClick={() => setViewHistory(true)}
                          >
                            Click to view history
                          </button>
                        </td>
                      </tr>
                    )}
                </>
              )}
            </tbody>
          </StyledTable>
        </div>
      </div>
    </>
  );
}

const StyledLoading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > div {
    animation-name: bounce;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      animation-delay: 0.2s;
    }
    &:nth-child(4) {
      animation-delay: 0.3s;
    }
    &:nth-child(5) {
      animation-delay: 0.4s;
    }
    &:nth-child(6) {
      animation-delay: 0.5s;
    }
    &:nth-child(7) {
      animation-delay: 0.6s;
    }
    &:nth-child(8) {
      animation-delay: 0.8s;
    }
    &:nth-child(9) {
      animation-delay: 1s;
    }
    &:nth-child(10) {
      animation-delay: 1.2s;
    }
  }
  @keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    40% {
      transform: translateY(-10px);
    }
    80%,
    100% {
      transform: translateY(0px);
    }
  }
`;
