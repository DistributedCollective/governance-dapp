/**
 *
 * CustomDialog
 *
 */

import React from 'react';
import { Dialog, Icon } from '@blueprintjs/core';
import styled from 'styled-components/macro';

interface Props {
  show: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

export function CustomDialog(props: Props) {
  return (
    <Dialog
      isOpen={props.show}
      className="bg-black w-4/5 py-16 px-16 rounded-3xl relative"
    >
      <div className="flex justify-end mb-3">
        <StyledClose
          onClick={props.onClose}
          className="transiton-transform transform duration-300 ease-in-out hover:transform hover:rotate-180 focus:outline-none"
        >
          <Icon icon="cross" iconSize={35} color="white" />
        </StyledClose>
      </div>
      {props.content}
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
