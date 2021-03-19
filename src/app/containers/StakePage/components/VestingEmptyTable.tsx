import React from 'react';
import { genesisAddress } from 'utils/helpers';
import { useAccount } from '../../../hooks/useAccount';
import { useVesting_getVesting } from '../../../hooks/vesting-registry/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../../hooks/vesting-registry/useVesting_getTeamVesting';
import { useVesting_getOriginVesting } from '../../../hooks/vesting-registry/useVesting_getOriginVesting';

export function VestingEmptyTable() {
  const account = useAccount();
  const vesting = useVesting_getVesting(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const vestingOrigin = useVesting_getOriginVesting(account);

  return (
    <>
      {vesting.value === genesisAddress &&
        vestingTeam.value === genesisAddress &&
        vestingOrigin.value && (
          <>
            <tr>
              <td colSpan={7} className="text-center font-normal">
                No vests yet.
              </td>
            </tr>
          </>
        )}
    </>
  );
}
