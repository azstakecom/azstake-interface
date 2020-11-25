import React, {Component} from 'react';
import Web3 from 'web3'
import Addpool from '../abis/AddPoolNew.json'
import StakeToken from '../abis/StakeToken.json'
import Vote from '../abis/Vote.json'
import { withRouter } from 'react-router-dom';
import { Modal, Form, Container, Col, Row} from 'react-bootstrap';
import Footer from '../components/Footer'
import axios from 'axios';
import '../css/Radio.css'
import {BASE_URL, NETWORK_ETH, WALLET_DAI, WALLET_USDT, WALLET_ATOZ, WEB} from '../constants'
class StakedetailNew extends Component{
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            iconPool: '',
            symPool: '',
            namePool:'',
            decimal: 0,
            checkcontractaddress: false,
            valueSelect:'ADC',
            balancetoken: 0,
            value: 10,
            totalStakingeth: 0,
            totalStakingusdt: 0,
            totalStakingdai: 0,
            totalStakingtoken: 0,
            balancepool: 0,
            symbol: '',
            rewardUsereth: 0,
            userPoolstakeeth:0,
            rewardPoolstakeeth:0,
            disableButtonunstakeeth: true,
            rewardUserusdt: 0,
            userPoolstakeusdt:0,
            rewardPoolstakeusdt:0,
            disableButtonunstakeusdt: true,
            rewardUserdai: 0,
            userPoolstakedai:0,
            rewardPoolstakedai:0,
            disableButtonunstakedai: true,
            rewardUsertoken: 0,
            userPoolstaketoken:0,
            rewardPoolstaketoken:0,
            disableButtonunstaketoken: true,
            userPoolstake: 0,
            rewardPoolstake:0,
            rewardUser: 0,
            disableButtonunstake: true,
            choice: 0,
            totalrewardtoken: 0,
            totalreward:'',
            withdraw: 0,
            balancepooltoken: 0,
            addressStake: '',
            contractStake: {},
            hasEth: false,
            hasUsdt: false,
            hasDai: false,
            account: '0x00',
            responseDataSearch:[],
            timelast: 0,
            ratio: 0,
            datalistuserstaker:{},
            withdrawtokena : 0,
            withdraweth : 0,
            withdrawusdt: 0,
            withdrawdai : 0,
            lengthstake: 0,
            statuspopup: true,
            dataweb: '',
            datamarketcap: '',
            datagecko: '',
            dataoffice: '',
            loadhistory: false,
            stylecolor: 0.6,
            stylecolortoken: 0.6,
            stylecoloreth:0.6,
            stylecolorusdt:0.6,
            stylecolordai:0.6,
            disableButtonstake: true,
            stylecolorstake: 0.6,
            showModalpopup: true,
            totalsupply: 0,
            allowan: 0,
            showapprove: 0,
            showapprovetoken: 0,
            showapproveusdt: 0,
            showapprovedai: 0,
            showunstake: false,
            contractAddpool: {},
            addressAddpool: '', 
            getStakeuser: [],
            getUserstaking : [],
            showapproveatoz: 0,
            addressatoz :WALLET_ATOZ, 
            UsdtAddress: WALLET_USDT, 
            DaiAddress: WALLET_DAI,
            contractVote: {},
            addressVote: '',
            balanceVote: 10000000000000000000,
            totalvoter: '',
            currentpage: 1,
            totalpage: 1,
            listcurrentpage: 0,
            balanceatoz: 0,
            disableButtonvote: true,
            showtransaction: false,
            checktime: false,
            approvetoken: 0,
            backgroundApprove: "#00a8ff",
            colorApprove: "white",
            backgroundApproveStake: "#a4b0be",
            colorApproveStake: "#dfe6e9",
            disableApprove: false,
            disableApproveStake: true,
            backgroundApproveVote: "#00a8ff",
            colorApproveVote: "white",
            backgroundApproveVoteVote: "#a4b0be",
            colorApproveVoteVote: "#dfe6e9",
            disableApproveVote: false,
            disableApproveVoteVote: true,
            loadingbuttonoperation: false,
            loadingallowanAtoz: false,
            stateapprove: true,
            statestake: true,
            stateapprevevote: true,
            statesubmitvote: true,
            statepending: false,
            statesuccess: false
        }
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.close = this.close.bind(this);
        this.closepopup = this.closepopup.bind(this);
        this.closevote = this.closevote.bind(this);
        
    }
    close() { this.setState({ showModal: false });}
    closevote() { this.setState({ showModalvote: false });}
    closepopup() { this.setState({ showModalpopup: false });}
    
    handleChange(event) { 
      const re = /^[0-9\b\.]+$/;
      if (event.target.value === '' || re.test(event.target.value)) {
        console.log("event.target.value "+ event.target.value)
         this.setState({value: event.target.value},
          () => {
            const checktimelast = this.state.timelast - Math.floor(Date.now() / 1000);
            console.log("this.state.timelast " + this.state.timelast)
            if(checktimelast > 0) {
              this.filerArray(checktimelast);
            } 
        })

     }
    }
  
      filerArray(timeremaining) {
        let searchString = this.state.value;
        const objectestimate ={};
        const dataresponseData=[]
        if(this.state.value == "") {
          this.setState({
            responseDataSearch: []
          })
        }
        if(searchString.length > 0){
          const totalstake = Number(this.state.balancepool)
          const mystaking = Number(this.state.userPoolstake)
          const ratiopool = Number(this.state.ratio) / (10**this.state.decimal)
          console.log("ratiopool" + ratiopool)
          const interest = 100 * (mystaking +  Number(searchString))/(totalstake +  Number(searchString));
          const reward = ratiopool * (mystaking +  Number(searchString))/(totalstake +  Number(searchString));
          const estimateratio =  reward *  Math.floor(timeremaining/60)
          objectestimate.estimate = parseFloat(estimateratio).toFixed(6);
          objectestimate.interest = parseFloat(interest).toFixed(2);
          objectestimate.reward = parseFloat(reward).toFixed(6);
          dataresponseData.push(objectestimate)
          console.log("objectestimate")
          console.log(dataresponseData)
          this.setState({
            responseDataSearch: dataresponseData
          })
          
        }
      }
  
      handleSubmit(event) {
        event.preventDefault()
        console.log("this.state.value " + this.state.value)
        this.staking(Number(this.state.value))
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
  
      async staking(amount) {
        console.log("amount " + amount)
        console.log("this.state.balancetoken " + this.state.balancetoken)
        if(amount < this.state.balancetoken){
          const web3 = window.web3 
        var abi = require('human-standard-token-abi')
        this.setState({showapprove: 2, statestake: false, statepending: true})
        if(this.state.choice == 0){
          var token = new web3.eth.Contract(abi,this.state.id)
          var balance = (this.convert(amount*10**this.state.decimal)).toString()
          var totalsupplytoken = await token.methods.totalSupply().call()
          const allowantoken = await token.methods.allowance(this.state.account,this.state.addressStake).call();
          console.log("allowantoken " + allowantoken)
          console.log("balance " + balance)
          var confirmtoken=0;
          if(Number(allowantoken) > Number(balance)){
            this.state.contractStake.methods.stake(this.state.addressAddpool, this.state.id, balance, this.state.choice).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              if(confirmtoken ==0){
                this.setState({showModal: true, statuspopup: true, showapprove: 1, statestake: true, statesuccess: true})
                setTimeout(this.componentDidMount() , 1000);
              }
              confirmtoken =1;
            }).on('error', (error) => {this.setState({ showapprove: 1, statestake: true})})
          }else {
            token.methods.approve(this.state.addressStake, totalsupplytoken).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              this.setState({showapprove: 1})
            }).on('error', (error) => {this.setState({ showapprove: 1})})
          }
          
        }else if(this.state.choice ==1) { 
          // ETH
          var confirmeth=0;
          var balanceETH = web3.utils.toWei(amount.toString(), 'ether');
          this.state.contractStake.methods.stake(this.state.addressAddpool,this.state.id, balanceETH, this.state.choice).send({value: balanceETH, from: this.state.account }).on('confirmation', (confNumber, receipt)=> {
            if(confirmeth == 0){
              this.setState({showModal: true, statuspopup: true, showapprove: 1, statestake: true,statesuccess: true})
              setTimeout(this.componentDidMount() , 1000);
            }
            confirmeth =1;
          }).on('error', (error) => {this.setState({ showapprove: 1, statestake: true})})
        }else if (this.state.choice ==2){
          // USDT         
          var tokenUsdt = new web3.eth.Contract(abi, this.state.UsdtAddress)
          var totalsupplyusdt = await tokenUsdt.methods.totalSupply().call()
          const allowanusdt = await tokenUsdt.methods.allowance(this.state.account,this.state.addressStake).call();
          const balanceusdt = amount*(10**6);
          var confirmusdt =0;
          if(Number(allowanusdt) > Number(balanceusdt)){
            this.state.contractStake.methods.stake(this.state.addressAddpool,this.state.id, amount*(10**6), this.state.choice).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              if(confirmusdt ==0){
                this.setState({showModal: true, statuspopup: true, showapprove: 1, statestake: true, statesuccess: true})
                setTimeout(this.componentDidMount() , 1000);
              }
              confirmusdt =1;
            }).on('error', (error) => {this.setState({ showapprove: 1, statestake: true})})
          }else {
            tokenUsdt.methods.approve(this.state.addressStake, totalsupplyusdt).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              this.setState({showapprove: 1})
            }).on('error', (error) => {this.setState({ showapprove: 1})})
          }
        }else if(this.state.choice ==3) {
          var tokenDai = new web3.eth.Contract(abi, this.state.DaiAddress)
          var confirndai =0;
          var balanceDAI = web3.utils.toWei(amount.toString(), 'ether');
          var totalsupplydai = await tokenDai.methods.totalSupply().call()
          const allowandai = await tokenDai.methods.allowance(this.state.account,this.state.addressStake).call();
          if(Number(allowandai) > Number(balanceDAI)){
            this.state.contractStake.methods.stake(this.state.addressAddpool, this.state.id, balanceDAI, this.state.choice).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              if(confirndai == 0) {
                this.setState({showModal: true, statuspopup: true, showapprove: 1, statestake: true, statesuccess: true})
                setTimeout(this.componentDidMount() , 1000);
              }
              confirndai = 1;
            }).on('error', (error) => {this.setState({ showapprove: 1, statestake: true})})
          }else {
            tokenDai.methods.approve(this.state.addressStake, totalsupplydai).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              this.setState({showapprove: 1})
            }).on('error', (error) => {this.setState({ showapprove: 1})})
          }       
        }    
        }else{
          alert("Your balance is not enough to stake")
        }      
      }

      async confirmVote(){
        const web3 = window.web3 
        var abi = require('human-standard-token-abi')
        var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
        var balanceatoz = await  tokenAtoz.methods.balanceOf(this.state.account).call();
        if(balanceatoz > 10000000000000000000){this.setState({disableButtonvote: false})}
        var balanceATOZ =  web3.utils.fromWei(balanceatoz.toString(), 'ether')
        this.setState({showModalvote: true, balanceatoz: balanceATOZ })
      }
   
      async voteting(){
        const web3 = window.web3 
        var abi = require('human-standard-token-abi')
        this.setState({showapproveatoz: 2, statesubmitvote: false})
        var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
        var totalsupplyAtoz = await tokenAtoz.methods.totalSupply().call()
        var balanceaccountvote = await  tokenAtoz.methods.balanceOf(this.state.account).call();
        console.log("balanceaccountvote  "+ balanceaccountvote)
        var confirvote =0;
        const allowanatoz = await tokenAtoz.methods.allowance(this.state.account,this.state.addressVote).call();
        console.log("allowanatoz in voting " +  allowanatoz)
        if(balanceaccountvote > this.state.balanceVote ){
          if(Number(allowanatoz) > this.state.balanceVote){
            this.state.contractVote.methods.Voteting(this.state.id).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              if(confirvote == 0) {
                this.setState({showModal: true, statuspopup: true, showapproveatoz: 1, showModalvote: false, statesubmitvote: true, statesuccess: true})
              }
              confirvote = 1;
            }).on('error', (error) => {this.setState({ showapproveatoz: 1, statesubmitvote : true})})
          }else {
            tokenAtoz.methods.approve(this.state.addressVote, totalsupplyAtoz).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
              this.setState({showapproveatoz: 1})
            }).on('error', (error) => {this.setState({ showapproveatoz: 0})})
          } 
        }else{
          alert("Insufficient ATOZ balance")
          this.setState({showapproveatoz: 0})
        }
       
      }
      unstake() {
        var confirm = 0;
        this.setState({showunstake: true,statepending:true})
          this.state.contractStake.methods.unstake(this.state.addressAddpool,this.state.id, this.state.choice).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
            if(confirm ==0){
              this.setState({showModal: true, statuspopup: false, showunstake: false, statesuccess: true})
              setTimeout(this.componentDidMount() , 1000);
            }
            confirm =1;
          }).on('error', (error) => {this.setState({ showunstake: false})})
      }
      
 
    async handleChangeSelect(event) {
      const option = event.target.value;
      let choice
      if(option === "token"){
        choice = 0;
        console.log("this.state.symbol " + this.state.symbol)
        this.setState({balancepool: this.state.totalStakingtoken, symbol: this.state.symPool})
      }else if(option == "eth"){
        choice = 1;
        this.setState({balancepool: this.state.totalStakingeth, symbol: "ETH"})
      }else if(option == "usdt"){
        choice = 2;
        this.setState({balancepool: this.state.totalStakingusdt,symbol: "USDT"})
      }else if(option == "dai"){
        choice = 3;
        this.setState({balancepool: this.state.totalStakingdai,symbol: "DAI"})
      }
      this.setState({
        value: 0,
        responseDataSearch: [],
        choice,
        disableButtonunstake: true,
        stylecolor: 0.6,
        showapprove: 0,
        userPoolstake: 0,
        rewardPoolstake: 0,
        rewardUser: 0,
        withdraw: 0,
        loadingbuttonoperation: false
      })  
      await this.InfomationAccount(this.props.account, choice)
    }

    async InfomationAccount(account, choice){
      const web3 = window.web3;
      var abi = require('human-standard-token-abi')
      //Withraw
      const dataliststakers =  this.state.getStakeuser;
      let withdrawtokena = 0;
      for(var j =0; j < dataliststakers.length; j++){
        if(dataliststakers[j].contractaddress==this.state.id && dataliststakers[j].stakers == account && dataliststakers[j].token == choice && dataliststakers[j].status == "Withdraw"){
          withdrawtokena += dataliststakers[j].amount;
        }
      }
      this.setState({withdraw: withdrawtokena})
      const dataliststakeuser = await this.state.getUserstaking;
      const timelast = await this.state.contractAddpool.methods.lasttime(this.state.id).call()
      const timeinNow = Math.floor(Date.now() / 1000)
      const timecheck = (timelast > timeinNow) ? true : false;
      let timeuse;
      if(timecheck){timeuse = timeinNow;}else{timeuse = timelast;}    
      for(var i =0; i< dataliststakeuser.length; i++){
        if(dataliststakeuser[i].contractaddress==this.state.id && dataliststakeuser[i].stakers == account && dataliststakeuser[i].token == choice){
          let rewardNow =parseFloat(dataliststakeuser[i].ratiotoken * (timeuse - dataliststakeuser[i].timestake) / 60).toFixed(0);
          let rewardUsertoken = Number(dataliststakeuser[i].totalreward) + Number(rewardNow);
          let mystaking = Number(dataliststakeuser[i].totalstakeUser)   
          if(choice == 0){        
            if(mystaking>0){
                this.setState({disableButtonunstake: false, stylecolor: 1})
            }            
            this.setState({
              userPoolstake: dataliststakeuser[i].totalstakeUser  / (10**this.state.decimal),
              rewardPoolstake: dataliststakeuser[i].ratiotoken,
              rewardUser:  rewardUsertoken,
              // showapprove: approve,
              // approvetoken : allowanTOKEN
            })
          }else if(choice == 1){
            if(mystaking>0){                    
                this.setState({disableButtonunstake: false, stylecolor:1})
            }      

            this.setState({
              userPoolstake: dataliststakeuser[i].totalstakeUser  / (10**18),
              rewardPoolstake: dataliststakeuser[i].ratiotoken, 
              rewardUser: rewardUsertoken,
              // showapprove: 1,  
            })
          }else if(choice == 2){
            if(mystaking>0){                     
              this.setState({disableButtonunstake: false, stylecolor: 1})
            }        
                  
            this.setState({
              userPoolstake: dataliststakeuser[i].totalstakeUser / (10**6),
              rewardPoolstake: dataliststakeuser[i].ratiotoken, 
              rewardUser: rewardUsertoken,
              // showapprove: approve,
              // approvetoken : allowanUSDT
            })
          }else if(choice == 3){
            if(mystaking>0){
                this.setState({disableButtonunstake: false, stylecolor: 1})
            }          
                 
            this.setState({
              userPoolstake: dataliststakeuser[i].totalstakeUser / (10**18),
                rewardPoolstake: dataliststakeuser[i].ratiotoken, 
                rewardUser: rewardUsertoken,
                // showapprove: approve,
                // approvetoken : allowanDAI  
            })
          }
        }
      }
      //Infomation account and vote
      if(account != "0x00"){
        let balancetoken =0;
        let approve = 0;
        let balanceapprove = 0;
        var tokenHuman = new web3.eth.Contract(abi, this.state.id)
        var tokenUsdt = new web3.eth.Contract(abi, this.state.UsdtAddress)
        var tokenDai = new web3.eth.Contract(abi, this.state.DaiAddress)
        const balancepooltoken = await tokenHuman.methods.balanceOf(account).call()
        const balancepooleth = await web3.eth.getBalance(account);
        const balancepoolusdt = await tokenUsdt.methods.balanceOf(account).call()
        const balancepooldai =  await tokenDai.methods.balanceOf(account).call()
        if(choice ==0){
          balancetoken = balancepooltoken / (10**this.state.decimal);
          var allowanTOKEN = await tokenHuman.methods.allowance(account,this.state.addressStake).call()
          approve = (allowanTOKEN > 0) ? 1 : 0;
          balanceapprove = allowanTOKEN / (10**this.state.decimal);;
        }else if(choice ==1){
          balancetoken = balancepooleth/ (10**18);
          // this.setState({ showapprove: 1})
          approve=1;
          balanceapprove = 100000000;
        }else if(choice ==2){
          balancetoken = balancepoolusdt / (10**6);
          var allowanUSDT = await tokenUsdt.methods.allowance(account,this.state.addressStake).call()   
          approve = (allowanUSDT > 0) ? 1 : 0; 
          balanceapprove = allowanUSDT / (10**6);
        }else if(choice ==3){
          balancetoken = balancepooldai / (10**18)
          var allowanDAI = await tokenDai.methods.allowance(account,this.state.addressStake).call()   
          approve = (allowanDAI > 0) ? 1 : 0; 
          balanceapprove = allowanDAI / (10**18)
        }
        var tokenatoz = new web3.eth.Contract(abi, this.state.addressatoz)
        var allowanAtoz = await tokenatoz.methods.allowance(account,this.state.addressVote).call() 
        const approveatoz = (allowanAtoz > 10000000000000000000) ? 1 : 0;
        const loadingallowanAtoz = (allowanAtoz > 10000000000000000000) ? true : false;
        this.setState({disableButtonstake : false, stylecolorstake: 1, balancetoken, showapproveatoz: approveatoz, showapprove: approve, approvetoken : balanceapprove, loadingallowanAtoz})
      }else{
        this.setState({disableButtonstake : true, stylecolorstake: 0.6})
      }
      await this.loadbuttonoperation()
      
 
    }

    async componentDidMount() {
      console.log("Open component Dit Mount")
        const id = this.props.match.params.contract;
        this.setState({id, account : this.props.account})
        await this.loaddata()
        await this.checkcontractaddress(id)
        await this.loadresearch()       
    }
    async loadresearch(){
      const timeremaining = this.state.timelast - Math.floor(Date.now() / 1000);
      if(timeremaining > 0) {
        const searchString =10;
        const objectestimate = {};
        const dataresponseData =[]
        const totalstake = Number(this.state.balancepool)
        const mystaking = Number(this.state.userPoolstake)
        const ratiopool = Number(this.state.ratio) / (10**this.state.decimal)
        console.log("ratiopool" + ratiopool)
        const interest = 100 * (mystaking +  Number(searchString))/(totalstake +  Number(searchString));
        const reward = ratiopool * (mystaking +  Number(searchString))/(totalstake +  Number(searchString));
        const estimateratio =  reward *  Math.floor(timeremaining/60)
        objectestimate.estimate = parseFloat(estimateratio).toFixed(6);
        objectestimate.interest = parseFloat(interest).toFixed(2);
        objectestimate.reward = parseFloat(reward).toFixed(6);
        dataresponseData.push(objectestimate)
        this.setState({
          responseDataSearch: dataresponseData
        })
      }    
    }

    async componentWillReceiveProps() {
          this.setState({account: this.props.account})
          if(this.props.account != "0x00"){
            await this.InfomationAccount(this.props.account, this.state.choice)
           }   
          
          // await this.getInfoaccount(this.state.id)
          // await this.checkcontract(this.state.id)
    }
    async loadbuttonoperation(){
      this.setState({loadingbuttonoperation: true})
    }
    async checkcontractaddress(contract) {
        try{
          const hasListed = this.state.contractAddpool.methods.hasListed(contract).call()
          .catch(err => {
            window.location.replace(WEB);
          })
          console.log("hasListed")
          console.log(hasListed)
          if(hasListed){
             this.getTokeninfo(contract);
             this.getAPI(contract)
             await this.InfomationContract(contract);
             await this.InfomationTransaction(contract)
             if(this.props.account != "0x00"){
              await this.InfomationAccount(this.props.account, this.state.choice)
              // await this.props.checkconect
             }           
          }
        }catch{
          
        }
    }
   

    async InfomationTransaction(contract){
      const datastaker = []
      let count =0;
      const getStakeuser = await this.state.getStakeuser;
      console.log("getStakeuser")
      console.log(getStakeuser)
      for(var i=0; i< getStakeuser.length;i++){
        if(getStakeuser[i].contractaddress == contract){
          const dataliststakers = getStakeuser[i];
          datastaker.push(dataliststakers)
          count =1;
          // this.setState({showtransaction: true})
        }
      }
      datastaker.sort((a, b) => parseFloat(b.timeCreate) - parseFloat(a.timeCreate));
      var totalpage = (Math.floor(datastaker.length / 10) > 0) ? (((datastaker.length % 10) > 0) ? Math.floor(datastaker.length / 10) +1 : Math.floor(datastaker.length / 10))  :  1;
      var listcurrentpage = (totalpage > 1) ? datastaker.slice(0, 10) : datastaker;
      var showtransaction = (count ==1)? true : false;
      this.setState({
          datalistuserstaker: datastaker,
          totalpage, 
          listcurrentpage,
          showtransaction: showtransaction
      })
    }
    async InfomationContract(contract){
      const infoDetailpool = await this.state.contractAddpool.methods.getDetalsinfopool().call();
      for(var i =0; i< infoDetailpool.length; i++){
        if(infoDetailpool[i].contractaddress == contract){
          const hasEth = infoDetailpool[i].hasTokeneth;
          const hasUsdt = infoDetailpool[i].hasTokenusdt;
          const hasDai = infoDetailpool[i].hasTokendai;
          let totalStakingeth =0;
          let totalStakingusdt = 0;
          let totalStakingdai=0;
          if(hasEth){ totalStakingeth = await this.state.contractStake.methods.balancestakeeth(contract).call()}
          if(hasUsdt){ totalStakingusdt = await this.state.contractStake.methods.balancestakeusdt(contract).call()}
          if(hasDai){ totalStakingdai = await this.state.contractStake.methods.balancestakedai(contract).call()}
          const totalStakingtoken = await this.state.contractStake.methods.balancestaketoken(contract).call()
          const balance = await this.state.contractAddpool.methods.balance(contract).call()
          const ratio = await this.state.contractAddpool.methods.ratio(contract).call()
          const timelast = await this.state.contractAddpool.methods.lasttime(contract).call()
          let withdraw = 0;
          const timeinNow = Math.floor(Date.now() / 1000)
          if(timelast > timeinNow){
             withdraw = balance - Math.floor((timelast-timeinNow)/60)*ratio
            this.setState({checktime : true})
          }else{
             withdraw = balance;          
          }
          if(this.state.choice ==0){
            this.setState({balancepool: totalStakingtoken / (10**this.state.decimal), symbol: this.state.symPool})
          }else if(this.state.choice ==1){
            this.setState({balancepool: totalStakingeth /(10**18), symbol: "ETH"})
          }else if(this.state.choice ==2){
            this.setState({balancepool: totalStakingusdt / (10**6), symbol: "USDT"})
          }else if(this.state.choice ==3){
            this.setState({balancepool: totalStakingdai/ (10**18), symbol: "DAI"})
          }
          this.setState({
            totalStakingeth: totalStakingeth /(10**18),
            totalStakingusdt: totalStakingusdt / (10**6),
            totalStakingdai: totalStakingdai/ (10**18),
            totalStakingtoken: totalStakingtoken/ (10**this.state.decimal),
            totalreward: withdraw,
            timelast,
            ratio,
            checkcontractaddress: true,              
            
            hasEth,
            hasUsdt,
            hasDai,
            
          })
        }
      }
      
    }

    async getTokeninfo(contract) {
        try{
          const listtoken = await this.state.contractAddpool.methods.getListinfopool().call();
          const lengthstaketoken = listtoken.length;
          if(lengthstaketoken>0){
            for(var i=0; i<lengthstaketoken;i++){
              if(listtoken[i].contractaddress == contract){
                  this.setState({
                    iconPool: listtoken[i].iconPool,
                    symPool: listtoken[i].symPool,
                    namePool: listtoken[i].namePool,
                    decimal:  listtoken[i].decimal
                  })
              }
            }
          }
        }catch{}
    }
    getAPI(address){
        axios.get(BASE_URL+`crypto/${address}/status/Stake`)
         .then(res => {
            const data = res.data;
            console.log("status get")
            console.log(data)
              if(data.status ==1){
                this.setState({
                  dataweb: data.data.website,
                  datamarketcap: data.data.coinmarketcap,
                  datagecko: data.data.coingecko,
                  dataoffice: data.data.officiallink
                })
              }      
         })
         .catch(err => {
           console.log("Get False")
         })
    }
    async loaddata() {
        const web3 = window.web3; 
        const networkId = await web3.eth.net.getId()  
        const stakeToken = StakeToken.networks[networkId]
        if(stakeToken) {
          const contractStake = new web3.eth.Contract(StakeToken.abi, stakeToken.address);
          const getStakeuser = await contractStake.methods.getStakeuser().call();
          const getUserstaking = await contractStake.methods.getUserstaking().call();
          this.setState({
            contractStake,
            addressStake: stakeToken.address, 
            getStakeuser,
            getUserstaking   
          })
        } 
        const addToken = Addpool.networks[networkId]
        if(addToken) {
          const contractAddpool = new web3.eth.Contract(Addpool.abi, addToken.address)
          this.setState({
            contractAddpool,
            addressAddpool: addToken.address,         
          })
        }

        const addVote = Vote.networks[networkId]
        if(addVote){
          const contractVote = new web3.eth.Contract(Vote.abi, addVote.address)
          this.setState({
            contractVote,
            addressVote: addVote.address,         
          })
        }
    }

    prevPage(){
      if(this.state.currentpage > 1){
        console.log("this.state.currentpage")
        console.log(10*this.state.currentpage -10)
          var listcurrentpage = this.state.datalistuserstaker.slice(10*(this.state.currentpage-2), 10*(this.state.currentpage-1))
          console.log("this.state.listcurrentpage")
        console.log(this.state.listcurrentpage)
          this.setState({currentpage : this.state.currentpage -1 , listcurrentpage})
      }
    }
    nextPage(){
      if(this.state.currentpage < this.state.totalpage){
          var  listcurrentpage = this.state.datalistuserstaker.slice(10*this.state.currentpage, 10*this.state.currentpage +10)
          this.setState({currentpage : this.state.currentpage +1 , listcurrentpage})
      }
    }
    async ApproveVote(){
      const web3 = window.web3 
      var abi = require('human-standard-token-abi')
      let confirmvote =0;
      this.setState({stateapprevevote: false, statepending: true})
      var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
      var totalsupplyAtoz = await tokenAtoz.methods.totalSupply().call()
      tokenAtoz.methods.approve(this.state.addressVote, totalsupplyAtoz).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
       if(confirmvote ==0){
        this.setState({
          backgroundApproveVoteVote: "#00a8ff",
          colorApproveVoteVote: "white",
          backgroundApproveVote: "#a4b0be",
          colorApproveVote: "#dfe6e9",
          disableApproveVote: true,
          disableApproveVoteVote: false,
          stateapprevevote: true

        })
       }
        confirmvote =1;
      }).on('error', (error) => {this.setState({ showapproveatoz: 0,stateapprevevote: true})})
    }
    async Approve(){
      const web3 = window.web3 
      var abi = require('human-standard-token-abi')
      this.setState({stateapprove: false, statepending : true})
      if(this.state.choice == 0){
        let confirm=0;
        var token = new web3.eth.Contract(abi,this.state.id)
        var totalsupplytoken = await token.methods.totalSupply().call()
        token.methods.approve(this.state.addressStake, totalsupplytoken).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
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
      }else if (this.state.choice ==2){
        let confirmusdt=0;
        var tokenUsdt = new web3.eth.Contract(abi, this.state.UsdtAddress)
        var totalsupplyusdt = await tokenUsdt.methods.totalSupply().call()
        tokenUsdt.methods.approve(this.state.addressStake, totalsupplyusdt).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
          if(confirmusdt ==0){
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
          confirmusdt =1;
        }).on('error', (error) => {this.setState({ stateapprove: true})})
      }else if(this.state.choice ==3) {
        let confirmdai =0;
        var tokenDai = new web3.eth.Contract(abi, this.state.DaiAddress)
        var totalsupplydai = await tokenDai.methods.totalSupply().call()
        tokenDai.methods.approve(this.state.addressStake, totalsupplydai).send({ from: this.state.account }).on('confirmation', (confNumber, receipt) => {
          if(confirmdai ==0){
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
          confirmdai =1;
        }).on('error', (error) => {this.setState({ stateapprove: true})})
      }
    }

    async ApproveStake(){
      this.staking(Number(this.state.value))
      // console.log("Approve Stake " + this.state.value)
    }

    async ApproveStakeVote(){
      this.confirmVote()
    }
    closepending(){
      this.setState({statepending: false})
    }
    closesuccess(){
      this.setState({statesuccess: false})
    }
    render() {
      let popuppending;
      if(this.state.statepending){
        popuppending = <div class="alert alert-info alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close"
        onClick={(event) => {
          event.preventDefault()
          this.closepending()
        }}>&times;</a>
        <strong>Notice!</strong> Please kindly wait due to proceeding STAKE will take time on the Ethereum Mainnet . It takes about 1-2 minutes
      </div>
      }
      
      let popupsuccess;
      if(this.state.statesuccess){
        popupsuccess = <div class="alert alert-success alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close"
        onClick={(event) => {
          event.preventDefault()
          this.closesuccess()
        }}>&times;</a>
        <strong>Success!</strong> You can check the successful STAKING history at the bottom of the screen.
      </div>
      }
      let votebutton;
      if(this.state.showapproveatoz == 0){
        votebutton = "VOTE"
      }else if(this.state.showapproveatoz == 1){
        votebutton = "VOTE"
      }else if(this.state.showapproveatoz == 2){
        votebutton = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let unstakebutton;
      if(this.state.showunstake){
        unstakebutton = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }else{
        unstakebutton = "UN-STAKE"
      }
      let approvebutton;
      if(this.state.showapprove ==0){
        approvebutton = "STAKE"
      }else if (this.state.showapprove ==1){
        approvebutton ="STAKE"
      }else if(this.state.showapprove ==2){
        approvebutton = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      // 1 Connect Wallet
      // 2. Connect Wallet but not approve
      // 3. Coonect Wallet and approve
      let approvetextvote;
      if(this.state.stateapprevevote){
        approvetextvote = <div>1. Approve Vote</div>
      }else{
        approvetextvote = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let submitvote;
      if(this.state.statesubmitvote){
        submitvote= <div>2. Vote {this.state.symbol}</div>
      }else{
        submitvote = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let buttonoperationvote;
      if(!this.state.loadingallowanAtoz){
        buttonoperationvote = <div>
        <button  
          type="submit" 
          className="background-color-approve-approve"
          style={{backgroundColor: this.state.backgroundApproveVote, color: this.state.colorApproveVote}}
          disabled={this.state.disableApproveVote}
          onClick={(event) => {
            event.preventDefault()
            this.ApproveVote()
          }}
        >{approvetextvote}</button>
        <button
          type="submit" 
          className="background-color-approve"
          style={{backgroundColor: this.state.backgroundApproveVoteVote, color: this.state.colorApproveVoteVote}}
          disabled={this.state.disableApproveVoteVote}
          onClick={(event) => {
            event.preventDefault()
            this.ApproveStakeVote()
          }}
          >{submitvote}</button>
         </div>
      }else{
        buttonoperationvote = <div>
         <button
            type="submit"
            className="background-color"
            style={{opacity: this.state.stylecolorstake}}
            disabled={this.state.disableButtonstake}
            onClick={(event) => {
              event.preventDefault()
              this.confirmVote()
            }}>{votebutton}</button> 
        </div>
      }
      let approvetext;
      if(this.state.stateapprove){
        approvetext =  <div>1. Approve {this.state.symbol}</div>
      }else{
        approvetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let sattetext;
      if(this.state.statestake){
        sattetext =  <div>2. Stake {this.state.symbol}</div>
      }else{
        sattetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let buttonoperationstake;
      if(this.state.approvetoken <= this.state.value){
        buttonoperationstake = <div>
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
            <button
              type="submit" 
              className="background-color-approve"
              style={{backgroundColor: this.state.backgroundApproveStake, color: this.state.colorApproveStake}}
              disabled={this.state.disableApproveStake}
              onClick={(event) => {
                event.preventDefault()
                this.ApproveStake()
              }}
            >{sattetext}</button>
        </div>
      }else{      
         buttonoperationstake = <div>
         <button 
            type="submit" 
            className=" background-color"  
            disabled={this.state.disableButtonstake} 
            style={{opacity: this.state.stylecolorstake}}> {approvebutton}</button>
      </div>
      }

      let buttonoperation;      
      if(!this.props.enableSwap && this.state.loadingbuttonoperation){
         //2. Connnect Success
         buttonoperation =<div>
         <Row>
                   <Col md={4} xs={12}>
                     {buttonoperationstake}
                         {/* <button 
                           type="submit" 
                           className=" background-color"  
                           disabled={this.state.disableButtonstake} 
                           style={{opacity: this.state.stylecolorstake}}> {approvebutton}</button> */}
                   </Col>
                   <Col md={4} xs={12}>
                         <button
                           type="submit"
                           className="background-color"
                           style={{opacity: this.state.stylecolor}}
                           disabled={this.state.disableButtonunstake}
                           onClick={(event) => {
                             event.preventDefault()
                             this.unstake()
                           }}>{unstakebutton}</button>
                   </Col>
                   <Col md={4} xs={12}>
                           {buttonoperationvote}
                         {/* <button
                           type="submit"
                           className="background-color"
                           style={{opacity: this.state.stylecolorstake}}
                           disabled={this.state.disableButtonstake}
                           onClick={(event) => {
                             event.preventDefault()
                             this.confirmVote()
                           }}>{votebutton}</button> */}
                   </Col>
                 </Row>
       </div>
        
      }else if(!this.props.enableSwap && !this.state.loadingbuttonoperation){
        buttonoperation = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader-connect"></div>
        </div>
      }else if(this.props.enableSwap){
       //1. Connect Wallet
       buttonoperation = <div style={{textAlign: "center"}}>
       <button 
         className="button-connect"
         onClick={(event) => {
           event.preventDefault()
           this.props.checkconect()
         }}>Connect Wallet
       </button>
        </div> 
      // buttonoperation = <div style={{marginLeft: "auto", marginRight: "auto"}}>
      // <div class="loader"></div>
      // </div>
      }
      
      let web;
      if(this.state.dataweb != ""){
        web = <p className="p-infomation">Website: <a href={this.state.dataweb} target="_blank">{this.state.dataweb}</a></p>
      }
      let coinmarketcap;
      if(this.state.datamarketcap != ""){
        coinmarketcap = <p className="p-infomation">Coinmarketcap: <a href={this.state.datamarketcap} target="_blank">{this.state.datamarketcap}</a></p>
      }
      let coingecko;
      if(this.state.datagecko != ""){
        coingecko = <p className="p-infomation">Coingecko: <a href={this.state.datagecko} target="_blank">{this.state.datagecko}</a></p>
      }
      let exchange1;
      if(this.state.dataoffice != ""){
        exchange1 = <p className="p-infomation">Official Link: <a href={this.state.dataoffice} target="_blank">{this.state.dataoffice}</a></p>
      }
      let statusstake;
      if(this.state.statuspopup){
        statusstake= <p>Stake Successful</p>
      }else{
        statusstake= <p>Unstake Successful</p>
      }
        let listdataStake;
        if(this.state.showtransaction){
          listdataStake = this.state.listcurrentpage.map((staker) => {
            var dateNow = '';
            const distance = Math.floor(Date.now() / 1000) - staker.timeCreate;
            const day = Math.floor(distance/86400);
            if(day > 0) {
               dateNow = day.toString() + " day ago";
            } else {
              const hour = Math.floor(distance/3600);
              if(hour > 0) {
                 dateNow = hour.toString() + " hour ago";
              }else{
                const minutes = Math.floor(distance/60);
                if(minutes > 0) {
                  dateNow = minutes.toString() + " minutes ago"
                }else{
                   dateNow = distance.toString() + " second ago";
                }
              }          
            }
            var amount = ''
            if(staker.status == "Stake"){
              if(staker.token == 0){
                // TOKEN
                amount = (staker.amount/(10**this.state.decimal)).toString() + " " + this.state.symPool.toString()
              }else if(staker.token == 1){
                // ETH
                amount = (staker.amount/(10**18)).toString() + " ETH"
              }else if(staker.token == 2){
                // USDT
                amount = (staker.amount/(10**6)).toString() + " USDT"
              }else if(staker.token == 3){
                // DAI
                amount = (staker.amount/(10**18)).toString() + " DAI"
              }
            }else if(staker.status == "Withdraw"){
              amount = ((staker.amount/(10**this.state.decimal)).toString()).substring(0,8) + " " + this.state.symPool.toString()
            }


            return(
              <div class="main-allstakers address-network">
                <Row>
                  <Col md={6}><a href={NETWORK_ETH+'address/' + staker.stakers} target="_blank" >{staker.stakers}</a></Col>
                  <Col md={2}>{amount}</Col>
                  <Col md={2}>{staker.status}</Col>
                  <Col md={2}>{dateNow}</Col>
                </Row>
              </div>
            )
          })
        } else {
          listdataStake = <p className="text-center"> No history</p>
        }
        let itemeth;
        let itemdai;
        let itemusdt;
        let totalMethod = this.state.symPool;
        if(this.state.hasEth){
          totalMethod += " ,ETH " 
          itemeth = <option className="color-option" value="eth">ETH</option>
        }
        if(this.state.hasUsdt){
          totalMethod += " ,USDT " 
            itemusdt = <option className="color-option" value="usdt">USDT</option>
        }
        if(this.state.hasDai){
          totalMethod += " ,DAI " 
            itemdai =  <option className="color-option" value="dai">DAI</option>
        }

        let showStakedetail;
        if(this.state.checkcontractaddress){
            showStakedetail =   <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '750px' }}>
                <div className="content mr-auto ml-auto form-createstake">
                  <div class="h3-register">
                    <img src={this.state.iconPool} width="50px" height="50px" />
                    <h3 >{this.state.namePool}</h3>
                </div>
                <div className=" form-contract">
               <form className="mb-3" onSubmit={this.handleSubmit}>
              <div>
               
                <label className="float-left"><b>Stake Methods: </b>{totalMethod}</label>
                <span className="float-right text-muted" style={{color: "#29a7df"}}>
                    Amount: {this.state.balancetoken}
                </span>

                {/* Start Radio */}
                {/* <div class="radio-toolbar">
                    <input type="radio" id="radioApple" name="radioFruit" value="apple" checked />
                    <label for="radioApple">Apple</label>

                    <input type="radio" id="radioBanana" name="radioFruit" value="banana"/>
                    <label for="radioBanana">Banana</label>

                    <input type="radio" id="radioOrange" name="radioFruit" value="orange"/>
                    <label for="radioOrange">Orange</label> 
                </div> */}
                {/* End Radio */}
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <input
                  type="number" 
                  value={this.state.value} 
                  onChange={this.handleChange}
                  className="input-stake"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-choice-stake ">
                    {/* <img src={this.state.icon} height='32' width='auto' alt=""/>
                    &nbsp;&nbsp;&nbsp; {this.state.symbol} */}
                    <select id="choicecrypto" className="select-token"  onChange={this.handleChangeSelect}>
                        <option className="color-option" value="token">{this.state.symPool}</option>
                        {itemeth}
                        {itemusdt}
                        {itemdai}                                        
                    </select>
                  </div>
                </div>
              </div>

               {/* Search Bar */}
               <div class="main-search-estimate">
                            {
                            this.state.responseDataSearch.map((i) => 
                                {
                                return(
                                    <div>
                                    <p className="color-search">Interest Coefficent: {i.interest} %</p>
                                    <p className="color-search">Reward: {i.reward} {this.state.symPool}/ Minute</p>
                                    <p className="color-search">Estimated Reward: {i.estimate} {this.state.symPool}</p>
                                    <p className="color-search">*Notice: Estimated Reward is assumed quantity at your staking time and may change due to fluctuation of total staking quantity   </p>
                                    </div>
                                )
                                }
                            )
                            }
                </div>
                {/* Edn Search Bar */}
             
                <div class="margin-button-details">
                            {buttonoperation}
                  {/* <Row>
                    <Col md={4} xs={12}>
                          <button 
                            type="submit" 
                            className=" background-color"  
                            disabled={this.state.disableButtonstake} 
                            style={{opacity: this.state.stylecolorstake}}> {approvebutton}</button>
                    </Col>
                    <Col md={4} xs={12}>
                          <button
                            type="submit"
                            className="background-color"
                            style={{opacity: this.state.stylecolor}}
                            disabled={this.state.disableButtonunstake}
                            onClick={(event) => {
                              event.preventDefault()
                              this.unstake()
                            }}>{unstakebutton}</button>
                    </Col>
                    <Col md={4} xs={12}>
                          <button
                            type="submit"
                            className="background-color"
                            style={{opacity: this.state.stylecolorstake}}
                            disabled={this.state.disableButtonstake}
                            onClick={(event) => {
                              event.preventDefault()
                              this.confirmVote()
                            }}>{votebutton}</button>
                    </Col>
                  </Row> */}
              
               </div>
            </form>
            
            {/* End form */}
            {/* Alert Popup */}
            <div>
              {popuppending}
              {popupsuccess}
            </div>
            <div> 
                  <div className="detalpool">Total Staking   <span className="details-infomation-user">{(this.state.balancepool).toFixed(4)}</span> {this.state.symbol} </div>
                  <div className="detalpool">My Staking  <span className="details-infomation-user">{(this.state.userPoolstake).toFixed(4)} </span>  {this.state.symbol} </div>
                  <div className="detalpool">My Reward  <span className="details-infomation-user">{(this.state.rewardUser / (10**this.state.decimal)).toFixed(4)}</span> {this.state.symPool}</div>                     
              {/* <p className="detail-p"><b>Total User Status</b></p>
              <Row>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Total Staking </p>
                  <p className="fontsize20"><b>{(this.state.balancepool).toFixed(4)}</b></p>
                  <p className="symbol"><b>{this.state.symbol}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Paid Reward</p>
                    <p className="fontsize20"><b>{(this.state.totalreward / (10**this.state.decimal)).toFixed(4)}</b> </p>
                    <p className="symbol"><b>{this.state.symPool}</b></p>
                    </div>
                </Col>
                </Row>
                <p className="detail-p"><b>My Staking Status</b></p>
                <Row>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Staking </p>
                       <p className="fontsize20"><b>{(this.state.userPoolstake).toFixed(4)}</b></p>
                       <p className="symbol"><b>{this.state.symbol}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Interest</p>
                  <p className="fontsize20"><b>{(this.state.rewardPoolstake / (10**this.state.decimal)).toFixed(4)}</b> </p>
                  <p className="symbol"><b>{this.state.symPool}/Minutes</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Reward </p>
                      <p className="fontsize20"><b>{(this.state.rewardUser / (10**this.state.decimal)).toFixed(4)}</b></p>
                      <p className="symbol"><b>{this.state.symPool}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Withdraw </p>
                      <p className="fontsize20"><b>{(this.state.withdraw / (10**this.state.decimal)).toFixed(4)}</b></p>
                      <p className="symbol"><b>{this.state.symPool}</b></p>
                    </div>
                </Col>                
              </Row> */}

              <p className="detail-p"><b>Token Information</b></p>
                    {web}
                  {coinmarketcap}
                  {coingecko}
                  {exchange1}
                  {/* {exchange2}
                  {exchange3}
                  {exchange4} */}
            </div>
            </div> 
                </div>
                </main>
            </div> 
                   <div className="liststakers">
                      <h4>Staking History</h4>
                      <div className="allstakers">
                          <div className="allstakersheader">
                          <Row>
                            <Col md={6}><b>Address</b></Col>
                            <Col md={2}><b>Amount</b></Col>
                            <Col md={2}><b>Status</b></Col>
                            <Col md={2}><b>Time</b></Col>
                          </Row>
                          </div>
                          <div >
                              {listdataStake}                          
                          </div>
                      </div>                   
                    </div>
            </div>
        }else{
          showStakedetail = <div className="div-image-loading">
          <img src="https://bcoders.org/public/image/unistakes.png" className="image-loading"/>
         </div>
        }
        return(
            <>
            <Modal show={this.state.showModalpopup} onHide={this.closepopup} >
              <div class="modal-show-wallet">
              <h3>Token Safety Alert</h3>
Anyone can create and name any ERC20 token on Ethereum, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token. Similar to Etherscan, this site automatically tracks analytics for all ERC20 tokens independent of token integrity. Please do your own research before interacting with any ERC20 token.
              <a href={NETWORK_ETH+'token/' + this.state.id} target="_blank">View token contract on Etherscan</a>
              <button class="button-success" onClick={this.closepopup}>I understand</button>
              </div>
              
            </Modal>

            {/* Vote */}
            <Modal show={this.state.showModalvote} onHide={this.closevote} >
              <div class="modal-show-wallet">
              <h3>Confirm Vote</h3>
              <div className="p-vote">
              <p >Pool farm is arranged according to the number of votes. Each of your votes will help your favorite pool get to the TOP position.
Each vote will use 10 ATOZ</p>
             <p>My balance Atoz: {this.state.balanceatoz} ATOZ</p>
             </div>
              <button class="background-color-vote"
              disabled={this.state.disableButtonvote}
               onClick={(event) => {
                event.preventDefault()
                this.voteting()
              }}>{votebutton}</button>
              </div>              
            </Modal>

            <Modal show={this.state.showModal} onHide={this.close} >
              <div class="modal-show">
                    <svg width="7em" height="7em" viewBox="0 0 16 16" class="bi bi-check-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                  </svg>
                   {/* <p className="p-success">{statusstake}</p> */}
                   <p className="p-success">Success</p> 
                  <br></br>
                  <button class="button-success" onClick={this.close}>OK</button>
                  {/* <p>SUCCESS</p> */}
              </div>
            </Modal>
            <div>
              <div class="main">
                  {showStakedetail}               
              </div>
              <table className="ulprevandnext">
                  <tr>
                    {/* <th><button >Prev</button></th>
                    <th><button >Next</button></th> */}
                    <th className="arrow-page"
                    onClick={(event) => {
                      event.preventDefault()
                      this.prevPage()
                    }}>
                      <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-left-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                      </svg>
                    </th>
                  <th>{this.state.currentpage} / {this.state.totalpage}</th>
                    <th className="arrow-page"
                    onClick={(event) => {
                      event.preventDefault()
                      this.nextPage()
                    }}>
                      <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-arrow-right-short" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                      </svg>
                    </th>
                  </tr>
            </table>
              <Footer/>
            </div>
            </>
        )
    }
}

export default withRouter(StakedetailNew)