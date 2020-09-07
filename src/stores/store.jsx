import config from "../config";
import async from 'async';
import {
  SNACKBAR_ERROR,
  SNACKBAR_TRANSACTION_RECEIPT,
  SNACKBAR_TRANSACTION_CONFIRMED,
  ERROR,
  GET_ACCOUNT_BALANCES,
  ACCOUNT_BALANCES_RETURNED,
  GET_CONTRACT_BALANCES,
  CONTRACT_BALANCES_RETURNED,
  GET_QUOTE,
  QUOTE_RETURNED,
  APPLY,
  APPLY_RETURNED,
  GET_COVER,
  COVER_RETURNED,
  CLAIM,
  CLAIM_RETURNED,
  REDEEM,
  REDEEM_RETURNED
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const rp = require('request-promise');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      universalGasPrice: '70',
      account: {},
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      web3context: null,
      ethBalance: 0,
      cover: null,
      balances: [
        {
          id: "eth",
          name: "Ether",
          address: "Ethereum",
          symbol: "ETH",
          logo: "ETH-logo.png",
          description: 'Ethereum',
          decimals: 18,
          balance: 0
        },
        {
          id: "dai",
          name: "DAI",
          address: "0x6b175474e89094c44da98b954eedeac495271d0f",
          symbol: "DAI",
          logo: "DAI-logo.png",
          description: 'DAI Stablecoin',
          decimals: 18,
          balance: 0
        }
      ],
      contracts: [
        {
          id: "yfi",
          name: 'yearn.finance',
          address: '0x9D25057e62939D3408406975aD75Ffe834DA4cDd',
          symbol: 'YFI',
          logo: 'YFI-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "AAVE",
          name: 'Aave',
          address: '0xc1D2819CE78f3E15Ee69c6738eB1B400A26e632A',
          symbol: 'LEND',
          logo: 'LEND-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "bal",
          name: 'Balancer',
          address: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
          symbol: 'BAL',
          logo: 'BAL-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "comp",
          name: 'Compound',
          address: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
          symbol: 'COMP',
          logo: 'COMP-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "crv",
          name: 'Curve',
          address: '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27',
          symbol: 'CRV',
          logo: 'CRV-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "dforce",
          name: 'dforce',
          address: '0x02285AcaafEB533e03A7306C55EC031297df9224',
          symbol: 'DF',
          logo: 'dforce-logo.jpg',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "mstable",
          name: 'mstable',
          address: '0xAFcE80b19A8cE13DEc0739a1aaB7A028d6845Eb3',
          symbol: 'MUSD',
          logo: 'MUSD-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "opyn",
          name: 'opyn',
          address: '0xb529964F86fbf99a6aA67f72a27e59fA3fa4FEaC',
          symbol: 'opyn',
          logo: 'OPYN-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "snx",
          name: 'SynthetiX',
          address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
          symbol: 'SNX',
          logo: 'SNX-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "uma",
          name: 'UMA',
          address: '0x3e532e6222afe9Bcf02DCB87216802c75D5113aE',
          symbol: 'UMA',
          logo: 'UMA-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
        {
          id: "uniswap",
          name: 'Uniswap V2',
          address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
          symbol: 'UNI',
          logo: 'uniswap-logo.png',
          description: '',
          decimals: 18,
          balance: 0,
          capacity: {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        },
      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case GET_ACCOUNT_BALANCES:
            this.getAccountBalances(payload);
            break;
          case GET_CONTRACT_BALANCES:
            this.getContractBalances(payload);
            break;
          case GET_QUOTE:
            this.getQuote(payload);
            break;
          case APPLY:
            this.apply(payload);
            break;
          case GET_COVER:
            this.getCover(payload);
            break;
          case CLAIM:
            this.claim(payload);
            break;
          case REDEEM:
            this.redeem(payload);
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  getAccountBalances = async (payload) => {
    const account = store.getStore('account')
    const balances = store.getStore('balances')

    if(!account || !account.address) {
      return false
    }

    const web3 = await this._getProvider();

    async.map(balances, (balance, callback) => {
      async.parallel([
        (callbackInner) => { this._getERC20Balance(web3, balance, account, callbackInner) },
      ], (err, data) => {
        balance.balance = data[0]

        callback(null, balance)
      })
    }, (err, balanceData) => {
      if(err) {
        emitter.emit(ERROR, err)
        emitter.emit(SNACKBAR_ERROR, err)
        return
      }

      store.setStore({ balances: balanceData })
      emitter.emit(ACCOUNT_BALANCES_RETURNED)
    })
  }

  getContractBalances = async (payload) => {
    const account = store.getStore('account')
    const contracts = store.getStore('contracts')

    if(!account || !account.address) {
      return false
    }

    this._getCapacities((err, capacities) => {
      if(err) {
        emitter.emit(ERROR)
        emitter.emit(SNACKBAR_ERROR)
        return
      }

      const contractData = contracts.map((contract) => {
        const capacity = capacities.filter((capacity) => {
          return capacity.contractAddress.toLowerCase() === contract.address.toLowerCase()
        })

        if(capacity.length > 0) {
          contract.capacity = capacity[0]
        } else {
          contract.capacity = {
            capacityETH: 0,
            capacityDAI: 0,
            netStakedNXM: 0
          }
        }

        return contract
      })

      store.setStore({ contracts: contractData })
      emitter.emit(CONTRACT_BALANCES_RETURNED)
    })


    // async.map(contracts, (contract, callback) => {
    //   async.parallel([
    //     (callbackInner) => { this._getContractCapacity(contract, callbackInner) },
    //   ], (err, data) => {
    //     contract.capacity = data[0]
    //
    //     callback(null, contract)
    //   })
    // }, (err, contractData) => {
    //   if(err) {
    //     emitter.emit(ERROR)
    //     emitter.emit(SNACKBAR_ERROR)
    //     return
    //   }
    //
    //   // console.log(contractData)
    //
    //   store.setStore({ contracts: contractData })
    //   emitter.emit(CONTRACT_BALANCES_RETURNED)
    // })
  }

  _getERC20Balance = async (web3, contract, account, callback) => {
    try {
      if(contract.address === 'Ethereum') {
        const eth_balance = web3.utils.fromWei(await web3.eth.getBalance(account.address), "ether");
        callback(null, parseFloat(eth_balance))
      } else {
        const erc20Contract = new web3.eth.Contract(config.erc20ABI, contract.address)
        let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
        balance = parseFloat(balance)/10**contract.decimals
        callback(null, parseFloat(balance))
      }
    } catch(ex) {
      return callback(ex)
    }
  }

  _getCapacities = async (callback) => {
    try {
      const url = config.nexusMutualAPI+`v1/capacities`

      const options = {
        uri: url,
        headers: {
          'x-api-key': config.nexusMutualKey
        },
        json: true
      }

      const capacityJSON = await rp(options);
      callback(null, capacityJSON)
    } catch(e) {
      console.log(e)
      return callback(null, [])
    }
  }

  _getContractCapacity = async (contract, callback) => {
    try {
      const url = config.nexusMutualAPI+`v1/contracts/${contract.address}/capacity`

      const options = {
        uri: url,
        headers: {
          'x-api-key': config.nexusMutualKey
        },
        json: true
      }

      const capacityJSON = await rp(options);
      callback(null, capacityJSON)
    } catch(e) {
      console.log(e)
      if(e && e.error && e.error.reason === "Uncoverable") {
        return callback(null, {
          capacityETH: 0,
          capacityDAI: 0,
          netStakedNXM: 0
        })
      }
      return callback(null, {})
    }
  }

  getQuote = async (payload) => {

    const { amount, days, contract, asset } = payload.content

    this._getQuote(amount, days, contract, asset, (err, data) => {
      if(err) {
        emitter.emit(ERROR, err)
        emitter.emit(SNACKBAR_ERROR, err)
        return
      }

      emitter.emit(QUOTE_RETURNED, data)
    })
  }

  _getQuote = async (amount, days, contract, asset, callback) => {
    try {
      const url = config.nexusMutualAPI+`v1/quote?coverAmount=${amount}&currency=${asset.symbol}&period=${days}&contractAddress=${contract.address}`
      // const url = config.nexusMutualAPI+`getQuote/${amount}/${asset.symbol}/${days}/${contract.address}/M1`

      const options = {
        uri: url,
        headers: {
          'x-api-key': config.nexusMutualKey
        },
        json: true
      }

      const quoteJSON = await rp(options);
      // console.log(quoteJSON);
      callback(null, quoteJSON)
    } catch(e) {
      console.log(e)
      return callback(e)
    }
  }

  apply = async (payload) => {

    const account = store.getStore('account')
    const { amount, days, contract, asset, quote } = payload.content

    if( asset.id === 'dai' ) {
      this._checkApproval(asset, account, amount, config.yInsureAddress, (err) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        this._callApply(amount, days, contract, asset, account, quote, (err, data) => {
          if(err) {
            emitter.emit(ERROR, err)
            emitter.emit(SNACKBAR_ERROR, err)
            return
          }

          emitter.emit(APPLY_RETURNED, data)
        })
      })
    } else {
      this._callApply(amount, days, contract, asset, account, quote, (err, data) => {
        if(err) {
          emitter.emit(ERROR, err)
          emitter.emit(SNACKBAR_ERROR, err)
          return
        }

        emitter.emit(APPLY_RETURNED, data)
      })
    }
  }

  _callApply = async (amount, days, contract, asset, account, quote, callback) => {
    const web3 = this._getProvider()

    let insuranceContract = new web3.eth.Contract(config.yInsureABI, config.yInsureAddress)

    const coverDetails = [amount, quote.price, quote.priceInNXM, quote.expiresAt, quote.generatedAt]

    const sendSymbol = web3.utils.asciiToHex(asset.symbol)

    let sendValue = undefined
    if(asset.symbol === 'ETH') {
      sendValue = quote.price
    }

    insuranceContract.methods.buyCover(contract.address, sendSymbol, coverDetails, days, quote.v, quote.r, quote.s).send({ from: account.address, value: sendValue, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      if(confirmationNumber === 2) {
        emitter.emit(SNACKBAR_TRANSACTION_CONFIRMED, receipt.transactionHash)
      }
    })
    .on('receipt', function(receipt){
      emitter.emit(SNACKBAR_TRANSACTION_RECEIPT, receipt.transactionHash)
    })
    .on('error', function(error) {
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  getCover = async (payload) => {
    try {
      // console.log('GETTING COVER')
      const web3 = this._getProvider()
      const account = store.getStore('account')
      const contracts = store.getStore('contracts')

      // console.log(account)
      // console.log(contracts)
      const insuranceContract = new web3.eth.Contract(config.yInsureABI, config.yInsureAddress)
      const quotationContract = new web3.eth.Contract(config.quotationABI, config.quotationAddress)

      // console.log(insuranceContract)

      const balanceOf = await insuranceContract.methods.balanceOf(account.address).call({ from: account.address })

      // console.log(balanceOf)
      if(balanceOf > 0) {
        // console.log(Array.from(Array(parseInt(balanceOf)).keys()))
        var arr = Array.from(Array(parseInt(balanceOf)).keys());

        // console.log(arr)
        async.map(arr, async (index, callback, c) => {

          // console.log(index)
          try {
            const tokenIndex = await insuranceContract.methods.tokenOfOwnerByIndex(account.address, index).call({ from: account.address })
            // console.log(tokenIndex)
            const token = await insuranceContract.methods.tokens(tokenIndex).call({ from: account.address })
            // console.log(token)
            let coverStatus = {
              0: "0",
              1: false,
              coverStatus: "0",
              payoutCompleted: false
            }
            try {
              coverStatus = await insuranceContract.methods.getCoverStatus(tokenIndex).call({ from: account.address })
              // console.log(coverStatus)
            } catch(ex) {
              console.log(ex)
            }
            const address = await quotationContract.methods.getscAddressOfCover(token.coverId).call({ from: account.address })
            // console.log(address)

            token.tokenIndex = tokenIndex
            token.address = address[1]
            token.coverStatus = coverStatus
            token.coverCurrencyDisplay = web3.utils.hexToAscii(token.coverCurrency)
            token.coverPriceDisplay = web3.utils.fromWei(token.coverPrice, "ether")

            let contractDetails = contracts.filter((contract) => {
              return contract.address === token.address
            })

            // console.log(contractDetails)
            if(contractDetails.length > 0) {
              token.logo = contractDetails[0].logo
              token.name = contractDetails[0].name
            }

            // console.log(token)
            if(callback) {
              callback(null, token)
            } else {
              return token
            }
          } catch (ex) {
            console.log(ex)
            if(callback) {
              callback(null, null)
            } else {
              return null
            }
          }

        }, (err, data) => {
          // console.log('RETURNED')
          if(err) {
            console.log(err)
            emitter.emit(ERROR, err)
            return emitter.emit(SNACKBAR_ERROR, err)
          }

          // console.log(data)
          store.setStore({ cover: data })
          emitter.emit(COVER_RETURNED, data)
        })
      } else {
        // console.log('No balance of here.')
        store.setStore({ cover: [] })
        emitter.emit(COVER_RETURNED, [])
      }

    } catch (ex) {
      console.log(ex)
      emitter.emit(ERROR, ex)
      emitter.emit(SNACKBAR_ERROR, ex)
    }
  }

  claim = async (payload) => {
    const account = store.getStore('account')
    const { contractId } = payload.content

    this._callClaim(contractId, account, (err, data) => {
      if(err) {
        emitter.emit(ERROR, err)
        emitter.emit(SNACKBAR_ERROR, err)
        return
      }

      emitter.emit(CLAIM_RETURNED, data)
    })
  }

  _callClaim = async (contractId, account, callback) => {
    const web3 = this._getProvider()

    let insuranceContract = new web3.eth.Contract(config.yInsureABI, config.yInsureAddress)

    insuranceContract.methods.submitClaim(contractId).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      if(confirmationNumber === 2) {
        emitter.emit(SNACKBAR_TRANSACTION_CONFIRMED, receipt.transactionHash)
      }
    })
    .on('receipt', function(receipt){
      emitter.emit(SNACKBAR_TRANSACTION_RECEIPT, receipt.transactionHash)
    })
    .on('error', function(error) {
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  redeem = async (payload) => {
    const account = store.getStore('account')
    const { contractId } = payload.content

    this._callRedeem(contractId, account, (err, data) => {
      if(err) {
        emitter.emit(ERROR, err)
        emitter.emit(SNACKBAR_ERROR, err)
        return
      }

      emitter.emit(REDEEM_RETURNED, data)
    })
  }

  _callRedeem = async (contractId, account, callback) => {
    const web3 = this._getProvider()

    let insuranceContract = new web3.eth.Contract(config.yInsureABI, config.yInsureAddress)

    insuranceContract.methods.redeemClaim(contractId).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
    .on('transactionHash', function(hash){
      callback(null, hash)
    })
    .on('confirmation', function(confirmationNumber, receipt){
      if(confirmationNumber === 2) {
        emitter.emit(SNACKBAR_TRANSACTION_CONFIRMED, receipt.transactionHash)
      }
    })
    .on('receipt', function(receipt){
      emitter.emit(SNACKBAR_TRANSACTION_RECEIPT, receipt.transactionHash)
    })
    .on('error', function(error) {
      if (!error.toString().includes("-32601")) {
        if(error.message) {
          return callback(error.message)
        }
        callback(error)
      }
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = this._getProvider()
      const erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      let ethAllowance = web3.utils.fromWei(allowance, "ether")
      if (asset.decimals !== 18) {
        ethAllowance = (allowance*10**asset.decimals).toFixed(0);
      }

      var amountToSend = web3.utils.toWei('999999999', "ether")
      if (asset.decimals !== 18) {
        amountToSend = (999999999*10**asset.decimals).toFixed(0);
      }

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _getGasPrice = async () => {
    try {
      const url = config.gasPriceAPI
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }

  _getProvider = () => {
    const web3context = store.getStore('web3context')
    if(!web3context) {
      return null
    }
    const provider = web3context.library.provider
    if(!provider) {
      return null
    }

    const web3 = new Web3(provider);

    return web3
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
