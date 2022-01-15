import { Icon, Spinner } from '@blueprintjs/core';
import { useWalletContext } from '@sovryn/react-wallet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import Davatar from '@davatar/react';

import { translations } from 'locales/i18n';
import { prettyTx } from 'utils/helpers';

import { media } from '../../../../../styles/media';
import { useENS } from 'app/hooks/useENS';

export function WalletConnectorButton() {
  const {
    connected,
    loading: connecting,
    address,
    connect,
    disconnect,
  } = useWalletContext();
  const { t } = useTranslation();
  const { ensName } = useENS(address);
  return (
    <>
      <div className="justify-center items-center hidden md:flex">
        {!connected && !address ? (
          <StyledButton
            onClick={() => connect()}
            className="flex justify-center items-center"
          >
            {connecting && <Spinner size={22} />}
            {!connecting && (
              <>
                <span className="hidden xl:inline">
                  {t(translations.wallet.connect_btn)}
                </span>
              </>
            )}
          </StyledButton>
        ) : (
          <div>
            <StyledButtonAuth className="engage-wallet w-auto justify-end items-center hidden xl:flex cursor-pointer">
              <span className="flex flex-nowrap flex-row items-center w-100 justify-between">
                <span className="mr-3">
                  <Davatar size={20} address={address.toLowerCase()} />
                </span>
                <span>{ensName || prettyTx(address, 4, 4)}</span>
                <Icon
                  icon="log-out"
                  className="logout"
                  onClick={() => disconnect()}
                />
              </span>
            </StyledButtonAuth>
            <StyledButton className="xl:hidden">
              <Icon icon="user" />
            </StyledButton>
          </div>
        )}
      </div>
    </>
  );
}

const StyledButtonAuth = styled.button.attrs(_ => ({
  type: 'button',
}))`
  background: #383838;
  height: 40px;
  padding: 0 0 0 2rem;
  border-radius: 8px;
  font-weight: 100;
  font-size: 14px;
  font-family: 'Work Sans', sans-serif;
  min-width: 165px;
  letter-spacing: 0;

  &:active,
  &:focus {
    border: none;
    outline: none;
  }

  .logout {
    height: 40px;
    padding: 12px 12px;
    background: #686868;
    cursor: pointer;
    transition: background 0.3s;
    color: #fec004;
    border-radius: 0 8px 8px 0;
    margin-left: 1.6rem;

    &:hover {
      background: rgba(0, 0, 0, 0.36);
    }
  }
`;

const StyledButton = styled.button.attrs(_ => ({
  type: 'button',
}))`
  border: none;
  background: none;
  color: var(--white);
  width: 48px;
  height: 48px;
  text-align: center;

  ${media.xl`
    border: 1px solid;
    white-space: nowrap;
    width: auto;
    margin: 0;
    height: 40px;
    padding: 5px 26px;
    font-weight: 100;
    color: #FEC004;
    font-size: 18px;
    font-family: 'Montserrat';
    letter-spacing: -1px;
    text-transform: capitalize;
    transition: all 0.3s;
    border-radius: 10px;

    &:hover {
      background: rgba(254,192,4, 0.25) !important;
    }

    &:active,
    &:focus {
      background: rgba(254,192,4, 0.5) !important;
      border: none;
      outline: none
    }
  `}
`;
