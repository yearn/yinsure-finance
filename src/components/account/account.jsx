import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: colors.blue,
    minWidth: '100vw',
    padding: '36px 24px'
  },
  connectHeading: {
    maxWidth: '300px',
    textAlign: 'center',
    color: colors.white
  },
  connectContainer: {
    padding: '20px'
  },
  actionButton: {
    color: colors.white,
    borderColor: colors.white
  },
  notConnectedRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%'
  },
  address: {
    color: colors.white,
    width: '100%',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  balances: {
    color: colors.white,
    width: '100%',
    padding: '12px'
  },
  balanceContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  accountHeading: {
    paddingBottom: '6px'
  },
  icon: {
    cursor: 'pointer'
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid '+colors.white,
    borderRadius: '0.75rem',
    marginBottom: '24px',
    fontWeight: 1,
    color: colors.white
  }
});

class Account extends Component {

  constructor(props) {
    super()

    this.state = {
      loading: false,
      modalOpen: false,
    }
  }

  render() {
    const { classes } = this.props;
    const {
      modalOpen,
    } = this.state

    return (
      <div className={ classes.root }>
        { this.renderNotConnected() }
        { modalOpen && this.renderModal() }
      </div>
    )
  };

  renderNotConnected = () => {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={ classes.notConnectedRoot }>
        <Typography variant={'h5'} className={ classes.disclaimer }>This project is in beta. Use at your own risk.</Typography>
        <div className={ classes.connectHeading }>
          <Typography variant='h3'>Connect your wallet to continue</Typography>
        </div>
        <div className={ classes.connectContainer }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            onClick={ this.unlockClicked }
            disabled={ loading }
            >
            <Typography>Connect</Typography>
          </Button>
        </div>
      </div>
    )
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false })
  }
}

export default withRouter(withStyles(styles)(Account));
