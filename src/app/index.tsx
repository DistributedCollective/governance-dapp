/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { GlobalStyle } from 'styles/global-styles';
import { BlockChainProvider } from './containers/BlockChainProvider';
import { HomePage } from './containers/HomePage/Loadable';
import { StakePage } from './containers/StakePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { CustomDialog } from './components/CustomDialog';
import { ProposalsPage } from './containers/ProposalsPage/Loadable';

interface stateType {
  location: { pathname: string };
  background: { location: string };
}

export function App() {
  function RouteSwitch() {
    const location = useLocation<stateType>();
    const background = location.state && location.state.background;

    return (
      <div>
        <Switch location={location || background}>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/proposals" component={ProposalsPage} />
          <Route exact path="/stake" component={StakePage} />
          <Route exact path="/proposals/:id" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>

        {background && (
          <Route
            path="/proposals/:id"
            children={<CustomDialog show={true} />}
          />
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s | Sovryn Governance"
        defaultTitle="Sovryn Governance"
      />
      <BlockChainProvider>
        <RouteSwitch />
      </BlockChainProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}
