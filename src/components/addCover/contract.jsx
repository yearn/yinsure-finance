import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import * as moment from 'moment';
import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  MenuItem
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { colors } from '../../theme'

import {
  ERROR,
  GET_QUOTE,
  QUOTE_RETURNED,
  APPLY,
  APPLY_RETURNED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher


const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    cursor: 'pointer',
    paddingBottom: '6px'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  actionButton: {
    height: '47px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none',
      margin: '0px'
    }
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px'
  },
  buttonText: {
    fontWeight: '700',
  },
  applyButtonText: {
    fontWeight: '700',
    color: colors.white
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  title: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '14px',
    paddingRight: '14px',
    paddingTop: '14px'
  },
  buttons: {
    display: 'flex',
    width: '100%',
    paddingTop: '14px'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    color: colors.darkGray
  },
  dropdownNoBorders: {

  },
  assetSelectMenu: {
    padding: '15px 15px 15px 20px',
    minWidth: '200px',
  },
  assetSelectIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    cursor: 'pointer'
  },
  assetSelectIconName: {
    paddingLeft: '10px',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  quoteContainer: {
    background: colors.gray,
    borderRadius: '24px',
    display: 'flex',
    padding: '24px',
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  generateQuoteContainer: {
    background: colors.gray,
    borderRadius: '24px',
    display: 'flex',
    padding: '24px',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  field: {
    width: '100%',
    padding: '9px 0px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  fieldTitle: {

  },
  fieldValue: {
    color: colors.darkGray
  }
});

class Contract extends Component {

  constructor(props) {
    super()

    this.state = {
      asset: props.asset,
      assetObject: props.assetObject,
      days: '',
      daysError: false,
      amount: '',
      amountError: false
    }
  }

  componentWillReceiveProps(props) {
    if(props.asset !== this.state.asset) {
      this.setState({
        asset: props.asset,
        assetObject: props.assetObject
      })
    }
  }

  componentWillMount() {
    emitter.on(QUOTE_RETURNED, this.quoteReturned);
    emitter.on(APPLY_RETURNED, this.applyReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(QUOTE_RETURNED, this.quoteReturned);
    emitter.removeListener(APPLY_RETURNED, this.applyReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  quoteReturned = (quote) => {
    this.setState({ loading: false })
    this.props.stopLoading()

    if(quote.contract.toLowerCase() === this.props.contract.address.toLowerCase()) {
      this.setState({ quote: quote })
    }
  };

  applyReturned = (txHash) => {
    this.setState({
      loading: false,
      days: '',
      amount: '',
      quote: null
    })

    this.props.stopLoading()
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      assetObject,
      amount,
      amountError,
      days,
      daysError,
      loading,
      quote
    } = this.state

    var quoteContract = null;
    if (quote && quote.contract) {
      quoteContract = quote.contract.substring(0,10)+'...'+quote.contract.substring(quote.contract.length-8,quote.contract.length)
    }

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        <div className={ classes.title }>
          <div>
            <Typography variant='h4' className={ classes.value } noWrap>Days</Typography>
          </div>
          <div className={ classes.balances }>
            <Typography variant='h4' onClick={ () => { this.setMax() } } className={ classes.value } noWrap>Max</Typography>
          </div>
        </div>
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='days'
          value={ days }
          error={ daysError }
          onChange={ this.onChange }
          disabled={ loading }
          placeholder="Between 30-365 days"
          variant="outlined"
          onKeyDown={ this.inputKeyDown }
          InputProps={{
            endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>days</InputAdornment>,
          }}
          helperText={
            <div className={ classes.info }>
              <InfoIcon style={{ fontSize: 18, marginRight: '6px' }} />
              <Typography variant='h5'>The number of days to be covered for.</Typography>
            </div>
          }
        />

        <div className={ classes.title }>
          <div>
            <Typography variant='h4' className={ classes.value } noWrap>Amount</Typography>
          </div>
          <div className={ classes.balances }>
            <Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ ((assetObject && assetObject.balance) ? (Math.floor(assetObject.balance*10000)/10000).toFixed(4) : '0.0000') } { assetObject.symbol }</Typography>
          </div>
        </div>
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='amount'
          value={ amount }
          error={ amountError }
          onChange={ this.onChange }
          disabled={ loading }
          placeholder="0.00"
          variant="outlined"
          onKeyDown={ this.inputKeyDown }
          InputProps={{
            endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>{ this.renderAssetSelect() }</InputAdornment>,
          }}
          helperText={
            <div className={ classes.info }>
              <InfoIcon style={{ fontSize: 18, marginRight: '6px' }} />
              <Typography variant='h5'>Enter the amount you want to be covered for.</Typography>
            </div>
          }
        />
        <div className={ classes.buttons }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading }
            onClick={ this.onQuote }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5' } color={ 'secondary' }>Get quote</Typography>
          </Button>
        </div>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={ classes.tradeContainer }>
        {
          !quote &&
          <div className={ classes.generateQuoteContainer }>
            <Typography variant='h3'>Generate your quote</Typography>
          </div>
        }
        {
          quote &&
          <div className={ classes.quoteContainer }>
          <div className={ classes.field }>
            <Typography variant='h3' className={ classes.fieldTitle }>Cover Cost</Typography>
            <Typography variant='h3' className={ classes.fieldValue }>{ (quote.price/1e18).toFixed(4) } { quote.currency }</Typography>
          </div>
            <div className={ classes.field }>
              <Typography variant='h4' className={ classes.fieldTitle }>Contract</Typography>
              <Typography variant='h4' className={ classes.fieldValue }>{ quoteContract }</Typography>
            </div>
            <div className={ classes.field }>
              <Typography variant='h4' className={ classes.fieldTitle }>Cover Amount</Typography>
              <Typography variant='h4' className={ classes.fieldValue }>{ quote.amount } { quote.currency }</Typography>
            </div>
            <div className={ classes.field }>
              <Typography variant='h4' className={ classes.fieldTitle }>Cover Period</Typography>
              <Typography variant='h4' className={ classes.fieldValue }>{ quote.period } days</Typography>
            </div>
            <div className={ classes.field }>
              <Typography variant='h4' className={ classes.fieldTitle }>Cover Expires</Typography>
              <Typography variant='h4' className={ classes.fieldValue }>{ moment().add(quote.period, 'days').format('YYYY-MM-DD') }</Typography>
            </div>
            <div className={ classes.buttons }>
              <Button
                className={ classes.actionButton }
                variant="contained"
                color="primary"
                disabled={ loading }
                onClick={ this.onApply }
                fullWidth
                >
                <Typography className={ classes.applyButtonText } variant={ 'h5' } color={ 'secondary' }>Apply</Typography>
              </Button>
            </div>
          </div>
        }

      </div>
    </div>)
  };

  renderAssetSelect = () => {

    const { loading, accountBalances, classes } = this.props
    const { asset } = this.state

    return (
      <TextField
        id={ 'asset' }
        name={ 'asset' }
        select
        value={ asset }
        onChange={ this.onSelectChange }
        SelectProps={{
          native: false,
        }}
        fullWidth
        disabled={ loading }
        className={ classes.dropdownNoBorders }
      >
        { accountBalances ? accountBalances.map(this.renderAssetOption) : null }
      </TextField>
    )
  };

  renderAssetOption = (option) => {

    const { classes } = this.props

    return (
      <MenuItem key={option.id} value={option.id} className={ classes.assetSelectMenu }>
        <React.Fragment>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ require('../../assets/'+option.logo) }
              height="20px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h5'>{ option.symbol }</Typography>
          </div>
        </React.Fragment>
      </MenuItem>
    )
  }

  onSelectChange = (event, value) => {
    let asset = this.props.accountBalances.filter((bal) => { return bal.id === event.target.value })

    if(asset.length > 0) {
      asset = asset[0]
    }

    this.setState({
      asset: event.target.value,
      assetObject: asset
    })
  };

  setMax = () => {
    if(this.state.loading) {
      return
    }

    this.setState({ days: '365' })
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onQuote();
    }
  }

  onQuote = () => {
    this.setState({
      amountError: false,
      daysError: false
    })

    const { amount, days, assetObject } = this.state
    const { contract, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0) {
      this.setState({ amountError: true })
      return false
    }

    if(!days || isNaN(days) || parseFloat(days) > 365 || parseFloat(days) < 30) {
      this.setState({ daysError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: GET_QUOTE, content: { amount: amount, days: days, contract: contract, asset: assetObject } })
  }

  onApply = () => {
    this.setState({ amountError: false })

    const { amount, days, assetObject, quote } = this.state
    const { contract, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || parseFloat(amount) > parseFloat(assetObject.balance)) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: APPLY, content: { amount: amount, days: days, contract: contract, asset: assetObject, quote: quote } })
  }

  setAmount = (percent) => {
    const { assetObject, loading } = this.state

    if(loading) {
      return
    }

    const balance = assetObject.balance
    let amount = balance*percent/100

    amount = Math.floor(amount*10000)/10000;
    this.setState({ amount: amount.toFixed(4) })
  }

  setRedeemAmount = (percent) => {

    if(this.state.loading) {
      return
    }

    const balance = this.props.contract.investedBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Contract));
