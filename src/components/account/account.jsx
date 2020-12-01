import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button } from '@material-ui/core'
import { colors } from '../../theme'

import UnlockModal from '../unlock/unlockModal.jsx'
import ArmorIcon from '../icons/ArmorIcon'

const styles = (theme) => ({
  root: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: colors.blue,
    width: '100%',
    overflow: 'hidden',
  },
  connectHeading: {
    textAlign: 'center',
    color: colors.white,
  },
  connectContainer: {
    padding: '20px',
  },
  actionButton: {
    color: colors.white,
    borderColor: colors.white,
  },
  notConnectedRoot: {
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
    width: '100%',
  },
  address: {
    color: colors.white,
    width: '100%',
    paddingBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  balances: {
    color: colors.white,
    width: '100%',
    padding: '12px',
  },
  balanceContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  accountHeading: {
    paddingBottom: '6px',
  },
  icon: {
    cursor: 'pointer',
  },
  disclaimer: {
    padding: '12px',
    border: '1px solid ' + colors.white,
    borderRadius: '0.75rem',
    marginBottom: '24px',
    fontWeight: 1,
    color: colors.white,
    marginTop: '20px',
  },
  poweredByArmor: {
    padding: '8px 20px 7px',
    background: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'all .3s',
    width: '100%',
    justifyContent: 'center',
  },
  poweredByArmorText: {
    color: '#2F80ED',
    fontSize: '14px',
    lineHeight: '17px',
    marginRight: '10px',
    '&:visited': {
      color: '#2F80ED',
    },
  },
  mainBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 41px)',
  },
})

class Account extends Component {
  constructor(props) {
    super()

    this.state = {
      loading: false,
      modalOpen: false,
    }
  }

  render() {
    const { classes } = this.props
    const { modalOpen } = this.state

    return (
      <div className={classes.root}>
        {this.renderNotConnected()}
        {modalOpen && this.renderModal()}
      </div>
    )
  }

  renderNotConnected = () => {
    const { classes } = this.props
    const { loading } = this.state

    return (
      <div className={classes.notConnectedRoot}>
        <div className={classes.mainBox}>
          <Typography variant={'h5'} className={classes.disclaimer}>
            This project is in beta. Use at your own risk.
          </Typography>
          <div className={classes.connectHeading}>
            <Typography variant="h3">Connect your wallet to continue</Typography>
          </div>
          <div className={classes.connectContainer}>
            <Button
              className={classes.actionButton}
              variant="outlined"
              color="primary"
              onClick={this.unlockClicked}
              disabled={loading}
            >
              <Typography>Connect</Typography>
            </Button>
          </div>
        </div>
        <a href="https://armor.fi" className={classes.poweredByArmor}>
          <Typography className={classes.poweredByArmorText}>Powered by Armor</Typography>{' '}
          <ArmorIcon width="25" height="25" />
        </a>
      </div>
    )
  }

  renderModal = () => {
    return <UnlockModal closeModal={this.closeModal} modalOpen={this.state.modalOpen} />
  }

  unlockClicked = () => {
    this.setState({ modalOpen: true, loading: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false, loading: false })
  }
}

export default withRouter(withStyles(styles)(Account))
