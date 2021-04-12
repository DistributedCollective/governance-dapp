import { Menu as BPMenu, MenuItem, Popover, Position } from '@blueprintjs/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';

import logoSvg from 'assets/images/sovryn-logo-white.svg';
import { translations } from 'locales/i18n';
import { Container } from 'react-bootstrap';
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
  const location = useLocation();
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
  const StyledPopover = styled(Popover)`
    &:hover {
      color: #fec006;
    }
  `;
  const NavPopover = ({ content, children }) => {
    return (
      <StyledPopover
        className="mr-4 cursor-pointer"
        minimal={true}
        popoverClassName="header-nav-popover"
        content={content}
        position={Position.BOTTOM_LEFT}
      >
        {children}
      </StyledPopover>
    );
  };
  const SECTION_TYPE = {
    TRADE: 'trade',
    FINANCE: 'finance',
  };

  const isSectionOpen = (section: string) => {
    const paths = {
      [SECTION_TYPE.TRADE]: ['/'],
      [SECTION_TYPE.FINANCE]: ['/lend', '/liquidity'],
    };
    return section && paths[section].includes(location.pathname);
  };

  const pages = [
    {
      to: '/',
      title: t(translations.mainMenu.swap),
    },
    {
      to: '/',
      title: t(translations.mainMenu.marginTrade),
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.lend),
    },
    {
      to: '/lend',
      title: t(translations.mainMenu.borrow),
    },
    { to: '/liquidity', title: t(translations.mainMenu.liquidity) },
    {
      to: '/',
      title: t(translations.mainMenu.staking),
    },
    {
      to: 'https://bitocracy.sovryn.app',
      title: t(translations.mainMenu.governance),
    },
    { to: '/wallet', title: t(translations.mainMenu.wallet) },
    { to: '/stats', title: t(translations.mainMenu.stats) },
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
      return (
        <MenuItem
          key={index}
          text={link.title}
          href={link.to}
          target="_blank"
        />
      );
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
      <header>
        <Container className="d-flex justify-content-between align-items-center mb-3 pt-2 pb-2">
          <div className="d-xl-none">
            <div ref={node}>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          </div>
          <div className="d-xl-flex flex-row align-items-center">
            <div className="mr-3">
              <Link to="/">
                <StyledLogo src={logoSvg} />
              </Link>
            </div>
            <div className="d-none d-xl-block font-family-montserrat">
              <NavLink className="nav-item mr-4 " to="/" exact>
                {t(translations.mainMenu.buySov)}
              </NavLink>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.swap)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/');
                      }}
                    ></MenuItem>
                    <MenuItem
                      text={t(translations.mainMenu.marginTrade)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/');
                      }}
                    ></MenuItem>
                  </BPMenu>
                }
              >
                <div className={`${isSectionOpen(SECTION_TYPE.TRADE)}`}>
                  <span className="mr-1">{t(translations.mainMenu.trade)}</span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <NavPopover
                content={
                  <BPMenu>
                    <MenuItem
                      text={t(translations.mainMenu.lend)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/lend');
                      }}
                    ></MenuItem>
                    <MenuItem
                      text={t(translations.mainMenu.borrow)}
                      className="bp3-popover-dismiss"
                      onClick={() => {
                        history.push('/lend');
                      }}
                    ></MenuItem>
                    <MenuItem
                      text={t(translations.mainMenu.liquidity)}
                      className="bp3-popover-dismiss"
                      onClick={() => history.push('/liquidity')}
                    ></MenuItem>
                  </BPMenu>
                }
              >
                <div
                  className={`${
                    isSectionOpen(SECTION_TYPE.FINANCE) && 'font-weight-bold'
                  }`}
                >
                  <span className="mr-1">
                    {t(translations.mainMenu.finance)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                </div>
              </NavPopover>
              <a
                href="https://bitocracy.sovryn.app/stake"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item mr-4 text-capitalize"
              >
                {t(translations.mainMenu.staking)}
              </a>
              <a
                href="https://bitocracy.sovryn.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item mr-4 text-capitalize"
              >
                {t(translations.mainMenu.governance)}
              </a>
              <NavLink className="nav-item mr-4 text-capitalize" to="/wallet">
                {t(translations.mainMenu.wallet)}
              </NavLink>
              <NavLink className="nav-item mr-4 text-capitalize" to="/stats">
                {t(translations.mainMenu.stats)}
              </NavLink>
            </div>
          </div>
          <div className="flex justify-start items-center">
            <a
              href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item mr-2 text-capitalize d-none d-xl-block"
            >
              {t(translations.mainMenu.help)}
            </a>
            <div className="mr-2">
              <LanguageToggle />
            </div>
            <WalletConnectorButton />
          </div>
        </Container>
      </header>
    </>
  );
}
const StyledLogo = styled.img.attrs(_ => ({
  alt: '',
}))`
  width: 130px;
  height: 50px;
  margin: 0 0 0 1rem;
  ${media.xl`
    width: 284px;
    height: 48px;
    margin: 0;
  `}
`;
