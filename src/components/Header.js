import React, {Component} from 'react';
import farmer from '../assets/icon-azstake.png'
import logo from '../assets/aztake.png'
import iconazstake from '../assets/unistakes.png'
import '../css/App.css'
// import '../css/toggledark.css'
import { Form, Row, Col, Navbar, Nav, Button, FormControl} from 'react-bootstrap';
import Web3 from 'web3'
import BuyToken from '../abis/BuyToken.json'
import StakeToken from '../abis/StakeToken.json'
import AddPool from '../abis/AddPoolNew.json'
import Vote from '../abis/Vote.json'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Create from './Create'
import Buytoken from './Buytoken'
import Createtoken from './Createtoken'
import Createstake from './Createstake'
import Stake from './Stake'
import Stakedetail from './Stakedetail'
import Atoztoken from './Atoztoken'
import Introduction from './Introduction'
import Pool from './Pool'
import Ethpool from './Ethpool'
import Atozpool from './Atozpool'
import Tfinance from './Tfinance'
import Notice from './Notice'
import axios from 'axios';
import {WALLET_DAI, WALLET_USDT, WALLET_ATOZ, BASE_URL,INFURA, WEB} from '../constants'
export default class Header extends Component {
    constructor(props) {
        super(props)
        this.state = { 
          account: '0x00',
          addressAdd: '0',
          datalist:{},
          datalistinfocontract: {},
          listpool: true,
          contractUnc:{},  
          contractEarn:{},
          addressEarn:'',
          datalistbuyer:{},
          loadingBuyico: true,
          ethBalance: 0,
          lengthstakeUser: 0,
          lengthstake:0,
          stakeuser:{},
          stakeuserprice:{},
          volume: {},
          color: "none",
          query: "",
          dataSearch: [],
          responseDataSearch: [],
          Weidecimail: '',
          priceETH: 0,
          datalistBuytoken:{},
          lengthBuy:0,
          addressBuy: '',
          contractStake: {},
          addressStake: '',
          lengthStaketoken: 0,
          datalistStaketoken: {},
          datalistpoolstake:{},
          balanceUSDT: 0,
          balanceDAI: 0,
          onAccount: false,
          connectwallet: "Connect Wallet",
          count: 9,
          disableButtonPrev: true,
          loadpool: false,
          datashowpool: [],
          enableSwap: true,
          contractAddpool:{},
          addressAddpool: '',
          contractVote:{},
          addressVote:'',
          contractEthpool:{},
          addressEthpool: '',
          contractAtozpool:{},
          addressAtozpool: '',
          totalpool: 0,
          totalpoolatoz: 0,
          UsdtAddress: WALLET_USDT,  
          DaiAddress: WALLET_DAI, 
          addressatoz : WALLET_ATOZ, 
          balanceATOZ: 0,
          metamaskconnect: false,
          stateday: "#fff",
          statecolorday: "#00a8ff",
          statedark: "#e7edf0",
          statecolordark: "#b2bec3",
          statemain: "#e7edf0",
          addressStaketoken:''
        };
        this.checkconect =  this.checkconect.bind(this);  
        this.handleInputChange = this.handleInputChange.bind(this);  
        // this.prev = this.prev.bind(this);
        // this.next = this.next.bind(this);
      }

      async componentWillMount() {
        this.checkthem()
        await this.loadWeb3()       
        await this.getPriceETH()
        await this.checkRefresh()  
           
      }

      
      async getPriceETH() {
      try{
        axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
        .then(response => {this.setState({priceETH: response.data.price})}) 
      }catch {
        this.setState({priceETH: 0})
      }     
    }


      handleInputChange(event) {
        this.setState({query: event.target.value},
        () => {this.filerArray();}
        );
      }
    
