/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { BlockChainProvider } from './containers/BlockChainProvider';

import { HomePage } from './containers/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { ProposalsPage } from './containers/ProposalsPage/Loadable';
import { ProposalDetailsPage } from './containers/ProposalDetailsPage/Loadable';
import { StakePage } from './containers/StakePage/Loadable';

export function App() {
  return (
    <BrowserRouter basename="/governance-dapp/">
      <Helmet
        titleTemplate="%s | Sovryn Governance"
        defaultTitle="Sovryn Governance"
      />
      <BlockChainProvider>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/proposals" component={ProposalsPage} />
          <Route exact path="/proposals/:id" component={ProposalDetailsPage} />
          <Route exact path="/stake" component={StakePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </BlockChainProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
