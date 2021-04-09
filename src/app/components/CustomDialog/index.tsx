/**
 *
 * CustomDialog
 *
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog, Icon } from '@blueprintjs/core';
import styled from 'styled-components/macro';

interface Props {
  show: boolean;
  children: React.ReactNode;
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
      className="bg-black xl:w-4/5 w-11/12 p-18 md:p-18 sm:p-4 rounded-3xl relative"
    >
      <div className="flex justify-end">
        <StyledClose
          onClick={closeModal}
          className="transiton-transform transform duration-300 ease-in-out hover:transform hover:rotate-180 focus:outline-none"
        >
          <Icon icon="cross" iconSize={35} color="white" />
        </StyledClose>
      </div>
      {props.children}
    </Dialog>
  );
}

const StyledClose = styled.button.attrs(_ => ({ type: 'button' }))`
  width: 35px;
  height: 35px;
  position: absolute;
  top: 1.8rem;
  right: 2rem;
`;
