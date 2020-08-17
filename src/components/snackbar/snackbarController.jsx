import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { colors } from '../../theme'

import Snackbar from './snackbar.jsx'

import {
  SNACKBAR_ERROR,
  SNACKBAR_MESSAGE,
  SNACKBAR_TRANSACTION_RECEIPT,
  SNACKBAR_TRANSACTION_CONFIRMED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter

const styles = theme => ({
  root: {

  },
});

class SnackbarController extends Component {

  constructor(props) {
    super()

    this.state = {
      open: false,
      snackbarType: null,
      snackbarMessage: null
    }
  }

  componentWillMount() {
    emitter.on(SNACKBAR_ERROR, this.showError);
    emitter.on(SNACKBAR_MESSAGE, this.showMessage);
    emitter.on(SNACKBAR_TRANSACTION_RECEIPT, this.showReceipt);
    emitter.on(SNACKBAR_TRANSACTION_CONFIRMED, this.showConfirmed);
  }

  componentWillUnmount() {
    emitter.removeListener(SNACKBAR_ERROR, this.showError);
    emitter.removeListener(SNACKBAR_MESSAGE, this.showMessage);
    emitter.removeListener(SNACKBAR_TRANSACTION_RECEIPT, this.showReceipt);
    emitter.removeListener(SNACKBAR_TRANSACTION_CONFIRMED, this.showConfirmed);
  };

  showError = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null, open: false }
    this.setState(snackbarObj)

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error', open: true }
      that.setState(snackbarObj)
    })
  }

  showMessage = (message) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null, open: false }
    this.setState(snackbarObj)

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: message, snackbarType: 'Info', open: true }
      that.setState(snackbarObj)
    })
  }

  showReceipt = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null, open: false }
    this.setState(snackbarObj)

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash', open: true }
      that.setState(snackbarObj)
    })
  }

  showConfirmed = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null, open: false }
    this.setState(snackbarObj)

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash', open: true }
      that.setState(snackbarObj)
    })
  }

  render() {
    const {
      snackbarType,
      snackbarMessage,
      open
    } = this.state

    if(open) {
      return <Snackbar type={ snackbarType } message={ snackbarMessage } open={ true } />
    } else {
      return <div></div>
    }

  };
}

export default withStyles(styles)(SnackbarController);
