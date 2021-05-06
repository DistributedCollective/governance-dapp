import { contracts } from '../BlockChainProvider/contracts';
import { toChecksumAddress } from '../../../utils/helpers';
import { ContractData } from '../../../types/contracts';
import { store } from '../../../store/store';

const fixContracts = () => {
  const newObj = {};
  const { network } = store.getState().blockChainProvider;
  const keys = Object.keys(contracts[network]);
  keys.forEach(key => {
    if (contracts[network].hasOwnProperty(key)) {
      const item = contracts[network][key];
      newObj[key] = {
        address: toChecksumAddress(item.address),
        abi: item.abi,
      };
    }
  });
  return newObj;
};

export const appContracts: ContractData = fixContracts();
