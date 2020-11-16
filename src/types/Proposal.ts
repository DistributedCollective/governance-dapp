export interface Proposal {
  id: number;
  proposer: string;
  eta: number;
  startBlock: number;
  endBlock: number;
  startTime: number;
  forVotes: number;
  againstVotes: number;
  quorum: number;
  canceled: boolean;
  executed: boolean;
}

export enum ProposalState {
  Pending = '0',
  Active = '1',
  Canceled = '2',
  Defeated = '3',
  Succeeded = '4',
  Queued = '5',
  Expired = '6',
  Executed = '7',
}

export interface ProposalCreatedEvent {
  id: number;
  proposer: string;
  targets: string[];
  values: string[];
  signatures: string[];
  calldatas: string[];
  startBlock: number;
  endBlock: number;
  description: string;
}

export interface VoteCastEvent {
  voter: string;
  proposalId: number;
  support: boolean;
  votes: number;
}

export interface ProposalCanceledEvent {
  id: number;
}

export interface ProposalQueuedEvent {
  id: number;
  eta: number;
}

export interface ProposalExecutedEvent {
  id: number;
}

export const getStatus = (state: ProposalState) => {
  const states = {
    '0': 'Pending',
    '1': 'Active',
    '2': 'Canceled',
    '3': 'Defeated',
    '4': 'Succeeded',
    '5': 'Queued',
    '6': 'Expired',
    '7': 'Executed',
  };
  return states[state];
};

export type RowProposal = Proposal & { description: string };
