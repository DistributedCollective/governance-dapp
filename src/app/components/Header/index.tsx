import { MenuItem } from '@blueprintjs/core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ReactComponent as SovLogo } from 'assets/images/sovryn-logo-alpha.svg';
import { translations } from 'locales/i18n';

import { media } from '../../../styles/media';
import { CHAIN_ID } from '../../containers/BlockChainProvider/classifiers';
import { WalletConnectorButton } from '../../containers/BlockChainProvider/components/WalletConnectorButton';
import { selectBlockChainProvider } from '../../containers/BlockChainProvider/selectors';
import { LanguageToggle } from '../LanguageToggle';

import './index.scss';

export function Header() {
  const { chainId, network } = useSelector(selectBlockChainProvider);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const node = useRef(null as any);
  const StyledMenu = styled.nav.attrs(_ => ({ open: open }))`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: black;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    height: 100%;
    text-align: left;
    padding: 4rem 2rem 2rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    transition: transform 0.3s ease-in-out;
    z-index: 9;
    width: 100%;
    li {
      list-style-type: none;
    }
    a {
      font-size: 1.2rem;
      padding: 1.5rem 0;
      font-weight: bold;
      letter-spacing: 0.5rem;
      color: white;
      text-decoration: none;
      transition: color 0.3s linear;
      text-align: center;
    }
  `;
  const StyledBurger = styled.button.attrs(_ => ({ open: open }))`
    position: absolute;
    top: 1.3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
    &:focus {
      outline: none;
    }
    div {
      width: 2rem;
      height: 0.25rem;
      background: white;
      border-radius: 10px;
      transition: all 0.3s linear;
      position: relative;
      transform-origin: 1px;
      :first-child {
        transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
      }
      :nth-child(2) {
        opacity: ${({ open }) => (open ? '0' : '1')};
        transform: ${({ open }) =>
          open ? 'translateX(20px)' : 'translateX(0)'};
      }
      :nth-child(3) {
        transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
      }
    }
  `;

  const Menu = ({ open, setOpen }) => {
    return <StyledMenu open={open}>{menuItems}</StyledMenu>;
  };

  const Burger = ({ open, setOpen }) => {
    return (
      <StyledBurger open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
    );
  };

  const pages = [
    {
      to: 'https://live.sovryn.app/',
      title: t(translations.mainMenu.dapp),
    },
    {
      to: 'https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp',
      title: t(translations.mainMenu.help),
    },
  ];

  const menuItems = pages.map((item, index) => {
    let link: {
      to: string;
      title: string;
      exact: boolean;
      onClick?: () => void;
    } = item as any;

    if (link.to.startsWith('http')) {
      return <MenuItem key={index} text={link.title} href={link.to} />;
    }

    return (
      <MenuItem
        key={index}
        text={link.title}
        onClick={() => (link.onClick ? link.onClick() : history.push(link.to))}
      />
    );
  });

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [open]);

  return (
    <>
      {CHAIN_ID !== chainId && (
        <div className="bg-red py-3 text-center text-black font-bold">
          {[30, 31].includes(chainId) ? (
            <>You are connected to RSK {network} right now.</>
          ) : (
            <>You are in wrong network!</>
          )}{' '}
          Switch to RSK {CHAIN_ID === 30 ? 'mainnet' : 'testnet'} to interact
          with bitocracy.
        </div>
      )}
      <header className="bg-black mb-2">
        <div className="flex min-h justify-between items-center mb-4 px-4 pt-2 pb-2">
          <div className="xl:hidden">
            <div ref={node}>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          </div>
          <div className="xl:flex flex-row items-center">
            <a href="https://live.sovryn.app" rel="noopener noreferrer">
              <StyledLogo />
            </a>
          </div>
          <div className="flex justify-start items-center">
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              rel="noopener noreferrer"
              className="nav-item mr-2 hidden xl:block"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="mr-2">
              <LanguageToggle />
            </div>
            <WalletConnectorButton />
          </div>
        </div>
      </header>
    </>
  );
}
const StyledLogo = styled(SovLogo).attrs(_ => ({
  alt: '',
}))`
  width: 130px;
  height: 32px;
  margin: 0 0 0 1rem;

  // custom font for "Alpha" logo text
  #Alpha tspan {
    font-family: Orbitron-Medium, Orbitron;
  }

  ${media.xl`
    width: 216px;
    height: 53px;
    margin: 0;
  `}
`;
