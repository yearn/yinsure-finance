import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { colors } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  heading: {
    display: 'none',
    paddingTop: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      paddingTop: '5px',
      display: 'block'
    }
  },
  headingName: {
    paddingTop: '5px',
    flex: 2,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    [theme.breakpoints.up('sm')]: {
      minWidth: 'auto',
    }
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  grey: {
    color: colors.darkGray
  },
});

class LP extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      assets: store.getStore('lpAssets'),
      account: account
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
  };

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('lpAssets') })
  };

  render() {
    const { classes, t } = this.props;
    const {
      loading,
      account,
    } = this.state

    return (
      <div className={ classes.root }>
        <div className={ classes.investedContainer }>
          { this.renderAssetBlocks() }
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

  renderAssetBlocks = () => {
    const { assets, expanded } = this.state
    const { classes } = this.props
    const width = window.innerWidth

    return assets.map((asset) => {
      return (
        <Accordion className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    height={ width > 600 ? '40px' : '30px'}
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ (asset.apy ? (asset.apy).toFixed(4) : '0.0000') }%</Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>Interest Rate</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>{ (asset.balance ? (asset.balance).toFixed(4) : '0.0000')+' '+asset.symbol }</Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>Balance</Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } stopLoading={ this.stopLoading } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  stopLoading = () => {
    this.setState({ loading: false })
  }
}

export default withRouter(withStyles(styles)(LP));
