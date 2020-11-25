import React, {Component} from 'react';
import ethnew from '../assets/eth-logo.png'
import { Modal, Col, Row} from 'react-bootstrap';
import logoWhite from '../assets/logo-white.png'
import Web3 from 'web3'
import Footer from '../components/Footer'
import ATOZPool from '../abis/AtozPool.json'
import {NETWORK_ETH, WALLET_ATOZ, INFURA} from '../constants' 
export default class Atozpool extends Component{
    constructor(props) {
        super(props)
        this.state = { 
            checkcontractaddress: true,
            value: '',
            balancepool: 1000000000000000000000000,
            totalpoolATOZ: 0,
            disableButtonstake: true,
            responseDataSearch: [],
            stylecolorstake: 0.6,
            disableButtonunstake: true,
            stylecolor:0.6,
            addressAtozpool: '', 
            liststake: false,
            addressatoz : WALLET_ATOZ, //Ganache
            showapprove: 1,
            symbol: 'ATOZ',
            amounttoken: 0,
            totalstaketoken: 0,
            paidrewardtoken: 0,
            mystaketoken: 0,
            interesttoken: 0,
            myrewardtoken: 0,
            mywithdrawtoken: 0,
            getUserstaking: [],
            showunstake: false,   
            contractAtozpool: {},
            totalstaking: [],
            currentpage: 1,
            totalpage: 1,
            listcurrentpage: 0,
            allowanATOZ:0,
            backgroundApprove: "#00a8ff",
            colorApprove: "white",
            backgroundApproveStake: "#a4b0be",
            colorApproveStake: "#dfe6e9",
            disableApprove: false,
            disableApproveStake: true,
            stateapprove: true,
            statestake: true
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
  }
  close() {
    this.setState({ showModal: false });
  }
  handleChange(event) {
    const re = /^[0-9\b\.]+$/;
      if (event.target.value === '' || re.test(event.target.value)) {
        this.setState({value: event.target.value},
          () => {
            const checktimelast = 1610702217 - Math.floor(Date.now() / 1000);
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
      const web3 = window.web3;
      const totalstake = Number(this.state.totalstaketoken)
      const mystaking = Number(this.state.mystaketoken)
      const ratiototal = (this.convert(this.state.ratio)).toString()
      const ratiopool = web3.utils.fromWei(ratiototal, 'ether')
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
  handleSubmit(event) {
    event.preventDefault()
    this.staking(this.state.value)
  }
  async staking(amount){
    console.log("this.state.amounttoken " + this.state.amounttoken)
    if(Number(amount) < Number(this.state.amounttoken)){
      const web3 = window.web3;
      this.setState({showapprove: 2, statestake: false})
      let  balance = web3.utils.toWei(amount.toString(), 'ether')
      var abi = require('human-standard-token-abi')
      var token = new web3.eth.Contract(abi,this.state.addressatoz)
      const allowantoken = await token.methods.allowance(this.props.account,this.state.addressAtozpool).call();
      var confirm = 0;
        if(Number(allowantoken) > Number(balance)){
          this.state.contractAtozpool.methods.stake(balance).send({from: this.props.account}).on('confirmation', (confNumber, receipt)=> {       
            if(confirm ==0){
              this.setState({showModal: true,  showapprove: 1, statestake: true})  
              setTimeout(this.componentDidMount() , 1000);
            }        
            confirm =1;   
          }).on('error', (error) => {this.setState({ showapprove: 1, statestake: true})})
        }else{
          var totalsupplytoken = await token.methods.totalSupply().call()
          token.methods.approve(this.state.addressAtozpool, totalsupplytoken).send({ from: this.props.account }).on('confirmation', (confNumber, receipt) => {
            this.setState({showapprove: 1})
          }).on('error', (error) => {this.setState({ showapprove: 1})})
        }
    }else{
      alert("Your balance is not enough to stake")
    }   
    
  }
  unstake() {
    this.setState({showunstake: true})
    var confirm = 0;
    this.state.contractAtozpool.methods.unstake().send({ from: this.props.account }).on('confirmation', (confNumber, receipt) => {
        if(confirm ==0){
          this.setState({showModal: true, showunstake: false, disableButtonunstake: true, stylecolor: 0.6})
          setTimeout(this.componentDidMount() , 1000);
        }      
        confirm =1;  
      }).on('error', (error) => {this.setState({ showunstake: false})})
  }
  async componentDidMount(){
      // await this.loadWeb3()
      await this.loaddata()
      await this.loadInfouser(this.props.account)     
  }

    async componentWillReceiveProps(){      
      await this.loadInfouser(this.props.account)      
    }

    async loadInfouser(account){
      const getUserstaking = this.state.getUserstaking;
      
      const totalstaking = this.state.totalstaking;
      const web3 = window.web3; 
      var abi = require('human-standard-token-abi')
      var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
      
      if(account != "0x00"){
        var allowanATOZ = await tokenAtoz.methods.allowance(account,this.state.addressAtozpool).call()
        let balanceATOZ = await tokenAtoz.methods.balanceOf(account).call()
        var showtoken = (allowanATOZ > 0) ? 1 : 0;
        const amounttoken =  web3.utils.fromWei(balanceATOZ.toString(), 'ether')
        this.setState({disableButtonstake: false, stylecolorstake: 1, showapprove: showtoken, amounttoken, allowanATOZ : allowanATOZ / (10**18)})
      }  
      for(var i =0; i < getUserstaking.length; i++){
        if(getUserstaking[i].stakers == account){
          const mystake = (this.convert(getUserstaking[i].totalstakeUser)).toString()
          const mystaketoken =web3.utils.fromWei(mystake, 'ether');
          (mystaketoken > 0) ? this.setState({disableButtonunstake: false, stylecolor: 1}) : this.setState({disableButtonunstake: true, stylecolor: 0.6})
          const interesttoken = web3.utils.fromWei((getUserstaking[i].ratiotoken).toString(), 'ether');
          const timenow = ((Math.floor(Date.now() / 1000)) < 1610702217) ? (Math.floor(Date.now()/1000)) : 1610702217;
          const reward =  Math.floor(getUserstaking[i].ratiotoken*(timenow - getUserstaking[i].timestake) / 60)
          const Myreward = (this.convert(Number(getUserstaking[i].totalreward) + Number(reward))).toString()
          const myrewardtoken = web3.utils.fromWei(Myreward, 'ether');
          this.setState({ mystaketoken, interesttoken, myrewardtoken })
        }
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

    async loaddata() {
      const web3 = window.web3; 
      const networkId = await web3.eth.net.getId() 
      const atozPooltoken = ATOZPool.networks[networkId]
      if(atozPooltoken){
        const contractAtozpool = new web3.eth.Contract(ATOZPool.abi, atozPooltoken.address)
        const totalpoolAtoz = await contractAtozpool.methods.totalpoolAtoz().call()
        const totalpoolATOZ = (this.convert(totalpoolAtoz)).toString()
        const totalstaketoken = web3.utils.fromWei(totalpoolATOZ, 'ether')
        const totalstaking = await contractAtozpool.methods.getStakeuser().call()  
        const ratio = await contractAtozpool.methods.ratioadd().call()
        const paidreward = ((Math.floor(Date.now() / 1000)) < 1610702217) ? this.state.balancepool - Number(ratio)*(1610702217 - Number(Math.floor(Date.now() / 1000)))/60 : this.state.balancepool;
        const PAIDREWARD = (this.convert(paidreward)).toString()
        console.log("Address ATOZ pool:" + atozPooltoken.address)
        if(totalstaking.length > 0){
          totalstaking.sort((a, b) => parseFloat(b.timeCreate) - parseFloat(a.timeCreate));
          var totalpage = (Math.floor(totalstaking.length / 10) > 0) ? (((totalstaking.length % 10) > 0) ? Math.floor(totalstaking.length / 10) +1 : Math.floor(totalstaking.length / 10))  :  1;
          var listcurrentpage = (totalpage > 1) ? totalstaking.slice(0, 10) : totalstaking;
          this.setState({liststake: true, totalpage, listcurrentpage})
          // this.setState({liststake: true})
        }
        const getUserstaking = await contractAtozpool.methods.getUserstaking().call();
        
        this.setState({contractAtozpool , ratio, addressAtozpool : atozPooltoken.address, totalstaketoken, getUserstaking, totalstaking, paidrewardtoken: web3.utils.fromWei(PAIDREWARD, 'ether')})
      }
    }
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await this.loaddata()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        await this.loaddata()
      }
      else {
        // window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        const infura = INFURA;
        window.web3 = new Web3(new Web3.providers.HttpProvider(infura));
        await this.loadBlockchainData()
      }
    }    

    prevPage(){
      if(this.state.currentpage > 1){
        console.log("this.state.currentpage")
        console.log(10*this.state.currentpage -10)
          var listcurrentpage = this.state.totalstaking.slice(10*(this.state.currentpage-2), 10*(this.state.currentpage-1))
          console.log("this.state.listcurrentpage")
        console.log(this.state.listcurrentpage)
          this.setState({currentpage : this.state.currentpage -1 , listcurrentpage})
      }
    }
    nextPage(){
      if(this.state.currentpage < this.state.totalpage){
          var  listcurrentpage = this.state.totalstaking.slice(10*this.state.currentpage, 10*this.state.currentpage +10)
          this.setState({currentpage : this.state.currentpage +1 , listcurrentpage})
      }
    }
    async Approve(){
      const web3 = window.web3; 
      let confirm =0;
      var abi = require('human-standard-token-abi')
      this.setState({stateapprove: false})
      var tokenAtoz = new web3.eth.Contract(abi, this.state.addressatoz)
      var totalsupplytoken = await tokenAtoz.methods.totalSupply().call()
      tokenAtoz.methods.approve(this.state.addressAtozpool, totalsupplytoken).send({ from: this.props.account }).on('confirmation', (confNumber, receipt) => {
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
      this.staking(this.state.value)
    }

    render(){
      let unstakebutton;
      if(this.state.showunstake){
        unstakebutton = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }else{
        unstakebutton = "UN-STAKE"
      }
      let listdataStake;
        if(this.state.liststake){
          listdataStake = this.state.listcurrentpage.map((staker) => {
            var dateNow = '';
            const distance = Math.floor(Date.now() / 1000) - staker.timeCreate;
            const day = Math.floor(distance/86400);
            if(day > 0) {
              var dateNow = day.toString() + " day ago";
            } else {
              const hour = Math.floor(distance/3600);
              if(hour > 0) {
                var dateNow = hour.toString() + " hour ago";
              }else{
                const minutes = Math.floor(distance/60);
                if(minutes > 0) {
                 var dateNow = minutes.toString() + " minutes ago"
                }else{
                  var dateNow = distance.toString() + " second ago";
                }
              }          
            }
            const web3 = window.web3; 
            let amountuser = ''
            const amount = (this.convert(staker.amount)).toString()
            amountuser = parseFloat(web3.utils.fromWei(amount, 'ether')).toFixed(6) + " ATOZ";
            return(
              <div class="main-allstakers">
                <Row>
                  <Col md={6}><a href={NETWORK_ETH + 'address/' + staker.stakers} target="_blank">{staker.stakers}</a></Col>
                  <Col md={2}>{amountuser}</Col>
                  <Col md={2}>{staker.status}</Col>
                  <Col md={2}>{dateNow}</Col>
                </Row>
              </div>
            )
          })
        } else {
          listdataStake = <p className="text-center"> No history</p>
        }

      let approvebutton;
      if(this.state.showapprove ==0){
        approvebutton = "SUBMIT STAKE"
      }else if (this.state.showapprove ==1){
        approvebutton ="STAKE"
      }else if(this.state.showapprove ==2){
        approvebutton = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let approvetext;
      if(this.state.stateapprove){
        approvetext =  <div>1. Approve ATOZ</div>
      }else{
        approvetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let sattetext;
      if(this.state.statestake){
        sattetext =  <div>2. Stake ATOZ</div>
      }else{
        sattetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader"></div>
        </div>
      }
      let buttonoperationstake;
      if(this.state.allowanATOZ > this.state.value){
        buttonoperationstake= <div><button type="submit" className=" background-color"  disabled={this.state.disableButtonstake} style={{opacity: this.state.stylecolorstake}}>{approvebutton}</button> </div>  
      }else{
        buttonoperationstake= <div>
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
      }
      let buttonopetion;
      if(!this.props.enableSwap){
              buttonopetion = <div>
                  <Row>
                    <Col md={6}>
                      {buttonoperationstake}
              
                    </Col>
                    <Col>
                      <button
                        type="submit"
                        className="background-color"
                        style={{opacity: this.state.stylecolor}}
                        disabled={this.state.disableButtonunstake}
                        onClick={(event) => {
                          event.preventDefault()
                          this.unstake()
                        }}
                        >
                          {unstakebutton}
                      </button>
                    </Col>
                    
                  </Row>
              </div>
      }else{
        buttonopetion = <div>
           <button 
         className="button-connect"
         onClick={(event) => {
           event.preventDefault()
           this.props.checkconect()
         }}>Connect Wallet
       </button>
        </div>
      }
        let showStakedetail;
        if(this.state.checkcontractaddress){
            showStakedetail =   <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '750px' }}>
                <div className="content mr-auto ml-auto form-createstake">
                  <div class="h3-register">
                    <img src={logoWhite} width="auto" height="50px" />
                    <h3 >{this.state.namePool}</h3>
                </div>
                <div className=" form-contract">
               <form className="mb-3" onSubmit={this.handleSubmit}>
              <div>
               
                <label className="float-left"><b>Stake Token</b></label>
                <span className="float-right text-muted" style={{color: "#29a7df"}}>
                     Available Staking Amount: {parseFloat(this.state.amounttoken).toFixed(6)}
                </span>
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
                  <div className="input-choice-stake"> 
                    <img src={logoWhite} height='32' width='auto' alt=""/>
                    &nbsp;&nbsp;&nbsp; ATOZ
                    {/* <select id="choicecrypto" className="select-token"  onChange={this.handleChangeSelect}>
                        <option value="eth">ETH</option>
                        <option value="usdt">USDT</option>                             
                    </select> */}
                   
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
                                    <p className="color-search">Reward: {i.reward} ATOZ/ Minute</p>
                                    <p className="color-search">Estimated Reward: {i.estimate} ATOZ</p>
                                    <p className="color-search">*Notice: Estimated Reward is assumed quantity at your staking time and may change due to fluctuation of total staking quantity   </p>
                                    </div>
                                )
                                }
                            )
                            }
                </div>
                {/* Edn Search Bar */}
             
                <div class="margin-button-details" style={{textAlign: "center"}}>
                    {buttonopetion}
                
              
               </div>
            </form>
            
            {/* End form */}
            <div>
                  <div className="detalpool">Total Staking   <span className="details-infomation-user">{parseFloat(this.state.totalstaketoken).toFixed(4)}</span> {this.state.symbol} </div>
                  <div className="detalpool">My Staking   <span className="details-infomation-user">{parseFloat(this.state.mystaketoken).toFixed(4)}</span>{this.state.symbol} </div>
                  <div className="detalpool">My Reward   <span className="details-infomation-user">{parseFloat(this.state.myrewardtoken).toFixed(6)}</span>ATOZ  </div>
              {/* <p className="detail-p"><b>Total User Status</b></p>
              <Row>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Total Staking </p>
                <p className="fontsize20"><b>{parseFloat(this.state.totalstaketoken).toFixed(6)}</b></p>
                <p className="symbol"><b>{this.state.symbol}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Paid Reward</p>
                <p className="fontsize20"><b>{parseFloat(this.state.paidrewardtoken).toFixed(6)}</b> </p>
                    <p className="symbol"><b>ATOZ</b></p>
                    </div>
                </Col>
                </Row>
                <p className="detail-p"><b>My Staking Status</b></p>
                <Row>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Staking </p>
                <p className="fontsize20"><b>{parseFloat(this.state.mystaketoken).toFixed(6)}</b></p>
                       <p className="symbol"><b>{this.state.symbol}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Interest</p>
                <p className="fontsize20"><b>{parseFloat(this.state.interesttoken).toFixed(6)}</b> </p>
                  <p className="symbol"><b>ATOZ/Minutes</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Reward </p>
                <p className="fontsize20"><b>{parseFloat(this.state.myrewardtoken).toFixed(6)}</b></p>
                      <p className="symbol"><b>ATOZ</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Withdraw </p>
                <p className="fontsize20"><b>{parseFloat(this.state.mywithdrawtoken).toFixed(6)}</b></p>
                      <p className="symbol"><b>ATOZ</b></p>
                    </div>
                </Col>                
              </Row> */}
              
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