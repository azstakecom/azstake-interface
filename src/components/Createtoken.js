import React, { Component } from 'react';
import '../css/App.css'
import { withRouter } from 'react-router-dom';
import Footer from '../components/Footer'
import Web3 from 'web3'
import { Modal, Row, Col} from 'react-bootstrap';
import BuyToken from '../abis/BuyToken.json'
import axios from 'axios';
// import {
//   BrowserRouter as Router,
//   Redirect
// } from "react-router-dom";
import {BASE_URL, WEB} from '../constants'
class Createtoken extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nameToken: '',
            symbolToken: '',
            imgaeToken: '',
            value: '', 
            balanceToken: '',
          valueBaStake: '',
          valueTime: '', 
          valueWeb:'',
          valueMarketcap:'',
          valuegeGecko:'',
          valuegeExchange1:'',
          valuegeExchange2:'',
          valuegeExchange3:'',
          valuegeExchange4:'',
          valuegeExchange5:'',
          valueRatio: '',
          decimalToken: 0,
          shownoticepool: true,
          showSearch: true,
          showResults: false,
          id: '',
          showtoken: false,
          searchratio: '',
          responseDataSearch: [],
          contractBuy:{},
          showbuytoken: false,
          addressBuy: '',
          showModal: false,
          totalsupply: 0,
          allowan: 0,
          showapprove: 0,
          account: '0x00',
          disableButtonAddpool: true,
          backgroundApprove: "#00a8ff",
          colorApprove: "white",
          backgroundApproveStake: "#a4b0be",
          colorApproveStake: "#dfe6e9",
          disableApprove: false,
          disableApproveStake: true,
          stateapprove: true,
          statestake: true

        }
        this.handleChangebastake = this.handleChangebastake.bind(this);
        this.handleChangeweb = this.handleChangeweb.bind(this);
        this.handleChangemarketcap = this.handleChangemarketcap.bind(this);
        this.handleChangegecko = this.handleChangegecko.bind(this);
        this.handleChangeexchange1 = this.handleChangeexchange1.bind(this);
        this.handleChangeratio = this.handleChangeratio.bind(this);
        this.handleSubmitadd = this.handleSubmitadd.bind(this); 
        this.close = this.close.bind(this);
        this.success = this.success.bind(this);
    }
    handleChangeweb(event) { this.setState({valueWeb: event.target.value});}
    handleChangemarketcap(event) { this.setState({valueMarketcap: event.target.value});}
    handleChangegecko(event) { this.setState({valuegeGecko: event.target.value});}
    handleChangeexchange1(event) { this.setState({valuegeExchange1: event.target.value});}
    handleChangebastake(event) { 
      const re = /^[0-9\b\.]+$/;
      if (event.target.value === '' || re.test(event.target.value)) {
        this.setState({valueBaStake: event.target.value});
      }     
    }
    handleChangeratio(event) { 
      const re = /^[0-9\b\.]+$/;
      if (event.target.value === '' || re.test(event.target.value)) {
        this.setState({valueRatio: event.target.value},
          () => {this.filerArray();});
      }     
    }
    filerArray() {
      let searchString = this.state.valueRatio;
      const objectestimate ={};
      const dataresponseData=[]
      if(this.state.value == "") {
        this.setState({
          responseDataSearch: []
        })
      }
      if(searchString.length > 0){
        objectestimate.info = "1 USDT = " + searchString + this.state.symbolToken;
        dataresponseData.push(objectestimate)
        
        this.setState({
          responseDataSearch: dataresponseData
        })
      }
    }
    
    close() {
      this.setState({ showModal: false });
    }
    success() {
      this.setState({ showModal: false });
      window.location.replace(WEB);
      // <Redirect to="/" />

    }

    handleSubmitadd(event) {
        event.preventDefault()
        this.setaddBuytoken()
    }

    convert(n){
      var sign = +n < 0 ? "-" : "",
          toStr = n.toString();
      if (!/e/i.test(toStr)) {return n;}
      var [lead,decimal,pow] = n.toString()
          .replace(/^-/,"")
          .replace(/^([0-9]+)(e.*)/,"$1.$2")
          .split(/e|\./);
      return +pow < 0 
          ? sign + "0." + "0".repeat(Math.max(Math.abs(pow)-1 || 0, 0)) + lead + decimal
          : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow-decimal.length || 0, 0))) : (decimal.slice(0,+pow)+"."+decimal.slice(+pow)))
    }

    async setaddBuytoken() {
          const web3 = window.web3 
          var abi = require('human-standard-token-abi')
          var tokenHuman = new web3.eth.Contract(abi, this.state.id)
          // Transfer token contract
          var ratio = (this.convert(this.state.valueRatio*10**this.state.decimalToken)).toString()
          var balance = (this.convert(this.state.valueBaStake*10**this.state.decimalToken)).toString()
          console.log("balance" + balance)
          const allowan = await tokenHuman.methods.allowance(this.state.account,this.state.addressBuy).call();
          console.log("allowan" + allowan)
          var confirm =0;
          this.setState({
            showapprove: 2,
            statestake: false
           })
          if(Number(allowan) > Number(balance)){
            console.log("BUY token")
            this.state.contractBuy.methods.addbuytoken(
                  this.state.id,
                  this.state.imgaeToken,  
                  this.state.symbolToken, 
                  this.state.nameToken, 
                  this.state.decimalToken, 
                  balance,  
                  ratio 
                  ).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
                    if(confirm == 0){
                        axios.get(BASE_URL + `crypto/${this.state.id}/status/Buy`)
                      .then(res => {
                        const status = res.data.status;
                        if(status == 0){
                          axios.post(BASE_URL+ 'postcrypto',{
                            'address': this.state.id,
                            'website': this.state.valueWeb,
                            'coinmarketcap': this.state.valueMarketcap,
                            'coingecko': this.state.valuegeGecko,
                            'officiallink': this.state.valuegeExchange1,
                            'status': "Buy"
                          })
                          .then(response => {
                              console.log("Update infomation success!")
                          })
                          .catch(err => {
                            console.log("Update False")
                          })
                        }
                      })
                    this.setState({showModal: true, statestake: true, disableApproveStake: false})
                  }
                  confirm =1;
                }).on('error', (error) => {
                  this.setState({
                    showapprove: 1
                     })
                })  
          }else {
            console.log("Approve")
            tokenHuman.methods.approve(this.state.addressBuy, this.state.totalsupply).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              this.setState({showapprove: 1})
            }).on('error', (error) => {
              this.setState({
                showapprove: 0
                 })
            })
          }
        
    }

    async componentDidMount() {
        const id = this.props.match.params.token;
        this.setState({id,  account : this.props.account, disableButtonAddpool : this.props.enableSwap})
        // await this.loadWeb3()
        await this.loaddata()
        await this.checkcontract(id)
        if(this.props.account != '0x00'){
          await this.getInfomationAccount()
        }  
    }

    async componentWillReceiveProps(){
      this.setState({account: this.props.account, disableButtonAddpool : this.props.enableSwap})
      if(this.props.account != '0x00'){
        await this.getInfomationAccount()
      }
    }

    async getInfomationAccount(){
      const web3 = window.web3 
      var abi = require('human-standard-token-abi')
      var tokenHuman = new web3.eth.Contract(abi, this.state.id)
      tokenHuman.methods.balanceOf(this.props.account).call().then(respone =>{this.setState({balanceToken: respone}) })
                  .catch(error => { alert("Contract Address Wrong") }) 
      
      tokenHuman.methods.allowance(this.props.account,this.state.addressBuy).call().then(respone => { 
                    if(respone > 0){this.setState({showapprove: 1})}
                    this.setState({allowan: respone})
                  });  
    }

    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }

    async loaddata() {
      const web3 = window.web3    
      // const accounts = await web3.eth.getAccounts()
      // this.setState({ account: accounts[0] }) 
      const networkId = await web3.eth.net.getId()  
      const buyToken = BuyToken.networks[networkId]
      if(buyToken) {
        const contractBuy = new web3.eth.Contract(BuyToken.abi, buyToken.address)        
        this.setState({
          contractBuy,
          addressBuy: buyToken.address
        })
      }
    }

    async checkcontract(contract){
      const web3 = window.web3 
      var abi = require('human-standard-token-abi') 
      try{
        var tokenHuman = new web3.eth.Contract(abi, contract)
        tokenHuman.methods.name().call().then(respone => {              
            const hasbuyListed = this.state.contractBuy.methods.hasbuyListed(contract).call()
            .then(res => {
                if(res){
                    this.setState({
                        showbuytoken: true                     
                    })
                }else{
                  // List info token
                  tokenHuman.methods.name().call().then(respone => {this.setState({nameToken: respone})})
                  .catch(error => { alert("Contract Address Wrong") })  
                    
                  tokenHuman.methods.decimals().call().then(respone =>{ this.setState({decimalToken: respone}) })
                  .catch(error => {alert("Contract Address Wrong")}) 
                  tokenHuman.methods.symbol().call().then(respone => {this.setState({symbolToken: respone}) })
                  .catch(error => { alert("Contract Address Wrong")}) 
                  this.setState({imgaeToken : 'https://bcoders.org/public/image/regispool.png'})
                  this.setState({showtoken: true})

                  
                  tokenHuman.methods.totalSupply().call().then(respone => {
                    this.setState({totalsupply: respone}) 
                    console.log("Totalsupply " + respone)
                  });   
                  // End list info
                }
            })
            
        })
        .catch(error => {
            window.location.replace(WEB);
        })
  
    }catch{
        window.location.replace(WEB);
    }
    }
    async Approve(){
      const web3 = window.web3; 
      let confirm =0;
      var abi = require('human-standard-token-abi')
      this.setState({stateapprove: false})
      var tokenHuman = new web3.eth.Contract(abi, this.state.id)
      var totalsupplytoken = await tokenHuman.methods.totalSupply().call()
      tokenHuman.methods.approve(this.state.addressBuy, totalsupplytoken).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
        if(confirm == 0){
          this.setState({
            backgroundApproveStake: "#00a8ff",
            colorApproveStake: "white",
            backgroundApprove: "#a4b0be",
            colorApprove: "#dfe6e9",
            disableApprove: true,
            disableApproveStake: false,
            stateapprove: true
          })
        }  
        confirm =1;
      }).on('error', (error) => {this.setState({ stateapprove: true})})
    }
    async ApproveStake(){
      this.setaddBuytoken()
    }

    render() {
      let buttonperation;
      let approvetext;
      if(this.state.stateapprove){
      approvetext =  <div>1. Approve {this.state.symbolToken}</div>
      }else{
        approvetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let sattetext;
      if(this.state.statestake){
        sattetext =  <div>2. Add {this.state.symbolToken}</div>
      }else{
        sattetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      if(!this.props.enableSwap){
        buttonperation= 
        <Row>
          <Col md={6}>
          
              <button  
              type="submit" 
              className="background-color-approve-approve"
              style={{backgroundColor: this.state.backgroundApprove, color: this.state.colorApprove}}
              disabled={this.state.disableApprove}
              onClick={(event) => {
                event.preventDefault()
                this.Approve()
              }}
            >{approvetext}</button>
          </Col>
          <Col md={6}>
              <button
              type="submit" 
              className="background-color-approve-approve"
              style={{backgroundColor: this.state.backgroundApproveStake, color: this.state.colorApproveStake}}
              disabled={this.state.disableApproveStake}
              onClick={(event) => {
                event.preventDefault()
                this.ApproveStake()
              }}
            >{sattetext}</button>
          </Col>
        </Row>
      }else{
        buttonperation= <div style={{textAlign: "center"}}>
        <button 
          className="button-connect"
          onClick={(event) => {
            event.preventDefault()
            this.props.checkconect()
          }}>Connect Wallet
        </button>
        </div>
      }
      let approvepool;
      if(this.state.showapprove == 0){
        approvepool = "SUBMIT TOKEN"
      }else if (this.state.showapprove ==1){
        approvepool = "ADD TOKEN"
      }else if (this.state.showapprove ==2){
        approvepool = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
        if(this.state.showbuytoken){
          alert("Token already exists.")
          window.location.replace(WEB + 'buytoken');
        }
        let noticepool;
        if(this.state.shownoticepool) {
        noticepool = <p></p>
        } else {
        noticepool = <p>Pool already exists. Add to the pool</p>
        }
        let createtoken;
        if(this.state.showtoken) {
            createtoken = <div className="container-fluid mt-5" >
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '700px' }}>
                    <div className="content mr-auto ml-auto form-createstake">
        <h3 class="h3-register">Register Token Sales</h3>
        <div className="noticepool">{noticepool}</div>
          <form onSubmit={this.handleSubmitadd} className="form-contract">
          <label>Token Pool</label>
          <input
              type="text"
              className="input-contract"
              placeholder={this.state.nameToken}
              required 
              readOnly/>
          <label>Symbol</label>
          <input
              type="text"
              className="input-contract"
              placeholder={this.state.symbolToken}
              required 
              readOnly/>  
          <label>Token Balance(*): {this.state.balanceToken/(10**this.state.decimalToken)} {this.state.symbolToken}</label>
          
          <input
              type="number"
              value={this.state.valueBaStake} 
              onChange={this.handleChangebastake}
              className="input-contract"
              placeholder="Sales Quantity"
              required />
          <label>Address:</label>
          <input
              type="number"
              className="input-contract"
              placeholder={this.state.account}
              required 
              readOnly/>
            <label>Ratio USDT / {this.state.symbolToken} (*):</label>
          <input
              type="number"
              value={this.state.valueRatio} 
              onChange={this.handleChangeratio}
              className="input-contract"
              placeholder="Ratio"
              required 
              style={{marginBottom: "0px"}}
          />
          <div class="main-search-estimate">
              {
                 this.state.responseDataSearch.map((i) =>{
                   return(
                   <p className="color-search">{i.info}</p>
                   )
                 })
              }
          </div>
 
             <label><b>Token Infomation (if any)</b></label>
             <br></br>
             <label>Website:</label>
             <input
              type="text"
              value={this.state.valueWeb} 
              onChange={this.handleChangeweb}
              className="input-contract"
              placeholder="Website url"
               />
              <label>Coinmarketcap:</label>
             <input
              type="text"
              value={this.state.valueMarketcap} 
              onChange={this.handleChangemarketcap}
              className="input-contract"
              placeholder="Coinmarketcap url"
               />
              <label>Coingecko:</label>
             <input
              type="text"
              value={this.state.valuegeGecko} 
              onChange={this.handleChangegecko}
              className="input-contract"
              placeholder="Coingecko url"
               />
              <label>Official Link:</label>
             <input
              type="text" 
              value={this.state.valuegeExchange1} 
              onChange={this.handleChangeexchange1}
              className="input-contract"
              placeholder="Official Link"
               />
          <p className="notice-pool">
          <svg width="1.5em" height="1.5em" viewBox="0 0 17 16" class="bi bi-exclamation-triangle-fill" style={{color: "#e74c3c", marginRight:"5px"}} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
            Each token address can just only open the pool once</p>
            <div style={{textAlign:"center"}}>
            {buttonperation}
          {/* <button type="submit" className="background-color" disabled={this.state.disableButtonAddpool}>{approvepool}</button> */}
          </div>
          </form>
                    </div>
                </main>
            </div>
        </div>
        }else{
          createtoken = <div className="div-image-loading">
            <img src="https://bcoders.org/public/image/unistakes.png" className="image-loading"/>
        </div> 
        }
       
        return(
          <>
          <Modal show={this.state.showModal} onHide={this.close} >
            <div class="modal-show">
                  <svg width="7em" height="7em" viewBox="0 0 16 16" class="bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                </svg>
                <p className="p-success">Successful</p>
                <br></br>
                <button class="button-success" onClick={this.success}>OK</button>
                {/* <p>SUCCESS</p> */}
            </div>
          </Modal>
          <div>
            <div class="main">
                {createtoken}                
            </div>
            <Footer/>
          </div>
          </>
        )
    }
} 
export default withRouter(Createtoken)