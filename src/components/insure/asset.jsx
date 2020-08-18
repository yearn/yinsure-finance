import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { colors } from '../../theme'

import {
  ERROR,
  DEPOSIT_INSURED,
  DEPOSIT_INSURED_RETURNED,
  WITHDRAW_INSURED,
  WITHDRAW_INSURED_RETURNED,
  DEPOSIT_ALL_INSURED,
  DEPOSIT_ALL_INSURED_RETURNED,
  WITHDRAW_ALL_INSURED,
  WITHDRAW_ALL_INSURED_RETURNED,
  // CLAIM_INSURED,
  // CLAIM_INSURED_RETURNED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


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
    paddingRight: '20px',
    cursor: 'pointer'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    flexWrap: 'wrap',
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
    minWidth: '300px',
    paddingBottom: '12px'
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: colors.lightLightGray,
    borderRadius: '40px',
    padding: '24px',
  },
  infoHeading: {
    paddingBottom: '12px',
    width: '100%'
  },
  info: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  horizontalSeperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    width: '100%'
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
  containedButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  buttons: {
    display: 'flex',
    width: '100%'
  },
  disabledContainer: {
    width: '100%',
    paddingTop: '12px',
    textAlign: 'center'
  }
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
    }
  }

  componentWillMount() {
    emitter.on(DEPOSIT_INSURED_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_INSURED_RETURNED, this.withdrawReturned);
    emitter.on(DEPOSIT_ALL_INSURED_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_ALL_INSURED_RETURNED, this.withdrawReturned);
    // emitter.on(CLAIM_INSURED, this.claimReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_INSURED_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_INSURED_RETURNED, this.withdrawReturned);
    emitter.removeListener(DEPOSIT_ALL_INSURED_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_ALL_INSURED_RETURNED, this.withdrawReturned);
    // emitter.removeListener(CLAIM_INSURED, this.claimReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  depositReturned = () => {
    this.setState({ loading: false, amount: '' })
    this.props.stopLoading()
  };

  withdrawReturned = () => {
    this.setState({ loading: false, redeemAmount: '' })
    this.props.stopLoading()
  };

  claimReturned = () => {
    this.setState({ loading: false })
    this.props.stopLoading()
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
    this.props.stopLoading()
  };

  render() {
    const { classes, asset } = this.props;
    const {
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      loading
    } = this.state

    let insuredAmount = 0

    if(amount && amount !== '') {
      insuredAmount = amount
    } else if (asset.balance) {
      insuredAmount = (Math.floor(asset.balance*10000)/10000).toFixed(4)
    }

    const initiationFee = (insuredAmount * 0.001).toFixed(4)
    const weeklyFee = (insuredAmount * 0.0001).toFixed(4)

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        {!asset.disabled && <div className={ classes.balances }>
            <Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ (asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
        </div>}
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='amount'
          value={ amount }
          error={ amountError }
          onChange={ this.onChange }
          disabled={ loading || asset.disabled }
          placeholder="0.00"
          variant="outlined"
          onKeyDown={ this.inputKeyDown }
        />
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading || asset.disabled }
            color="primary"
            onClick={ () => { this.setAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <div className={ classes.buttons }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.balance <= 0 }
            onClick={ this.onDeposit }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Insure</Typography>
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.balance <= 0 }
            onClick={ this.onDepositAll }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Insure All</Typography>
          </Button>
        </div>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.infoContainer} >
          <div className={ classes.infoHeading }>
            <Typography variant='h3'>Insurance Fee Structure</Typography>
          </div>
          <div className={ classes.info }>
            <Typography variant='body1'>Insured Amount</Typography>
            <Typography variant='h4'>{ insuredAmount } { asset.symbol }</Typography>
          </div>
          <div className={ classes.info }>
            <Typography variant='body1'>Initation Fee - 0.1%</Typography>
            <Typography variant='h4'>{ initiationFee } { asset.symbol }</Typography>
          </div>
          <div className={ classes.info }>
            <Typography variant='body1'>Weekly Fee - 0.01%</Typography>
            <Typography variant='h4'>{ weeklyFee } { asset.symbol }</Typography>
          </div>
        </div>
      </div>
      <div className={ classes.horizontalSeperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>{ asset.insuredBalance ? (Math.floor(asset.insuredBalance*10000)/10000).toFixed(4) : '0.0000' } { asset.insuredSymbol } </Typography>
        </div>
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='redeemAmount'
          value={ redeemAmount }
          error={ redeemAmountError }
          onChange={ this.onChange }
          disabled={ loading }
          placeholder="0.00"
          variant="outlined"
          onKeyDown={ this.inputRedeemKeyDown }
        />
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        <div className={ classes.buttons }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.insuredBalance <= 0 }
            onClick={ this.onWithdraw }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw</Typography>
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.insuredBalance <= 0 }
            onClick={ this.onWithdrawAll }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw All</Typography>
          </Button>
        </div>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.infoHeading }>
          <Typography variant='h3'>Submit a Claim</Typography>
        </div>
        <Button
          className={ classes.actionButton }
          variant="contained"
          color="secondary"
          disabled={ loading || asset.insuredBalance <= 0 }
          onClick={ this.onClaim }
          fullWidth
          >
          <Typography className={ classes.containedButtonText } variant={ 'h5'} color='secondary'>Claim</Typography>
        </Button>
      </div>
    </div>)
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
  }

  onClaim = () => {
    // this.setState({ amountError: false })
    //
    // const { asset, startLoading } = this.props
    //
    // this.setState({ loading: true })
    // startLoading()
    // dispatcher.dispatch({ type: CLAIM_INSURED, content: { asset: asset } })
  }

  onDeposit = () => {
    this.setState({ amountError: false })

    const { amount } = this.state
    const { asset, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT_INSURED, content: { amount: amount, asset: asset } })
  }

  onDepositAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT_ALL_INSURED, content: { asset: asset } })
  }

  onWithdraw = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.insuredBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: WITHDRAW_INSURED, content: { amount: redeemAmount, asset: asset } })
  }

  onWithdrawAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: WITHDRAW_ALL_INSURED, content: { asset: asset } })
  }

  setAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ amount: amount.toFixed(4) })
  }

  setRedeemAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.insuredBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));
