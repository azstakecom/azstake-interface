import React, { Component } from 'react';
import '../css/App.css'
import '../css/Checkbox.css'
import Web3 from 'web3'
// import StakeToken from '../abis/StakePool.json'
// import StakeToken from '../abis/AddPool.json'
import StakeToken from '../abis/AddPoolNew.json'
import { withRouter } from 'react-router-dom';
import { Modal, Row, Col} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ethnew from '../assets/eth-logo.png'
import dai from '../assets/dai.png'
import usdt from '../assets/usdt.png'
import atoz from '../assets/unistakes.png'
import farmer from '../assets/icon-azstake.png'
import Footer from '../components/Footer'
import axios from 'axios';
import base64 from 'base-64'
import {WALLET_USDT, WALLET_ATOZ, BASE_URL, WEB, SERECT_CODE} from '../constants'
class Createstake extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nameToken: '',
            symbolToken: '',
            imgaeToken: '',
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
          decimalToken: 0,
          shownoticepool: false,
          showSearch: true,
          showResults: false,
          regexp : /^[0-9]/,
          startDate: new Date(),
          disableButtonAddpool: false,
          showcreatpool:false,
          id: '',
          status: 1,
          eth: false,
          usdt: false,
          dai: false,
          token: true,
          valuepayment: 0,
          balancepayment: '',
          contractStake: {},
          addressStake: '',
          showstake: false,
          showModal: false,
          logo: '',
          rearchlogo: [],
          iconproject: "https://bcoders.org/public/image/regispool.png",
          totalsupply: 0,
          allowan: 0,
          showapprove: 0,
          account: '0x00',
          backgroundApprove: "#00a8ff",
          backgroundApprovepayment: "#a4b0be",
          colorApprove: "white",
          colorApprovepayment: "#dfe6e9",
          backgroundApproveStake: "#a4b0be",
          colorApproveStake: "#dfe6e9",
          disableApprove: false,
          disableApprovepayment: true,
          disableApproveStake: true,
          stateapprove: true,
          stateapprovepayment: true,
          statestake: true,
          symbolpayment:'',
          UsdtAddress: WALLET_USDT,  
          addressatoz : WALLET_ATOZ, 
          approvetokenone: false,
          approvetokentwo: false,
          redeemcode: '',
          balanceusdt:0,
          balanceatoz: 0
        }
        this.handleChangebastake = this.handleChangebastake.bind(this);
        this.handleChangelogo = this.handleChangelogo.bind(this);
        this.handleChangeweb = this.handleChangeweb.bind(this);
        this.handleChangemarketcap = this.handleChangemarketcap.bind(this);
        this.handleChangegecko = this.handleChangegecko.bind(this);
        this.handleChangeexchange1 = this.handleChangeexchange1.bind(this);
        this.handleSubmitadd = this.handleSubmitadd.bind(this); 
        this.handleInputChangeeth =  this.handleInputChangeeth.bind(this);
        this.handleInputChangedai =  this.handleInputChangedai.bind(this);
        this.handleInputChangeusdt =  this.handleInputChangeusdt.bind(this);
        this.handleChangeredeem =  this.handleChangeredeem.bind(this);       
        this.close = this.close.bind(this);
        this.success = this.success.bind(this);
    }

    close() {this.setState({ showModal: false });}
    success() {
      this.setState({ showModal: false });
      window.location.replace(WEB);
    }
    handleChangeredeem(event) { this.setState({redeemcode: event.target.value})}
    handleChangelogo(event) {this.setState({logo: event.target.value},
       () => {this.searchlogo()}
    )}
    searchlogo() {
      let searchString = this.state.logo;
      let datasearch= []

      // let responseData = this.state.datalistStaketoken; 
      if(this.state.logo === "") {
        this.setState({
          rearchlogo: [],
          iconproject: "https://bcoders.org/public/image/regispool.png"
        })
      }
      if(searchString.length > 0){
        // const responseDataSearch = responseData.filter(search => {
        //   return search.symPool.toLowerCase().includes(searchString.toLowerCase())
        // });
        const objectlogo = {};
        objectlogo.image = searchString;
        datasearch.push(objectlogo)
        this.setState({
          rearchlogo : datasearch,
          iconproject: searchString
        })
        
    }
    }
    async handleInputChangepayment(event){
      // console.log(event.target.value)
      // event.preventDefault()
      const web3 = window.web3 
      var abi = require('human-standard-token-abi')
      var tokenUsdt = new web3.eth.Contract(abi, this.state.UsdtAddress)
      var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
      var valuepayment =0;
      var balancepayment='';
      var symbol='';
      var disableApprovepayment= true;
      var backgroundApprovepayment = "#00a8ff"
      var colorApprovepayment = "white"
      var approvetokentwo = false;
      if(event.target.value ==1){
        valuepayment =1;
        balancepayment='4,000 USDT';
        // if(this.props.account != '0x00'){ balancepayment = await tokenUsdt.methods.balanceOf(this.state.id).call();  console.log(balancepayment)} 
        symbol = 'USDT'; 
        disableApprovepayment= false;
      }else if(event.target.value ==2){
        valuepayment =2;
        balancepayment='20,000 ATOZ';
        // if(this.props.account != '0x00'){ balancepayment = await tokenAtoz.methods.balanceOf(this.state.id).call(); console.log(balancepayment) } 
        symbol = 'ATOZ';
        disableApprovepayment = false;
      }else if(event.target.value ==3){
        valuepayment =3;
        disableApprovepayment= true;
        backgroundApprovepayment = "#a4b0be";
        colorApprovepayment = "#dfe6e9";
        approvetokentwo= true;
      }
      this.setState({valuepayment, balancepayment, symbolpayment: symbol, disableApprovepayment, backgroundApprovepayment, colorApprovepayment, approvetokentwo})
    }
    
    handleInputChangeeth(event) { this.setState({eth: event.target.checked})}
    handleInputChangedai(event) {this.setState({ dai: event.target.checked})}
    handleInputChangeusdt(event) {this.setState({usdt: event.target.checked})}
    handleChangedate = date => {
        const timeNow = Math.floor(Date.now() / 1000)
        console.log("timeNow: " + timeNow)
          const timeStamp = Math.floor(new Date(date).getTime() / 1000)
          console.log("timeStamp: " + timeStamp)
          const timeHour = Math.floor((timeStamp - timeNow)/3600) + 1
          if(timeHour > 0) {
            this.setState({
              startDate: date, 
              valueTime: timeHour
            });
          }else{
            alert("Please choose a larger time")
          }
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

    async componentDidMount() {
        const id = this.props.match.params.stake;
        this.setState({id, account : this.props.account, disableButtonAddpool : this.props.enableSwap})
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
      tokenHuman.methods.balanceOf(this.props.account).call().then(respone =>{this.setState({balanceToken: respone}) });
      tokenHuman.methods.allowance(this.props.account,this.state.addressStake).call().then(respone => { 
        if(respone > 0){this.setState({showapprove: 1})}
        this.setState({allowan: respone})
      });  
    }

    getToken(contract) {
      const web3 = window.web3 
      var abi = require('human-standard-token-abi')
      var tokenHuman = new web3.eth.Contract(abi, contract)           
      tokenHuman.methods.name().call().then(respone => {this.setState({nameToken: respone})});  
         
      tokenHuman.methods.decimals().call().then(respone =>{ this.setState({decimalToken: respone}) });     
      tokenHuman.methods.symbol().call().then(respone => {this.setState({symbolToken: respone}) }); 
      
      tokenHuman.methods.totalSupply().call().then(respone => {
        this.setState({totalsupply: respone}) 
        console.log("Totalsupply " + respone)
      });   

      this.setState({
          showcreatpool: true
      })

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
      const stakeToken = StakeToken.networks[networkId]
      if(stakeToken) {
        const contractStake = new web3.eth.Contract(StakeToken.abi, stakeToken.address)
        console.log("addrss stake: " + stakeToken.address)
        const balanceusdt = await contractStake.methods.balanceUSDT().call();
        console.log(Number(balanceusdt)/10**6)
        const balanceAtoz = await contractStake.methods.balanceAtoz().call();
        console.log(Number(balanceAtoz)/10**18)
        this.setState({
          contractStake,
          addressStake: stakeToken.address,
          balanceusdt : Number(balanceusdt)/10**6, 
          balanceatoz: Number(balanceAtoz)/10**18      
        })
      }
    }

    async checkcontract(contract) {
      const web3 = window.web3 
      var abi = require('human-standard-token-abi') 
      try{ 
            var tokenHuman = new web3.eth.Contract(abi, contract)
            tokenHuman.methods.name().call().then(respone => {  
                const hasListed = this.state.contractStake.methods.hasListed(contract).call()               
                .then(res => {
                    if(res){
                        const lasttime = this.state.contractStake.methods.lasttime(contract).call()
                        .then(restime => {
                            const timecheck = restime - Math.floor(Date.now() / 1000);
                            if(timecheck > 0){
                                this.setState({
                                    showstake: true                     
                                })
                            }else{
                                this.getToken(contract)
                            }
                        })
                    }else{
                          this.getToken(contract)
                    }

                })                
            })
            .catch(error => {
                alert("Contract Address Wrong")
                window.location.replace(WEB);
            })
      }catch{
        window.location.replace(WEB);
        // console.log("err")
      }
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

    async setsubPool() {
        // this.state.contractUnc.methods.transfer(this.state.addressAdd, 5000*10**6).send({ from: this.state.account }).on('transactionHash', (hash) => {         
          const web3 = window.web3 
          var abi = require('human-standard-token-abi')
          var tokenHuman = new web3.eth.Contract(abi, this.state.id)
          if(this.state.eth && !this.state.dai && !this.state.usdt){
            this.setState({status: 1})
            //  TOKEN ETH
          }else if (this.state.eth && !this.state.dai && this.state.usdt){
            this.setState({status: 2})
            //  TOKEN ETH USDT
          }else if (this.state.eth && this.state.dai && !this.state.usdt){
            //  TOKEN ETH DAI
            this.setState({status: 3})
          }else if (!this.state.eth && this.state.dai && this.state.usdt){
            this.setState({status: 4})
            //  TOKEN USDT DAI
          }else if (!this.state.eth && !this.state.dai && this.state.usdt){
            //  TOKEN USDT 
            this.setState({status: 5})
          }else if (!this.state.eth && this.state.dai && !this.state.usdt){
            //  TOKEN DAI 
            this.setState({status: 6})
          }else if (this.state.eth && this.state.dai && this.state.usdt){
            // TOKEN DAI ETH USDT 
            this.setState({status: 7})
          }else if (!this.state.eth && !this.state.dai && !this.state.usdt){
            //  TOKEN
            this.setState({status: 0})
          }else {
              alert("Please choice methods stake")
              return
          }
          // Transfer token contract
          const image = this.state.logo == '' ? 'https://bcoders.org/public/image/regispool.png' : this.state.logo
          var balance = (this.convert(this.state.valueBaStake*10**this.state.decimalToken)).toString()
          var setpool =0;
          const allowan = await tokenHuman.methods.allowance(this.state.account,this.state.addressStake).call();
          console.log("allowan " +allowan)
          var confirm =0;
          var serect = this.state.redeemcode + SERECT_CODE;
          var sereccode = base64.encode(serect);
          console.log("serect code: " + sereccode)
          this.setState({
            showapprove: 2, statestake: false
           })
           if(Number(allowan) > Number(balance)){
             this.state.contractStake.methods.addpool(
                  this.state.id, 
                  image, 
                  this.state.nameToken, 
                  this.state.symbolToken, 
                  this.state.decimalToken,
                  Math.floor(this.state.valueTime), 
                  balance, 
                  this.state.status,
                  this.state.valuepayment,
                  sereccode
                  ).send({from: this.state.account}).on('confirmation', (confNumber, receipt) => {
                    console.log("confirmation addpool success")
                    if(confirm == 0){
                      axios.get(BASE_URL + `crypto/${this.state.id}/status/Stake`)
                      .then(res => {
                        const status = res.data.status;
                        if(status == 0){
                          axios.post(BASE_URL+ 'postcrypto',{
                            'address': this.state.id,
                            'website': this.state.valueWeb,
                            'coinmarketcap': this.state.valueMarketcap,
                            'coingecko': this.state.valuegeGecko,
                            'officiallink': this.state.valuegeExchange1,
                            'status': "Stake"
                          })
                          .then(response => {
                              console.log("Update infomation success!")
                          })
                          .catch(err => {
                            console.log("Update False")
                          })
                        }
                      })
                      this.setState({showModal: true, disableButtonAddpool: true, showapprove: 1,statestake: true, disableApproveStake: false})
                    }
                    confirm =1;
                      
                }).on('error', (error) => {
                  this.setState({
                    showapprove: 1,
                    statestake: true
                     })
                })  
           }else {
             tokenHuman.methods.approve(this.state.addressStake, this.state.totalsupply).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              console.log("confirmation success")
              this.setState({
                      showapprove: 1
              })
            }).on('error', (error) => {
              this.setState({
                showapprove: 0
                 })
            })
           }
      }

    handleSubmitadd(event) {
        event.preventDefault()
        this.setsubPool()
    }
    checkapprove(){
      if(this.state.approvetokentwo && this.state.approvetokenone){
        this.setState({
           backgroundApproveStake: "#00a8ff",
            colorApproveStake: "white",
            disableApproveStake: false,
        })
      }
    }
    async Approve(){
      const web3 = window.web3; 
      let confirm =0;
      var abi = require('human-standard-token-abi')
      this.setState({stateapprove: false})
      var tokenHuman = new web3.eth.Contract(abi, this.state.id)
      var totalsupplytoken = await tokenHuman.methods.totalSupply().call()
      var balancetoken = await tokenHuman.methods.balanceOf(this.props.account).call();
      if(Number(this.state.valueBaStake) > Number(balancetoken/ 10**this.state.decimalToken)){
        this.setState({stateapprove: true})
        return alert("Your balance is not enough to stake");  }
        tokenHuman.methods.approve(this.state.addressStake, totalsupplytoken).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
        if(confirm == 0){
          this.setState({
            // backgroundApproveStake: "#00a8ff",
            // colorApproveStake: "white",
            // disableApproveStake: false,
            backgroundApprove: "#a4b0be",
            colorApprove: "#dfe6e9",
            disableApprove: true,           
            stateapprove: true, 
            approvetokenone: true
          })
        }  
        this.checkapprove()
        confirm =1;
      }).on('error', (error) => {this.setState({ stateapprove: true})})
    }
    async Approvepayment(){
      const web3 = window.web3; 
      let confirm =0;
      var abi = require('human-standard-token-abi')
      this.setState({stateapprovepayment: false})
      var addresscontract;
      var decimaltoken;
      var balancerequi =0;
      if(this.state.valuepayment==1){
        addresscontract = this.state.UsdtAddress;
        decimaltoken= 10**6;
        balancerequi= 4000;
      }else if(this.state.valuepayment ==2){
        addresscontract = this.state.addressatoz;
        decimaltoken= 10**18;
        balancerequi= 20000;
      }
      var tokenHuman = new web3.eth.Contract(abi, addresscontract)
      var totalsupplytoken = await tokenHuman.methods.totalSupply().call()
      var balancetoken = await tokenHuman.methods.balanceOf(this.props.account).call();
      if(balancerequi > Number(balancetoken/ decimaltoken)){
        this.setState({stateapprovepayment: true})
        return alert("Your balance is not enough to stake");  }
      tokenHuman.methods.approve(this.state.addressStake, totalsupplytoken).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
        if(confirm == 0){
          this.setState({
            // backgroundApproveStake: "#00a8ff",
            // colorApproveStake: "white",
            // disableApproveStake: false,
            backgroundApprovepayment: "#a4b0be",
            colorApprovepayment: "#dfe6e9",
            disableApprovepayment: true,          
            stateapprovepayment: true,
            approvetokentwo: true
          })
        }  
        this.checkapprove()
        confirm =1;
      })
      .on('error', (error) => {this.setState({ stateapprovepayment: true})})
    }
    async ApproveStake(){
      this.setsubPool()
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
      let approvetextpayment;
      if(this.state.stateapprovepayment){
        approvetextpayment =  <div>1.1 Approve {this.state.symbolpayment}</div>
      }else{
        approvetextpayment= <div style={{marginLeft: "auto", marginRight: "auto"}}>
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
          <Col md={4}>
          
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
          <Col md={4}>
          
              <button  
              type="submit" 
              className="background-color-approve-approve"
              style={{backgroundColor: this.state.backgroundApprovepayment, color: this.state.colorApprovepayment}}
              disabled={this.state.disableApprovepayment}
              onClick={(event) => {
                event.preventDefault()
                this.Approvepayment()
              }}
            >{approvetextpayment}</button>
          </Col>
          <Col md={4}>
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
        //Connect Wallet
        approvepool = "SUBMIT POOL"
      }else if (this.state.showapprove ==1){
        //1. Approve : 1.1. Approve Token - Load  1.2. Add Token - Load
        approvepool = "ADD POOL"
      }else if (this.state.showapprove ==2){
        //2. Stake: - LOAD
        approvepool = <div style={{marginLeft: "auto", marginRight: "auto"}}>
          <div class="loader"></div>
          </div>
      }
      if(this.state.showstake){
        alert("Pool already exists.")
        window.location.replace(WEB);
      }
        let noticepool;
        if(this.state.shownoticepool) {
            noticepool = <p>Pool already exists. Add to the pool</p>
        } 
       let showpayment;
        if(this.state.valuepayment==3){
        showpayment = <div >
          <label style={{width:"100%"}}>Please enter the redeem code</label>
                <input 
                className="input-redeemcode"
                placeholder="Enter the redeem code"
                value={this.state.redeemcode} 
                onChange={this.handleChangeredeem}/>
        </div>
       }
        let createstake;
        if(this.state.showcreatpool){
            createstake =  <div className="container-fluid mt-5" >
                            <div className="row">
                                <main role="main" className="col-lg-12 ml-auto mr-auto " style={{ maxWidth: '700px' }}>
                                    <div className="content mr-auto ml-auto form-createstake">
                        <h3 class="h3-register">Register Pool</h3>
                        <div className="noticepool">{noticepool}</div>
                        <form onSubmit={this.handleSubmitadd} className="form-contract" >
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
                        <label>Logo Link:</label>
                        <input
                            type="text"
                            value={this.state.logo} 
                            onChange={this.handleChangelogo}
                            className="input-contract"
                            
                            placeholder="Logo url: size 125px 125px"
                             />
                        <div>
                          {
                            this.state.rearchlogo.map((i) => {
                              return (
                                <p>{this.state.nameToken} logo: <img src={i.image} width="20px" height="auto"/></p>
                              )
                            })
                          }
                        </div>
                        {/* <img src={this.state.logo} width="30px" height="auto"/> */}
                        <p class="p-notice">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-circle" style={{marginRight:"5px"}} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                            </svg>
                            Notice: If you don't update the logo we will use the default icon: <img src="https://bcoders.org/public/image/regispool.png" width="20px" height="auto"/>
                        </p>
                        {/* <p><strong>*Notice:</strong> If you don't update the logo we will use the default icon: <img src="https://bcoders.org/public/image/regispool.png" width="20px" height="auto"/></p>  */}
                         <label>Pool Reward(*): </label>
                        <span className="float-right text-muted">
                            Available: {this.state.balanceToken/(10**this.state.decimalToken)} {this.state.symbolToken}
                        </span>
                        <input
                            type="number"
                            value={this.state.valueBaStake} 
                            onChange={this.handleChangebastake}
                            className="input-contract"
                            
                            placeholder="Quantity"
                            required />
                        <label>Pool Period (*):</label>
                            <div className="input-contract">
                                <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChangedate}
                                />
                            </div>
                            <p class="p-notice">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-circle" style={{marginRight:"5px"}} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                            </svg>
                            Notice: Pool starting time is calculated based on creation date
                        </p>
                            {/* <p><strong>*Notice:</strong> Pool starting time is calculated based on creation date</p> */}
                        <label>Choice The Staking Method (*):</label>
                        <div className="choice-methods">
                        <label style={{marginBottom:"10px"}}>                            
                            <input
                                className="methods-token"
                                name={this.state.symbolToken}
                                type="checkbox"
                                checked={this.state.symbolToken}                               
                                onChange={this.handleInputChangetoken} 
                                />
                                 <span style={{marginRight:"10px", fontSize:"20px"}}>
                                  {this.state.symbolToken}                               
                                  <img src={this.state.iconproject} width="25px" height="auto" style={{marginLeft: "5px", marginBottom:"10px"}}/>
                                </span>
                        </label>
                               
                        <label>                            
                            <input
                                className="methods-token"
                                name="eth"
                                type="checkbox"
                                checked={this.state.eth}                               
                                onChange={this.handleInputChangeeth} 
                                />
                                <span style={{marginRight:"10px", fontSize:"20px"}}>
                                  ETH
                                  <img src={ethnew} width="25px" height="auto" style={{marginLeft: "5px", marginBottom:"10px"}}/>
                                </span>
                        </label>
                        <label>                            
                            <input
                                className="methods-token"
                                name="dai"
                                type="checkbox"
                                checked={this.state.dai}
                                onChange={this.handleInputChangedai} 
                                />
                                 <span style={{marginRight:"10px", fontSize:"20px"}}>
                                  DAI
                                  <img src={dai} width="25px" height="auto" style={{marginLeft: "5px", marginBottom:"10px"}}/>
                                </span>
                        </label>
                        <label>                            
                            <input
                                className="methods-token"
                                name="usdt"
                                type="checkbox"
                                checked={this.state.usdt}
                                onChange={this.handleInputChangeusdt} 
                                />
                                 <span style={{marginRight:"10px", fontSize:"20px"}}>
                                  USDT
                                  <img src={usdt} width="25px" height="auto" style={{marginLeft: "5px", marginBottom:"10px"}}/>
                                </span>
                        </label>
                        </div>
                        <label>Choice Payment Method (*):</label>
                        <div className="choice-methods" onChange={this.handleInputChangepayment.bind(this)}>
                            <label className="payment-method">                            
                                <input
                                    className="input-payment"
                                    name="paymentatoz"
                                    type="radio"
                                    name="payment"
                                    value="1"
                                    />
                                    <span style={{marginRight:"10px", fontSize:"20px"}}>
                                      {/* <img src={usdt} width="25px" height="auto" style={{marginRight: "10px", marginBottom:"10px"}}/> */}
                                      You need payment {this.state.balanceusdt} USDT                                   
                                    </span>
                            </label>
                            <label  className="payment-method">                            
                                <input
                                    className="input-payment"
                                    name="paymentusdt"
                                    type="radio"
                                    name="payment"
                                    value="2"
                                    />
                                    <span style={{marginRight:"10px", fontSize:"20px"}}>
                                      {/* <img src={atoz} width="25px" height="auto" style={{marginRight: "10px", marginBottom:"10px"}}/> */}
                                      You need payment {this.state.balanceatoz} ATOZ                                      
                                    </span>
                            </label>
                            <label  className="payment-method">                            
                                <input
                                    className="input-payment"
                                    name="paymentredeem"
                                    type="radio"
                                    name="payment"
                                    value="3"
                                    />
                                    <span style={{marginRight:"10px", fontSize:"20px"}}>
                                      Redeem Code
                                      {/* <img src={usdt} width="25px" height="auto" style={{marginLeft: "5px", marginBottom:"10px"}}/> */}
                                    </span>
                            </label>
                        </div>
                        <div className="show-balanc-method">
                          {showpayment}
                        </div>
                             <br></br>
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
                            className=" input-contract"
                          
                            placeholder="Official Link"
                            />
                             {/* <p className="notice-pool">You can add a new pool with this token address when this pool ends</p> */}
                             <p  className="notice-pool">
                              <svg width="1.5em" height="1.5em" viewBox="0 0 17 16" class="bi bi-exclamation-triangle-fill" style={{color: "#e74c3c", marginRight:"5px"}} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                                You can add a new pool with this token address when this pool ends
                             </p>
                                    <div style={{textAlign:"center"}}>
                                      {/* <button 
                                      type="submit" 
                                      className="background-color"
                                      disabled={this.state.disableButtonAddpool}
                        >{approvepool}</button>   */}
                        {buttonperation}
                                    </div>
                        </form>
                                    </div>
                                </main>
                            </div>
        </div>
        }else{
          createstake = <div className="div-image-loading">
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
              {createstake}
            </div>
            <Footer/>
          </div>
          </>
        )
    }
}
export default withRouter(Createstake)