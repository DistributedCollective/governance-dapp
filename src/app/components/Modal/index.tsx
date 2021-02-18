import React from 'react';
import { Dialog } from '@blueprintjs/core';

interface Props {
  show: boolean;
  content?: any;
}

export function Modal(props: Props) {
  return (
    <Dialog
      isOpen={props.show}
      className="bg-black max-w-29 w-full px-6 py-6 md:px-9 md:py-7 sm:p-4 rounded-3xl relative"
    >
      {props.content}
    </Dialog>
  );
}
