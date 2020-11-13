import { BlockChainProviderState } from 'app/containers/BlockChainProvider/types';
import { StakePageState } from 'app/containers/StakePage/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  blockChainProvider?: BlockChainProviderState;
  stakePage?: StakePageState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
