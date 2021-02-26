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
        setEventsHistory(stakes);
        setEventsHistoryVesting(stakesVesting);
        setEventsHistoryVestingTeam(stakesVestingTeam);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    getHistoryEvent();
  }, [account, vestingTeam.value, vesting.value]);

  // console.log('eventsHistory', eventsHistory);

  return eventsHistory || eventsHistoryVesting || eventsHistoryVestingTeam ? (
    <>
      {eventsHistory &&
        eventsHistory.length > 0 &&
        !loading &&
        eventsHistory.map((item, i: string) => {
          return (
            <>
              <tr key={i}>
                <td>
                  <div className="username flex items-center">
                    <div>
                      <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                    </div>
                    <div className="text-sm font-normal hidden xl:block">
                      SOV
                    </div>
                  </div>
                </td>
                <td className="text-left hidden lg:table-cell font-normal">
                  {numberFromWei(item.returnValues.amount)} SOV
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
                  {numberFromWei(item.returnValues.totalStaked)} SOV
                </td>
              </tr>
              {/*<tr>
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
                <td className="text-left hidden lg:table-cell font-normal">
                  1000.00 SOV
                  <br />≈ 1000.00 USD
                </td>
                <td className="text-left font-normal">≈ 1000.00 USD</td>
                <td className="text-left hidden lg:table-cell font-normal">
                  100,000
                </td>
                <td className="text-left hidden lg:table-cell font-normal relative">
                  <div className="flex items-center">
                    <div>
                      03/01/21 - 14:05:51
                      <br />
                      <Link
                        to={{}}
                        className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                      >
                        0x413…89054
                      </Link>
                    </div>
                    <Popover2
                      popoverClassName="bg-transparent rounded-2xl overflow-hidden no-border focus:no-border no-outline active:no-outline focus:no-outline no-shadow ml-6 -mt-6"
                      placement="right-start"
                      interactionKind="click"
                      transitionDuration={100}
                      minimal={true}
                      content={
                        <div className="bg-gray-900 rounded-2xl p-8 text-xs">
                          <div className="mb-5">
                            03/01/21 - 14:05:51
                            <br />
                            <Link
                              to={{}}
                              className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                            >
                              0x413…89054
                            </Link>
                          </div>
                          <div className="mb-5">
                            03/01/21 - 14:05:51
                            <br />
                            <Link
                              to={{}}
                              className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                            >
                              0x413…89054
                            </Link>
                          </div>
                          <div>
                            03/01/21 - 14:05:51
                            <br />
                            <Link
                              to={{}}
                              className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                            >
                              0x413…89054
                            </Link>
                          </div>
                        </div>
                      }
                      renderTarget={({ isOpen, ref, ...props }) => (
                        <Button
                          {...props}
                          outlined={false}
                          minimal={true}
                          active={isOpen}
                          className="ml-8 cursor-pointer"
                          elementRef={ref as any}
                        >
                          <Icon
                            className="ml-8 cursor-pointer"
                            icon={isOpen ? 'minus' : 'plus'}
                            iconSize={25}
                            color="white"
                          />
                        </Button>
                      )}
                    />
                    <div className="bg-gray-900 rounded-2xl p-8 absolute -right-16 top-0 hidden">
                      <div className="mb-5">
                        03/01/21 - 14:05:51
                        <br />
                        <Link
                          to={{}}
                          className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                        >
                          0x413…89054
                        </Link>
                      </div>
                      <div className="mb-5">
                        03/01/21 - 14:05:51
                        <br />
                        <Link
                          to={{}}
                          className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                        >
                          0x413…89054
                        </Link>
                      </div>
                      <div>
                        03/01/21 - 14:05:51
                        <br />
                        <Link
                          to={{}}
                          className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                        >
                          0x413…89054
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-left hidden lg:table-cell font-normal">
                  4 weeks
                </td>
                <td className="text-left hidden lg:table-cell font-normal">
                  <p>03/01/21 - 14:05:51</p>
                </td>
                <td className="text-left font-normal">
                  03/01/21 - 14:05:51
                  <br />
                  <Link
                    to={{}}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  >
                    0x413…89054
                  </Link>
                </td>
              </tr>*/}
            </>
          );
        })}
      {eventsHistoryVesting &&
        eventsHistoryVesting.length > 0 &&
        !loading &&
        eventsHistoryVesting.map((item, i: string) => {
          return (
            <>
              <tr key={i}>
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
                <td className="text-left hidden lg:table-cell font-normal">
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
            </>
          );
        })}
      {eventsHistoryVestingTeam &&
        eventsHistoryVestingTeam.length > 0 &&
        !loading &&
        eventsHistoryVestingTeam.map((item, i: string) => {
          return (
            <>
              <tr key={i}>
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
                <td className="text-left hidden lg:table-cell font-normal">
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
            </>
          );
        })}
    </>
  ) : (
    <tr>
      <td
        colSpan={4}
        className={`text-center font-normal ${loading && 'skeleton'}`}
      >
        No history yet
      </td>
    </tr>
  );
}
