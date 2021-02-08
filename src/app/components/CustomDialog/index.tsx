/**
 *
 * CustomDialog
 *
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog, Icon } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { ProposalDetailsPage } from '../../containers/ProposalDetailsPage';

interface Props {
  show: boolean;
}

export function CustomDialog(props: Props) {
  const history = useHistory();
  const closeModal = e => {
    e.stopPropagation();
    history.goBack();
  };

  React.useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <Dialog
      isOpen={props.show}
      className="bg-black w-4/5 py-16 px-16 rounded-3xl relative"
    >
      <div className="flex justify-end mb-3">
        <StyledClose
          onClick={closeModal}
          className="transiton-transform transform duration-300 ease-in-out hover:transform hover:rotate-180 focus:outline-none"
        >
          <Icon icon="cross" iconSize={35} color="white" />
        </StyledClose>
      </div>
      <ProposalDetailsPage />
    </Dialog>
  );
}

const StyledClose = styled.button.attrs(_ => ({ type: 'button' }))`
  width: 35px;
  height: 35px;
  position: absolute;
  top: 2rem;
  right: 2rem;
`;
