import React, { useState } from 'react';
import {
  governance_proposalThreshold,
  governance_propose,
} from '../BlockChainProvider/requests/governance';
import { isAddress } from 'web3-utils';
import { useHistory } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { useAccount } from 'app/hooks/useAccount';
import { FormSelect } from 'app/components/FormSelect';
import { useStaking_getCurrentVotes } from 'app/hooks/staking/useStaking_getCurrentVotes';
import { bignumber } from 'mathjs';
import { fromWei } from '../../../utils/helpers';
import { toastError } from 'utils/toaster';
import { ContractName } from '../BlockChainProvider/types';

const initRow = {
  target: '',
  value: '',
  signature: '',
  calldata: '',
};
export function ProposePage() {
  const history = useHistory();
  const [rows, setRows] = useState([initRow]);
  const [description, setDescription] = useState('');
  const [governor, setGovernor] = useState<ContractName>('governorAdmin');
  const account = useAccount();
  const votes = useStaking_getCurrentVotes(account);

  const updateRow = (value, field, rowIndex) => {
    const newRows = [...rows.map(row => ({ ...row }))];
    newRows[rowIndex][field] = value;
    setRows(newRows);
  };
  const invalidRows = () =>
    !!rows.find(
      row =>
        !isAddress(String(row.target).toLowerCase()) ||
        !row.value ||
        !row.signature ||
        !row.calldata,
    );
  const addRow = () => {
    if (invalidRows()) return;
    const newRows = [...rows];
    newRows.push(initRow);
    setRows(newRows);
  };
  const removeRow = index => {
    if (rows.length < 2) return;
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const invalidForm = () => {
    return invalidRows() || !description || rows.length < 1;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (invalidForm()) return;

    try {
      const threshold = await governance_proposalThreshold(governor);
      if (bignumber(votes.value).lessThan(`${threshold}`)) {
        const minVotingPower = Number(fromWei(threshold)).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          },
        );
        toastError(
          `Your voting power must be at least ${minVotingPower} to make a proposal`,
        );
        return;
      }

      const targets = rows.map(row => row.target);
      const values = rows.map(row => row.value);
      const signatures = rows.map(row => row.signature);
      const calldatas = rows.map(row => row.calldata);

      await governance_propose(
        targets,
        values,
        signatures,
        calldatas,
        description,
        account,
        governor,
      );
      history.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const options = [
    { label: 'Governor Admin', key: 'governorAdmin' },
    { label: 'Governor Owner', key: 'governorOwner' },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <label className="text-sm md:text-base">
            Send proposal to contract:
          </label>

          <FormSelect
            onChange={value => {
              setGovernor(value.key);
            }}
            value={governor}
            items={options}
            innerClasses=""
          />
        </div>

        <textarea
          className="mb-2 appearance-none border text-md font-semibold text-left rounded-lg w-full p-4 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
          placeholder="Description..."
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>

        {rows.map((row, i) => {
          return (
            <div
              className="relative mt-2 border border-theme-white rounded-lg pb-2 pt-6"
              key={i}
            >
              <Icon
                onClick={() => removeRow(i)}
                className={
                  'absolute top-1 right-2' +
                  (rows.length < 2 ? ' opacity-50' : ' cursor-pointer')
                }
                icon="remove"
                iconSize={15}
                color="white"
              />
              <div className="flex flex-col md:flex-row items-center mb-2 px-2 md:px-0">
                <input
                  className="mx-2 appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full mb-2 md:mb-0 py-2 px-2 md:px-14 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
                  type="text"
                  value={row.target}
                  onChange={e => updateRow(e.target.value, 'target', i)}
                  placeholder="Target"
                />
                <input
                  className="mx-2 appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-2 md:px-14 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
                  type="text"
                  value={row.value}
                  onChange={e => updateRow(e.target.value, 'value', i)}
                  placeholder="Value"
                />
              </div>
              <div className="flex flex-col md:flex-row items-center px-2 md:px-0">
                <input
                  className="mx-2 appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full mb-2 md:mb-0 py-2 px-2 md:px-14 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
                  type="text"
                  value={row.signature}
                  onChange={e => updateRow(e.target.value, 'signature', i)}
                  placeholder="Signature"
                />
                <input
                  className="mx-2 appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-2 md:px-14 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
                  type="text"
                  value={row.calldata}
                  onChange={e => updateRow(e.target.value, 'calldata', i)}
                  placeholder="Calldata"
                />
              </div>
            </div>
          );
        })}

        <div className="text-center">
          <Icon
            onClick={() => addRow()}
            className={
              'mt-8 mb-8 mx-auto cursor-pointer' +
              (invalidRows() ? ' opacity-50' : '')
            }
            icon="add"
            iconSize={35}
            color="white"
          />
        </div>

        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <button
            type="submit"
            className={`uppercase w-full text-black bg-gold text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
              invalidForm() &&
              'opacity-50 cursor-not-allowed hover:bg-opacity-100'
            }`}
            disabled={invalidForm()}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => history.goBack()}
            className="border border-gold rounded-lg text-gold uppercase w-full text-xl font-extrabold px-4 py-2 hover:bg-gold hover:bg-opacity-40 transition duration-500 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
