import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'

import yearnTheme from './theme';

import Home from './components/home';
import Header from './components/header';
import Account from './components/account';
import AccountHeader from './components/accountHeader';
import SnackbarController from './components/snackbar';
import LP from './components/lp';
import Insure from './components/insure';

import { injected } from "./stores/connectors";

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_BALANCES_PERPETUAL,
  BALANCES_PERPETUAL_RETURNED
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class App extends Component {
  state = {
    account: null,
    headerValue: 'lp'
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
        .then((a) => {
          store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
          emitter.emit(CONNECTION_CONNECTED)
          console.log(a)
        })
        .catch((e) => {
          console.log(e)
        })
      } else {

      }
    });
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  };

  balancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
    }, 60000)
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    emitter.on(BALANCES_PERPETUAL_RETURNED, this.balancesReturned);
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  };

  connectionDisconnected = () => {
    emitter.removeListener(BALANCES_PERPETUAL_RETURNED, this.balancesReturned);
    this.setState({ account: store.getStore('account') })
  }

  render() {
    const { headerValue, account } = this.state

    return (
      <MuiThemeProvider theme={ createMuiTheme(yearnTheme) }>
        <CssBaseline />
        <IpfsRouter>
          { !account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              minWidth: '100vw',
              justifyContent: 'center',
              alignItems: 'center',
              background: "#f9fafb"
            }}>
              <Account />
            </div>
          }
          { account &&
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              alignItems: 'center',
              background: "#f9fafb"
            }}>
              <Switch>
                <Route path="/lp">
                  <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
                  <AccountHeader />
                  <LP />
                </Route>
                <Route path="/insure">
                  <Header setHeaderValue={ this.setHeaderValue } headerValue={ headerValue } />
                  <AccountHeader />
                  <Insure />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          }
          <SnackbarController />
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
