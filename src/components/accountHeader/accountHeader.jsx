import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Card
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    lineHeight: '1.2'
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '32px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      maxWidth: 'calc(100vw - 24px)'
    }
  },
});

class AccountHeader extends Component {

  constructor(props) {
    super()

    this.state = {
      modalOpen: false
    }
  }

  render() {
    const { classes } = this.props;
    const account = store.getStore('account')

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
        <Card className={ classes.addressContainer } onClick={ this.overlayClicked }>
          <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>Wallet</Typography>
          <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
          <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
        </Card>
        { this.state.modalOpen && this.renderModal() }
      </div>
    )
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }
}

export default withRouter(withStyles(styles)(AccountHeader));
