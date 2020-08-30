import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  TextField,
  Checkbox,
  InputAdornment
} from '@material-ui/core';
import { colors } from '../../theme'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

import Contract from './contract'
import Loader from '../loader'

import {
  ERROR,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_ACCOUNT_BALANCES,
  ACCOUNT_BALANCES_RETURNED,
  GET_CONTRACT_BALANCES,
  CONTRACT_BALANCES_RETURNED
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
  loggedOut: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  coverContainer: {
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
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '24px 0px'
  },
  filters: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 12px'
    },
  },
  searchField: {
    flex: 1,
    background: colors.white,
    borderRadius: '50px'
  },
  checkbox: {
    flex: 1,
    margin: '0px !important'
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
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
  headingName: {
    display: 'flex',
    alignItems: 'center',
    width: '325px',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      flex: 1
    }
  },
  heading: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      width: '250px'
    }
  },
  grey: {
    color: colors.darkGray
  },
});

class AddCover extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      contracts: store.getStore('contracts'),
      accountBalances: store.getStore('balances'),
      account: account,
      search: '',
      searchError: false,
      hideZero: localStorage.getItem('yinsure.finance-hideZero') === '1' ? true : false
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_CONTRACT_BALANCES, content: {} })
      dispatcher.dispatch({ type: GET_ACCOUNT_BALANCES, content: {} })
    }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(ACCOUNT_BALANCES_RETURNED, this.accountBalancesReturned);
    emitter.on(CONTRACT_BALANCES_RETURNED, this.contractBalancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(ACCOUNT_BALANCES_RETURNED, this.accountBalancesReturned);
    emitter.removeListener(CONTRACT_BALANCES_RETURNED, this.contractBalancesReturned);
  };

  accountBalancesReturned = () => {
    this.setState({ accountBalances: store.getStore('balances') })
  }

  contractBalancesReturned = () => {
    this.setState({ contracts: store.getStore('contracts') })
  }

  connectionConnected = () => {
    const account = store.getStore('account')
    this.setState({ account: account })

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_CONTRACT_BALANCES, content: {} })
      dispatcher.dispatch({ type: GET_ACCOUNT_BALANCES, content: {} })
    }
  };

  connectionDisconnected = () => {
    this.setState({ account: null })
  }

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={ classes.loggedOut }>
            <div className={ classes.introCenter }>
              <Typography variant='h3'>Connect your wallet to continue</Typography>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.coverContainer }>
          { this.renderFilters() }
          { this.renderContracts() }
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

  renderContracts = () => {
    const { contracts, expanded, search, hideZero, accountBalances } = this.state
    const { classes } = this.props
    const width = window.innerWidth

    return contracts.filter((contract) => {
      if(hideZero && contract.balance === 0) {
        return false
      }

      if(search && search !== '') {
        return contract.id.toLowerCase().includes(search.toLowerCase()) ||
              contract.name.toLowerCase().includes(search.toLowerCase()) ||
              contract.symbol.toLowerCase().includes(search.toLowerCase()) ||
              contract.description.toLowerCase().includes(search.toLowerCase()) ||
              contract.address.toLowerCase().includes(search.toLowerCase())
      } else {
        return true
      }
    }).map((contract) => {
      var address = null;
      if (contract.address) {
        address = contract.address.substring(0,10)+'...'+contract.address.substring(contract.address.length-8,contract.address.length)
      }
      return (
        <Accordion className={ classes.expansionPanel } square key={ contract.id+"_expand" } expanded={ expanded === contract.id} onChange={ () => { this.handleChange(contract.id) } }>
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
                    src={ require('../../assets/'+contract.logo) }
                    height={ width > 600 ? '40px' : '30px'}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' } noWrap>{ contract.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ address }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h5' } className={ classes.grey }>Cover Available</Typography>
                <Typography variant={ 'h3' } noWrap>{ (contract.capacity && contract.capacity.capacityETH ? (parseFloat(contract.capacity.capacityETH)/1e18).toFixed(2) : '0.00')+' ETH' }</Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Contract contract={ contract } startLoading={ this.startLoading } stopLoading={ this.stopLoading } accountBalances={ accountBalances } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  renderFilters = () => {
    const { loading, search, searchError, hideZero } = this.state
    const { classes } = this.props

    return (
      <div className={ classes.filters }>
        <FormControlLabel
          className={ classes.checkbox }
          control={
            <Checkbox
              checked={ hideZero }
              onChange={ this.handleChecked }
              color='primary'
            />
          }
          label="Hide zero balances"
        />
        <div className={ classes.between }>

        </div>
        <TextField
          fullWidth
          disabled={ loading }
          className={ classes.searchField }
          id={ 'search' }
          value={ search }
          error={ searchError }
          onChange={ this.onSearchChanged }
          placeholder="0x..., YFI, Curve"
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><SearchIcon /></InputAdornment>,
          }}
        />
      </div>
    )
  }

  onSearchChanged = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  handleChecked = (event) => {
    this.setState({ hideZero: event.target.checked })
    localStorage.setItem('yinsure.finance-hideZero', (event.target.checked ? '1' : '0' ))
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

export default withRouter(withStyles(styles)(AddCover));
