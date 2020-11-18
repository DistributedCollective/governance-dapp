import { bignumber } from 'mathjs';
import { blockTime } from '../app/containers/BlockChainProvider/classifiers';
import { ContractName } from '../app/containers/BlockChainProvider/types';
import { contracts } from '../app/containers/BlockChainProvider/contracts';
import { store } from '../store/store';
import { Unit } from 'web3-utils';

export const genesisAddress = '0x0000000000000000000000000000000000000000';

export function kFormatter(num) {
  return Math.abs(num) > 999
    ? `${Number(
        Math.sign(num) * Math.floor(Math.abs(num) / 1000),
      ).toLocaleString()}k`
    : `${Number(Math.sign(num) * Math.abs(num)).toLocaleString()}`;
}

export function getSecondsBetweenBlocks(
  startBlock: number,
  endBlock: number,
): number {
  return (Number(endBlock) - Number(startBlock)) * blockTime;
}

export function printDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export function dateByBlocks(
  startTime: number,
  startBlock: number,
  endBlock: number,
) {
  return printDate(
    (Number(startTime) + getSecondsBetweenBlocks(startBlock, endBlock)) * 1000,
  );
}

export function prettyTx(
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
}

export function getContract(contractName: ContractName) {
  const { network } = store.getState().blockChainProvider;
  return contracts[network][contractName];
}

export const roundToSmaller = (amount: any, decimals: number): string => {
  const bn = bignumber(amount);
  let [integer, decimal] = bn.toFixed(128).split('.');

  if (decimal && decimal.length) {
    decimal = decimal.substr(0, decimals);
  } else {
    decimal = '0'.repeat(decimals);
  }

  if (decimal.length < decimals) {
    decimal = decimal + '0'.repeat(decimals - decimal.length);
  }

  if (decimal !== '') {
    return `${integer}.${decimal}`;
  }
  return `${integer}`;
};

export const fromWei = (amount: any, unit: Unit = 'ether') => {
  let decimals = 0;
  switch (unit) {
    case 'ether':
      decimals = 18;
      break;
    default:
      throw new Error('Unsupported unit (custom fromWei helper)');
  }
  return roundToSmaller(bignumber(amount || '0').div(10 ** decimals), decimals);
};

export const toWei = (amount: any, unit: Unit = 'ether') => {
  let decimals = 0;
  switch (unit) {
    case 'ether':
      decimals = 18;
      break;
    default:
      throw new Error('Unsupported unit (custom toWei helper)');
  }

  return roundToSmaller(bignumber(amount || '0').mul(10 ** decimals), 0);
};

export const numberFromWei = (amount: any, unit: Unit = 'ether') => {
  return Number(fromWei(amount, unit));
};

export const handleNumberInput = (value, onlyPositive = true) => {
  return handleNumber(value.currentTarget.value, onlyPositive);
};

export const handleNumber = (value, onlyPositive = true) => {
  if (value === undefined || value === null) {
    value = '';
  }

  if (value === '') {
    return value;
  }

  let number = value.replace(',', '.').replace(/[^\d.-]/g, '');

  if (onlyPositive) {
    number = number.replace('-', '');
  }

  if (onlyPositive && Number(number) < 0) {
    return Math.abs(number).toString();
  }

  if (number.length === 1 && number === '.') {
    return '0.';
  }

  if (isNaN(number) && number !== '-') {
    return '';
  }

  return number.toString();
};