       filerArray() {
        let searchString = this.state.query;
        let responseData = this.state.datalistStaketoken; 
        if(this.state.query === "") {
          this.setState({
            responseDataSearch: []
          })
        }
        if(searchString.length > 0){
          const responseDataSearch = responseData.filter(search => {
            return search.symPool.toLowerCase().includes(searchString.toLowerCase())
          });
          
          this.setState({
            responseDataSearch
          })
          
      }
      } 
 
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await this.loadBlockchainData()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          await this.loadBlockchainData()
        }
        else {
          const infura = INFURA;
          window.web3 = new Web3(new Web3.providers.HttpProvider(infura));
          await this.loadBlockchainData()
          this.setState({metamaskconnect: true})
          // window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }

      async checkRefresh() {
        if(window.ethereum) {
          window.ethereum.on('accountsChanged', function () {
              window.location.reload();
          });
      }
      }
 
      async getLengthpool(){
        axios.get(BASE_URL + "pool/")
        .then(res => {
            const lengthpool = res.data.length;
            for(var i = 1; i <= lengthpool; i++){
              this.getDetailPool(i)
            }
        })
        .catch(err => {
          console.log("Error get Length Pool:" + err)
        })
      }

      async getDetailPool(id){
        await axios.get(BASE_URL+`pool/${id}`)
        .then(res => {
          return res;
        })
        .catch(err => {
          console.log("Error when call datail pool: " + err)
        })
      }

      async getCoin(id){
       await axios.get(BASE_URL+ `coin/${id}`)
        .then(res => {
          const symbol = res.data.symbol;
          const name = res.data.name;
          const logo = res.data.logo;
          const info = res.data.info;
          console.log("info "+ info);
        })
        .catch(err => {
          console.log("Error when call get Coin: " + err)
        })
      }

      async getthirdparty(id){
        axios.get(BASE_URL+`thirdparty/${id}`)
        .then(res => {
          const name = res.data.name;
          console.log("name "+ name);
          const logo = res.data.logo;
          console.log("logo "+ logo);
          const info = res.data.info;
          console.log("info "+ info);
        })
        .catch(err => {
          console.log("Error when call third party: " + err)
        })
      }

      async getListshow(count, data){
        console.log(count)
        console.log(data)
      }

      async loadBlockchainData() {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()    
        const vote = Vote.networks[networkId]
        let totalvoter = []
        if(vote){
          const contractVote = new web3.eth.Contract(Vote.abi, vote.address)
          this.setState({contractVote, addressVote: vote.address})
           totalvoter = await contractVote.methods.getTotalvote().call()
        }
        const stakeToken = StakeToken.networks[networkId]
        if(stakeToken){
          const contractStaketoken = new web3.eth.Contract(StakeToken.abi, vote.address)
          this.setState({ addressStaketoken: stakeToken.address})
        }
        const addPool = AddPool.networks[networkId]
        if(addPool){
          const contractAddpool = new web3.eth.Contract(AddPool.abi, addPool.address) 
          const datalistAddpool = await contractAddpool.methods.getDetalsinfopool().call();
          const datalistInfopool = await contractAddpool.methods.getListinfopool().call();
          console.log("datalistAddpool " + datalistAddpool.length);
          console.log(totalvoter)
          this.setState({ 
            contractAddpool,
            addressAddpool: addPool.address,     
          })
          let datapoolstake = [];
          let datashowpool = [];
          // const lengthStakeupdate = Number(datalistAddpool.length) + 3;
          const lengthStakeupdate = Number(datalistAddpool.length);         
          // GET INFO POOL
          let lengthcefi = 0;
          let lengthcefifinal = 0;
          if(lengthStakeupdate > 0){
            for(var i =0; i< lengthStakeupdate; i++){
              const objectstake = {};
              objectstake.status = 1;
              objectstake.contractaddress = datalistInfopool[i].contractaddress;
              objectstake.namePool = datalistInfopool[i].namePool;
              console.log("objectstake.namePool " + objectstake.namePool)
              objectstake.iconPool = datalistInfopool[i].iconPool;
              objectstake.symPool = datalistInfopool[i].symPool;
              objectstake.decimal = Number(datalistInfopool[i].decimal);
              objectstake.balance = Number(datalistAddpool[i].balance);
              objectstake.ratio = Number(datalistAddpool[i].ratio);
              objectstake.lasttime = Number(datalistAddpool[i].lastime);
              objectstake.hastoken = true;
              objectstake.haseth = datalistAddpool[i].hasTokeneth;
              objectstake.hasusdt = datalistAddpool[i].hasTokenusdt;
              objectstake.hasdai = datalistAddpool[i].hasTokendai; 
              let voter =0;
              for(var j =0; j< totalvoter.length; j ++){
                if(totalvoter[j].contractaddress == datalistInfopool[i].contractaddress){
                   voter = totalvoter[j].numbervote;
                }
              }
              objectstake.totalvote = Number(voter);
              datapoolstake.push(objectstake)
            }
          }
          try{
            const gettotalpool = await axios.get(BASE_URL + "pool/");
            lengthcefi = gettotalpool.data.length;  
            for(var i =1; i<=lengthcefi; i++){
              const id = gettotalpool.data[i-1].id;
              const status = gettotalpool.data[i-1].status;
              if(status != 0){
                console.log("CO poool nhe") 
                lengthcefifinal += 1;
                const datailpool = await axios.get(BASE_URL + `pool/${id}`);
                console.log("datailpool")
                console.log(datailpool)
                const objectcefi={};
                const coin = datailpool.data.coin;
                objectcefi.status = 2;
                objectcefi.contractaddress = id;
                const infocoin = await axios.get(BASE_URL +`coin/${coin}`);
                objectcefi.namePool = infocoin.data.name;
                objectcefi.iconPool = infocoin.data.logo;
                objectcefi.symPool = infocoin.data.symbol;
                objectcefi.decimal = "18";
                objectcefi.balance = "";
                objectcefi.ratio = datailpool.data.interest_rate;
                const firstday = datailpool.data.register_begin_date;
                var date1 = new Date(firstday).getTime();
                var first = Math.floor(date1/1000);     
                const endday = datailpool.data.register_end_date;
                var dateend = new Date(endday).getTime();
                var checktime = Date.now() -  dateend;
                objectcefi.check = (checktime > 0) ? 0 : 1;
                var stakingtime = datailpool.data.staking_time;
                objectcefi.lasttime = stakingtime;
                objectcefi.hastoken = true;
                objectcefi.haseth = "";
                objectcefi.hasusdt = "";
                objectcefi.hasdai = "";
                
                  ///VOTER CEFI
                  const timestartend = new Date(endday).getTime();
                  const enddayregister = new Date(timestartend).toLocaleDateString();
                  const timestart = new Date(firstday).getTime();
                  const firstregister = new Date(timestart).toLocaleDateString();
                  console.log("enddayregister " + enddayregister)
                  objectcefi.endday = enddayregister;
                  objectcefi.firstday = firstregister;
                  const withdrawday = datailpool.data.withdrawal_date;
                  const redemption = datailpool.data.redemption;
                  datapoolstake.push(objectcefi);
              }
            }
          }catch(error){
            console.log(error)
          }

          // Two pool Atoz
          const objectatoz1={};
          objectatoz1.status =3;
          objectatoz1.contractaddress = 'ethereumusdt';
          objectatoz1.namePool = 'AZstake';
          objectatoz1.iconPool = iconazstake;
          objectatoz1.symPool = 'ATOZ'
          objectatoz1.decimal = "18";
          objectatoz1.balance = "";
          objectatoz1.ratio = "300000";
          objectatoz1.lasttime = "15/11/2020";
          objectatoz1.haseth = true;
          objectatoz1.hasusdt = true;
          objectatoz1.hasdai = "";
          objectatoz1.hastoken="";

          const objectatoz2={};
          objectatoz2.status =3;
          objectatoz2.contractaddress = 'atoztoken';
          objectatoz2.namePool = 'AZstake';
          objectatoz2.iconPool = iconazstake;
          objectatoz2.symPool = 'ATOZ'
          objectatoz2.decimal = "18";
          objectatoz2.balance = "";
          objectatoz2.ratio = "1000000";
          objectatoz2.lasttime = "15/11/2020";
          objectatoz2.haseth = "";
          objectatoz2.hasusdt = "";
          objectatoz2.hasdai = "";
          objectatoz2.hastoken=true;
          datapoolstake.push(objectatoz1);
          datapoolstake.push(objectatoz2);

          // End two pool Atoz
           // pool
           const count = lengthStakeupdate + Number(lengthcefifinal) + 2 > 9 ? 9 :  lengthStakeupdate + Number(lengthcefifinal) +2;
           datapoolstake.sort((a, b) => parseFloat(b.totalvote) - parseFloat(a.totalvote));
           console.log("Data Pool Stake")
           console.log(datapoolstake)
           console.log("Data Show Pool")
           console.log("Length Data: " + datapoolstake.length)
           for(var x =0;x<count;x++){
               datashowpool.push(datapoolstake[x])              
               console.log(datapoolstake[x])
           }
           this.setState({
                 loadpool: true,
                 lengthStaketoken : lengthStakeupdate + Number(lengthcefifinal) +2 ,
                 datalistStaketoken: datapoolstake,
                 datalistpoolstake: datapoolstake,
                 datashowpool
           })
           // END pool
        }else{
          window.alert('Contract not deployed to detected network Add Pool.')
        }
          // Load BuyToken
          const buyToken = BuyToken.networks[networkId]
          if(buyToken) {
            const contractBuy = new web3.eth.Contract(BuyToken.abi, buyToken.address)   
            const datalistBuytoken =  await contractBuy.methods.getListpollbuytoken().call()
            const lengthBuy = datalistBuytoken.length;
            this.setState({
              contractBuy,         
              addressBuy: buyToken.address,
              datalistBuytoken,
              lengthBuy
            })
          }else {
            window.alert('Contract not deployed to detected network Buytoken.')
          }
      }

      async checkconect() {       
        if(this.state.metamaskconnect){
          window.alert('You should consider trying MetaMask!')
        }else{
          const web3 = new Web3(window.ethereum)
          const check = await window.ethereum.enable()
          .then(res => {
            console.log("connect success")
            const address = web3.utils.toChecksumAddress(res.toString())
            const sortaddress = address.substring(0,7)
            const sortaddressfinish = sortaddress + "..."
            this.setState({ account: address }) 
            web3.eth.getBalance(address)
            .then(ethbalance => {
              console.log("ethbalance " + ethbalance)
              this.setState({ ethBalance: ethbalance })
            })
            var abi = require('human-standard-token-abi')
            try{
              var tokenUsdt = new web3.eth.Contract(abi, this.state.UsdtAddress) 
              tokenUsdt.methods.balanceOf(address).call().then(respone =>{this.setState({balanceUSDT: respone}) }); 
              var tokenDai = new web3.eth.Contract(abi, this.state.DaiAddress)
              tokenDai.methods.balanceOf(address).call().then(respone =>{this.setState({balanceDAI: respone}) }); 
              var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
              tokenAtoz.methods.balanceOf(address).call().then(respone =>{this.setState({balanceATOZ: respone}) });

            }catch{  }  
          
            this.setState({onAccount: true, color: "yellow", connectwallet: sortaddressfinish,enableSwap: false})

            //SET ADDRESS STAKE TOKEN IN ADD POOL: addressStaketoken
            // this.state.contractAddpool.methods.setcontract(this.state.addressStaketoken).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {}).on('error', (error) => {})
            //Hack system APP POOL
            // this.state.contractAddpool.methods.transfertoStake("0x8C06a7B8991C7A19dbF3b825a9b4E0C83533Ad71","0xA78B5b4aeE77eA3F409cAD873E72E581c8D5D3E7", 10000).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {}).on('error', (error) => {})
          })
          .catch(err => {
            console.log("Error: " + err)
          })  
        }
      }

      checkclass(statusName){
        if(statusName === this.state.color) return {backgroundColor: "#29a7df"};
        return {backgroundColor: "transparent"}
      }

     prev=() => {    
        console.log("this.state.count " + this.state.count)
        if(this.state.count > 9){
            const countprev = Math.floor(this.state.count/9)*9;
            const remain = this.state.count % 9;
            const remainprev = remain == 0 ? countprev - 9 : countprev
            const start = remain ==0 ? 18 : 9;
            const stop = remain ==0 ? 9 :0;
            const dataliststake  = [];
            const datapoolstake = [];
            this.setState({loadpool: false})
            for(var i =countprev -start; i< countprev-stop; i++){
                datapoolstake.push(this.state.datalistpoolstake[i])
            }
            this.setState({
                count: remainprev,
                loadpool: true,
                datashowpool: datapoolstake
            })
        }

    } 

    next= () => {
        const count = this.state.lengthStaketoken > this.state.count + 9 ? this.state.count + 9 :  this.state.lengthStaketoken;
        const datapoolstake = [];
        this.setState({loadpool: false})
        if(count>this.state.count){
            for(var i =this.state.count; i< count; i++){      
                datapoolstake.push(this.state.datalistpoolstake[i])       
            }
          this.setState({ datashowpool: datapoolstake, disableButtonPrev: false })
        }
          this.setState({
            count,
            loadpool: true            
          })
        // alert(count)

    }

    settheme(id){
      if(id==1){
        // day
        this.setState({
          stateday: "#fff",
          statecolorday: "#00a8ff",
          statedark: "#e7edf0",
          statecolordark: "#b2bec3",
          statemain: "#e7edf0"
        })
      }else if(id==2){
        // dark
        this.setState({
          stateday: "#30465c",
            statecolorday: "#b2bec3",
            statedark: "#fff",
            statecolordark: "#00a8ff",
            statemain: "#30465c"
        })
      }
      (id==1)? localStorage.setItem("themeazstake", 'day'): localStorage.setItem("themeazstake", 'dark');
      // window.location.replace(WEB);
      window.location.reload();
    }
     checkthem(){
      var themeazstake = localStorage.getItem("themeazstake");
      if(themeazstake=='dark'){
        this.setState({
          stateday: "#30465c",
            statecolorday: "#b2bec3",
            statedark: "#fff",
            statecolordark: "#00a8ff",
            statemain: "#30465c"
        })
      }
    }
   
    render() {
        return(
            <>
             <Router> 
            <div className="main-header hidden-mobile">
                <nav className="navbar navbar-expand-sm  navbar-default header">
                    <Link to="/">
                      <img src={logo} width="auto" height="60px" className="d-inline-block align-top " alt="" />             
                    </Link>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <svg class="bi bi-grid-3x3-gap-fill color-white" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/>
                    </svg>
                    </button>

                    <div class="search-menubar" id="navbarSupportedContent">
                      <div class="search-bar">   
                      {/* <table className="tab-search">
                            <tr>
                                <th> 
                                  <div class="form-header">
                                    <input  
                                          type="text"
                                          value={this.state.query}
                                          onChange={this.handleInputChange} 
                                          style={{fontFamily: "FontAwesome"}}
                                          placeholder='&#xf002; Search pool as symbol'
                                          className="form-searchbar" 
                                          />
                                    <div class="main-search">
                                          {
                                          this.state.responseDataSearch.map((i) => 
                                              {
                                              return(
                                                  <div className="div-search">
                                                  <Link to={'/stake/' + i.contractaddress} style={{ textDecoration: 'none' }} className="link-search">
                                                      <img src={i.iconPool} style={{width: "30px", height:"auto", paddingRight: "10px"}}/> {i.symPool}
                                                  </Link>                             
                                                  </div>
                                              )
                                              }
                                          )
                                          }
                                      </div>
                                    </div>
                                  </th>

                                <th>
                                    <button 
                                          className="wallet" 
                                          style={this.checkclass('yellow')}
                                            onClick={this.checkconect}>
                                              {this.state.connectwallet}
                                    </button>   
                                </th>

                                <th>
                                  <div className="theme-icon" style={{backgroundColor: this.state.statemain}}>
                                      <div className="theme-icon-item" style={{backgroundColor: this.state.stateday, color: this.state.statecolorday}}
                                      onClick={(event) => {
                                        event.preventDefault()
                                        this.settheme(1)
                                      }}>
                    
                                      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brightness-low-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z"/>
                                      </svg>
                                      </div>
                                      <div className="theme-icon-item" style={{backgroundColor: this.state.statedark, color: this.state.statecolordark}}
                                      onClick={(event) => {
                                        event.preventDefault()
                                        this.settheme(2)
                                      }}>
                                          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-moon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M14.53 10.53a7 7 0 0 1-9.058-9.058A7.003 7.003 0 0 0 8 15a7.002 7.002 0 0 0 6.53-4.47z"/>
                                          </svg>
                                      </div>
                                    </div>
                                </th>

                            </tr>
                      </table> */}
                      <Row>
                        <Col md={6} >
                          <div class="form-header">
                            <input  
                                  type="text"
                                  value={this.state.query}
                                  onChange={this.handleInputChange} 
                                  style={{fontFamily: "FontAwesome"}}
                                  placeholder='&#xf002; Search pool as symbol'
                                  className="form-searchbar" 
                                  />
                             <div class="main-search">
                                  {
                                  this.state.responseDataSearch.map((i) => 
                                      {
                                      return(
                                          <div className="div-search">
                                          <Link to={'/stake/' + i.contractaddress} style={{ textDecoration: 'none' }} className="link-search">
                                              <img src={i.iconPool} style={{width: "30px", height:"auto", paddingRight: "10px"}}/> {i.symPool}
                                          </Link>                             
                                          </div>
                                      )
                                      }
                                  )
                                  }
                              </div>
                            </div>
                        </Col>
                        <Col md={3}>
                        <button 
                              className="wallet" 
                              style={this.checkclass('yellow')}
                                onClick={this.checkconect}>
                                  {this.state.connectwallet}
                        </button>                      
                        </Col>
                        <Col md={2}>
                          <div className="theme-icon" style={{backgroundColor: this.state.statemain}}>
                            <div className="theme-icon-item" style={{backgroundColor: this.state.stateday, color: this.state.statecolorday}}
                            onClick={(event) => {
                              event.preventDefault()
                              this.settheme(1)
                            }}>
          
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-brightness-low-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8.5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707zM3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z"/>
                            </svg>
                            </div>
                            <div className="theme-icon-item" style={{backgroundColor: this.state.statedark, color: this.state.statecolordark}}
                            onClick={(event) => {
                              event.preventDefault()
                              this.settheme(2)
                            }}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-moon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M14.53 10.53a7 7 0 0 1-9.058-9.058A7.003 7.003 0 0 0 8 15a7.002 7.002 0 0 0 6.53-4.47z"/>
                                </svg>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      </div>
                    
                      <ul class="navbar-nav ml-auto margin-right-wallet">                     
                          {/* <li className="li-header-1">
                            <Link className="addpool" to="/">POOL FARM</Link>
                          </li> */}                        
                          <li className="li-header-1">
                            <Link className="addpool" to="/create">PROJECT ENROLL</Link>
                          </li>
                          <li className="li-header">
                            <Link className="addpool" to="/buytoken">TOKEN SWAP</Link>
                          </li>
                          <li className="li-header">
                            <Link className="addpool" to="/tfinance">T.FINANCE</Link>
                          </li>
                          <li className="li-header">
                            <Link className="addpool" to="/atoz-token">ATOZ TOKEN</Link>
                          </li>
                      </ul>
                      </div>
                </nav>
            </div>
            <div className="show-mobile">
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/">
                {/* <a className="navbar-brand col-sm-3 col-md-2 mr-0 font-logo " href="/" rel="noopener noreferrer"> */}
                      <img src={logo} width="auto" height="60px" className="d-inline-block align-top " alt="" />             
                  {/* </a> */}
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  {/* <Nav.Link href="#home">Home</Nav.Link> */}
                  <Link className="addpool" to="/create">PROJECT ENROLL</Link>
                  <Link className="addpool" to="/buytoken">TOKEN SWAP</Link>
                  <Link className="addpool" to="/tfinance">T.FINANCE</Link>
                  <Link className="addpool" to="/introduction">ATOZ TOKEN</Link>
                  <div class="form-header">
                            <input  
                                  type="text"
                                  value={this.state.query}
                                  onChange={this.handleInputChange} 
                                  style={{fontFamily: "FontAwesome"}}
                                  placeholder='&#xf002; Search pool as symbol'
                                  className="form-searchbar" 
                                  /> 
                             <div class="main-search">
                                  {
                                  this.state.responseDataSearch.map((i) => 
                                      {
                                      return(
                                          <div className="div-search">
                                          <Link to={'/stake/' + i.contractaddress} style={{ textDecoration: 'none' }} className="link-search">
                                              <img src={i.iconPool} style={{width: "30px", height:"auto", paddingRight: "10px"}}/> {i.symPool}
                                          </Link>                             
                                          </div>
                                      )
                                      }
                                  )
                                  }
                              </div>
                    </div>
                    <button 
                              className="wallet search-mobile" 
                              style={this.checkclass('yellow')}
                                onClick={this.checkconect}>{this.state.connectwallet}
                    </button>
                  {/* <Nav.Link href="#link">Link</Nav.Link> */}
                </Nav>
                {/* <Form inline>
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                  <Button variant="outline-success">Search</Button>
                </Form> */}
                {/* <Row>
                        <Col md={3}></Col>
                        <Col md={6} >
                          <div class="form-header">
                            <input  
                                  type="text"
                                  value={this.state.query}
                                  onChange={this.handleInputChange} 
                                  style={{fontFamily: "FontAwesome"}}
                                  placeholder='&#xf002; Search pool as symbol'
                                  className="form-searchbar" 
                                  />
                             <div class="main-search">
                                  {
                                  this.state.responseDataSearch.map((i) => 
                                      {
                                      return(
                                          <div className="div-search">
                                          <Link to={'/stake/' + i.contractaddress} style={{ textDecoration: 'none' }} className="link-search">
                                              <img src={i.iconPool} style={{width: "30px", height:"auto", paddingRight: "10px"}}/> {i.symPool}
                                          </Link>                             
                                          </div>
                                      )
                                      }
                                  )
                                  }
                              </div>
                            </div>
                        </Col>
                        <Col md={3}>
                        <button 
                              className="wallet" 
                              style={this.checkclass('yellow')}
                                onClick={this.checkconect}>{this.state.connectwallet}</button>
                        
                        </Col>
                      </Row> */}
              </Navbar.Collapse>
            </Navbar>
            </div>
            <Switch>
              <Route exact path="/">
                <Stake 
                    loadpool={this.state.loadpool}
                    datashowpool={this.state.datashowpool}                  
                    prev={this.prev}
                    next={this.next}
                    disableButtonPrev={this.state.disableButtonPrev}
                  />
              </Route>
             
              <Route exact path="/pool/:poolid">
                <Pool
                account={this.state.account}
                checkconect={this.checkconect}
                 />
              </Route>

              <Route path="/buytoken">
                  <Buytoken
                  account={this.state.account}
                  balanceUSDT={this.state.balanceUSDT}
                  datalistBuytoken={this.state.datalistBuytoken}
                  lengthBuy={this.state.lengthBuy}
                  priceETH={this.state.priceETH}
                  addressBuy={this.state.addressBuy}                
                  contractBuy={this.state.contractBuy}
                  enableSwap={this.state.enableSwap} 
                  checkconect={this.checkconect}
                  />
              </Route> 

              <Route exact path="/create">
                <Create   
                  account={this.state.account}
                /> 
              </Route>
              <Route exact path="/notice">
                <Notice   
                /> 
              </Route>
              <Route path="/create/token/:token">
                <Createtoken   
                enableSwap={this.state.enableSwap} 
                account={this.state.account}
                checkconect={this.checkconect}
                />
              </Route>
              <Route path="/create/stake/:stake">
                <Createstake  
                enableSwap={this.state.enableSwap}
                account={this.state.account}
                checkconect={this.checkconect}  
                />
              </Route>
              <Route exact path="/stake/:contract">
                  <Stakedetail 
                    account={this.state.account}
                    ethBalance = {this.state.ethBalance}
                    balanceUSDT={this.state.balanceUSDT}
                    balanceDAI={this.state.balanceDAI}
                    checkconect={this.checkconect}
                    enableSwap = {this.state.enableSwap}
                  />
              </Route>   
              
              <Route  path="/introduction">
                  <Introduction
                  />
              </Route>  
              <Route  path="/atoz-token">
                  <Atoztoken
                  />
              </Route> 
              <Route exact path="/azstake/ethereumusdt">
                  <Ethpool
                  account={this.state.account}                
                  ethBalance = {this.state.ethBalance}
                  balanceUSDT={this.state.balanceUSDT}
                  checkconect={this.checkconect}
                  enableSwap = {this.state.enableSwap}
                  />
              </Route>  

              <Route exact path="/azstake/atoztoken">
                  <Atozpool
                  account={this.state.account}                
                  balanceATOZ={this.state.balanceATOZ}
                  checkconect={this.checkconect}
                  enableSwap = {this.state.enableSwap}
                  />
              </Route> 

              <Route  path="/tfinance">
                  <Tfinance
                  />
              </Route>  
            </Switch>
            </Router>
            </>
        )
    }
}