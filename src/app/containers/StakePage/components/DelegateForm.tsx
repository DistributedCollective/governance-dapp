import React, { FormEvent } from 'react';
interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  address: string;
  fee: string;
  onChangeAddress: (value: string) => void;
  isValid: boolean;
  onCloseModal: () => void;
}

export function DelegateForm(props: Props) {
  return (
    <>
      <h3 className="text-center mb-10 leading-10 text-3xl">Delegate</h3>
      <form onSubmit={props.handleSubmit}>
        <div className="mb-9 md:px-9 tracking-normal">
          <label
            className="leading-4 block text-theme-white text-md font-medium mb-2"
            htmlFor="address"
          >
            Delegate To:
          </label>
          <div className="flex space-x-4 relative">
            <input
              className="appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-2 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              value={props.address}
              placeholder="Enter or paste address"
              onChange={e => props.onChangeAddress(e.currentTarget.value)}
            />
          </div>

          <p className="block text-theme-white text-md font-light mb-2 mt-7">
            Tx Fee: {props.fee} rBTC
          </p>
        </div>
        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <button
            type="submit"
            className={`uppercase w-full text-black bg-gold text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
              !props.isValid &&
              'opacity-50 cursor-not-allowed hover:bg-opacity-100'
            }`}
            disabled={!props.isValid}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => {
              props.onCloseModal();
              props.onChangeAddress('');
            }}
            className="border border-gold rounded-lg text-gold uppercase w-full text-xl font-extrabold px-4 py-2 hover:bg-gold hover:bg-opacity-40 transition duration-500 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
