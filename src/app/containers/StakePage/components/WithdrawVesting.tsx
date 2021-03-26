import React, { useCallback, useState } from 'react';
import { numberFromWei } from 'utils/helpers';
import { useAccount } from 'app/hooks/useAccount';
import { useGetUnlockedVesting } from '../../../hooks/useGetUnlockedVesting';
import { vesting_withdraw } from '../../BlockChainProvider/requests/vesting';
import { isAddress } from 'web3-utils';
interface Props {
  vesting: string;
  onCloseModal: () => void;
}

export function WithdrawVesting(props: Props) {
  const account = useAccount();
  const [address, setAddress] = useState(account);
  const [sending, setSending] = useState(false);
  const { value, loading } = useGetUnlockedVesting(props.vesting);

  const validate = () => {
    return (
      !loading && !sending && value !== '0' && isAddress(address.toLowerCase())
    );
  };

  const submitForm = useCallback(
    async e => {
      e.preventDefault();
      setSending(true);
      try {
        await vesting_withdraw(
          props.vesting.toLowerCase(),
          address.toLowerCase(),
          account.toLowerCase(),
        );
        props.onCloseModal();
        setSending(false);
      } catch (e) {
        console.error(e);
        setSending(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, account, props.vesting],
  );

  return (
    <>
      <h3 className="text-center mb-10 leading-10 text-3xl">Unstake SOV</h3>
      <form onSubmit={submitForm}>
        <div className="mb-9 md:px-9 tracking-normal">
          <label
            className="leading-4 block text-theme-white text-md font-medium mb-2"
            htmlFor="address"
          >
            Receive SOV at:
          </label>
          <div className="flex space-x-4 relative">
            <input
              className="appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-2 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              value={address}
              placeholder="Enter or paste address"
              onChange={e => setAddress(e.currentTarget.value)}
            />
          </div>

          <label
            className="block text-theme-white text-md font-medium mb-2 mt-8"
            htmlFor="voting-power"
          >
            Unlocked SOV:
          </label>
          <div className="flex space-x-4">
            <div className="border text-theme-white appearance-none text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-3 bg-transparent tracking-normal focus:outline-none focus:shadow-outline">
              {loading ? 'Loading...' : numberFromWei(value)}
            </div>
          </div>

          <p className="block text-theme-white text-md font-light mb-2 mt-7">
            Tx Fee: 0.0006 rBTC
          </p>
        </div>

        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <button
            type="submit"
            className={`uppercase w-full text-black bg-gold text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
              !validate() && 'bg-opacity-25'
            }`}
            disabled={!validate()}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="border border-gold rounded-lg text-gold uppercase w-full text-xl font-extrabold px-4 py-2 hover:bg-gold hover:bg-opacity-40 transition duration-500 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
