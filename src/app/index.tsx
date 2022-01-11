/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { CustomDialog } from './components/CustomDialog';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { BlockChainProvider } from './containers/BlockChainProvider';
import { HomePage } from './containers/HomePage/Loadable';
import { ProposalDetailsPage } from './containers/ProposalDetailsPage';
import { ProposalsPage } from './containers/ProposalsPage/Loadable';
import { ProposePage } from './containers/ProposePage';
import { StakePage } from './containers/StakePage/Loadable';

export function App() {
  function RouteSwitch() {
    const location = useLocation<{ background: any; location: any }>();
    const background = location.state && location.state.background;
    return (
      <div>
        <Switch location={background || location}>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/proposals" component={ProposalsPage} />
          <Route exact path="/stake" component={StakePage} />
          <Route
            exact
            path="/proposals/:id/:contractName?"
            component={ProposalDetailsPage}
          />
          <Route
            exact
            path="/:contractName/:id"
            component={ProposalDetailsPage}
          />
          <Route component={NotFoundPage} />
        </Switch>

        <Switch location={location}>
          <Route
            path="/proposals/propose"
            exact
            children={() => (
              <CustomDialog show={true}>
                <ProposePage />
              </CustomDialog>
            )}
          />
        </Switch>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s | Sovryn Bitocracy"
        defaultTitle="Sovryn Bitocracy"
      />
      <BlockChainProvider>
        <RouteSwitch />
      </BlockChainProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
