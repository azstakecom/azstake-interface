import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Form, Row, Col} from 'react-bootstrap';
import Footer from '../components/Footer'
import axios from 'axios';
import QRCode from 'qrcode.react';
import user from '../assets/user.png'
import Web3 from 'web3'
import {BASE_URL, WEB} from '../constants'
class Pool extends Component{
    constructor(props) {
        super(props)
        this.state = {
            id:'',
            account: '',
            checkcontractaddress: true,
            disableButtonunstake: true,
            stylecolor: 0.6,
            checkwallet: 0,
            walletbtc:'',
            inputwallet: '',
            disableButtonstake: true,
            stylecolorstake: 0.6,
            walletreceive: '', 
            showModal: false,
            value:0,
            checktransaction: false,
            responseDataSearch:[],
            txhash: '',
            showAssetinfo: false,
            logo: '',
            symbol: '',
            name:'',
            info:'',
            third:'',
            startday:'',
            endday:'',
            withdrawday:'',
            redemption: '',
            interest: '',
            stakingtime: '',
            idcoin: '',
            thirdparty: '',
            user: '',
            totalbalancestake: 0,
            totalbalanceuser: 0,
            totalbalancereward: 0,
            remainingday: '',
            minimumamount: '',
            blockaccount: false,
            totalstaker: 0, 
            poolout: false,
            currentpage: 1,
            totalpage: 1,
            listcurrentpage: 0,
            showModalpopup: true,
            statesuccess: false,
            infothird: '',
            showModalthird: false
        }
        this.myDivToFocus = React.createRef()
        this.handleChangewallet = this.handleChangewallet.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.close = this.close.bind(this);
        this.closepopup = this.closepopup.bind(this);
        this.closeasset = this.closeasset.bind(this);
        this.closeblock = this.closeblock.bind(this);
        this.copywallet = this.copywallet.bind(this);
        this.copyamount = this.copyamount.bind(this);
        this.process = this.process.bind(this);
        this.loginmetamask = this.loginmetamask.bind(this); 
        // this.handleChangtxhash = this.handleChangtxhash.bind(this);   
        this.showasset = this.showasset.bind(this);
        this.closethird = this.closethird.bind(this);
    }
    closethird() {this.setState({ showModalthird: false });}
    closeasset() {this.setState({ showAssetinfo: false });}
    close() {this.setState({ showModal: false });}
    closeblock() {this.setState({ showBlock: false });}
    closepopup() {this.setState({ showModalpopup: false });}
    copywallet =() => {
        const input = document.getElementById('showqrwallet');
        input.focus();
        input.select();
        document.execCommand("copy");
        alert("Copy success");
    }
    copyamount() {
        // alert("copy ")
         // alert("Copy thanh cong")
         var copyText = document.getElementById("showqramount");
         /* Select the text field */
         copyText.select();
         copyText.setSelectionRange(0, 99999); /*For mobile devices*/
 
         /* Copy the text inside the text field */
         document.execCommand("copy");
 
         /* Alert the copied text */
         alert("Copy success");
    }
    handleChange(event) { 
        const re = /^[0-9\b\.]+$/;
      if (event.target.value === '' || re.test(event.target.value)) {
        this.setState({value: event.target.value},  () => {this.filerArray();} )
      }
    }

    handleSubmit(event) {
        event.preventDefault()
       if(this.state.blockaccount){return alert("Account block")}
       if(this.state.poolout){return alert("Pool Out")}
       if(this.state.value >= this.state.minimumamount){
                this.staking(Number(this.state.value))
        }else{
                alert(`Please enter the amount greater than ${this.state.minimumamount} ${this.state.symbol}`)
        }
        
   }
   staking(){
    this.setState({showModal: true})
    }


    handleChangewallet(event) { this.setState({inputwallet: event.target.value});}
    filerArray(){
        let searchString = this.state.value;
        const objectestimate ={};
        const dataresponseData=[]
        if(this.state.value == "") {
          this.setState({
            responseDataSearch: []
          })
        }
        if(searchString.length > 0){
            const ratiopool = Number(this.state.ratio) / (10**this.state.decimal)
            console.log("ratiopool" + ratiopool)
            // const interest = 100 * (mystaking +  Number(searchString))/(totalstake +  Number(searchString));
            const interest = 100;
            // const reward = ratiopool * (mystaking +  Number(searchString))/(totalstake +  Number(searchString));
            const reward = Number(searchString)*Number(this.state.interest)/(100*365);
            // const estimateratio =  reward *  Math.floor(timeremaining/60)
            const estimateratio = reward * Number(this.state.stakingtime);
            objectestimate.estimate = parseFloat(estimateratio).toFixed(6);
            objectestimate.interest = parseFloat(interest).toFixed(2);
            objectestimate.reward = parseFloat(reward).toFixed(6);
            dataresponseData.push(objectestimate)
            
            this.setState({
              responseDataSearch: dataresponseData
            })
            
          }
    }


    async componentDidMount() {
        const id = this.props.match.params.poolid;
        this.setState({id})
        await this.checkidpool(id)
        await this.getbalancepool(id)
        const account = this.props.account
        console.log("account  : " + account)
        this.setState({account})
        if(account != "0x00"){
            await this.getStatus(account)
           await this.getInfoaddress(account)
            await this.getTransaction()
        }       
    }
 
    async getStatus(id){
        // alert("1")
        await axios.get(BASE_URL+`status/${id}`)
        .then(res => {
            const status = res.data.status;
            if(status == 0){
                this.setState({
                    blockaccount: true,
                    showBlock: true
                })
            }
        })
    }

    async getbalancepool(id){
        axios.get(BASE_URL+`getotalstake/${id}`)
        .then(res => {
            this.setState({
                totalbalancestake: res.data.totalstake
            })
        })

        axios.get(BASE_URL+`getotalreward/${id}`)
        .then(res => {
            this.setState({
                totalbalancereward: res.data.totalreward
            })
        })

        axios.get(BASE_URL+`totalstaker/${id}`)
        .then(res => {
            console.log("Total Stake ")
            console.log(res.data.totalstaker)
            this.setState({
                totalstaker: res.data.totalstaker
            })
        })

    }

    async checkidpool(idnumber){
        axios.get(BASE_URL+`pool/${idnumber}`)
        .then(res => {
            const id = res.data.id;
            if(id == undefined){
                window.location.replace(WEB);
            }else{
                const idcoin = res.data.coin;
                this.setState({idcoin})
                axios.get(BASE_URL+`coin/${idcoin}`)
                    .then(res => {
                        const logo = res.data.logo;
                        console.log("logo pool:" + logo)
                        const symbol = res.data.symbol;
                        const name = res.data.name;
                        const info = res.data.info;                  
                        console.log("Info")
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(info, 'text/html');
                        console.log(doc)
                        this.setState({logo, symbol, name, info})
                       
                    })
                    .catch(err => { console.log("Error call info coin " + err)})
                const thirdparty = res.data.third_party;
                this.setState({thirdparty})
                axios.get(BASE_URL+`thirdparty/${thirdparty}`)
                    .then(res => {
                        const third = res.data.name;
                        const infothird = res.data.info;
                        console.log("third party")
                        console.log(res)
                        this.setState({third, infothird})
                    })
                    .catch(err => {console.log("Error when call third party" + err)})
                const datestart = res.data.register_begin_date;
                const timestart = new Date(datestart).getTime();
                console.log("timestart " + timestart)
                const startday = new Date(timestart).toDateString();
                console.log("datestartdijid " + datestart);
                const dateend = res.data.register_end_date;
                const timeend = new Date(dateend).getTime();
                const endday = new Date(timeend).toDateString();
                console.log("timeend " + timeend)
                const timenow = Date.now()
                console.log("timenow " + timenow)
                let remainingdayt = Math.floor((timeend - timenow)/86400000);
                let remainingday ;
                if(remainingdayt < 0){
                    remainingday = "Pool Close"
                    this.setState({poolout: true})
                }else{
                    remainingday = remainingdayt + "Days"
                }
                const withdrawdate = res.data.withdrawal_date;
                const timewithdraw = new Date(withdrawdate).getTime();
                const withdrawday = new Date(timewithdraw).toDateString();
                const redemption = res.data.redemption;
                const interest = res.data.interest_rate;
                const stakingtime = res.data.staking_time;
                const minimumamount = res.data.minimum_amount;
                this.setState({startday,endday,withdrawday, redemption, interest, stakingtime, remainingday,minimumamount})
            }


        })
        .catch(err => {
            window.location.replace(WEB);
        })
    }

    async getInfoaddress(address){
        try{
            const getInfoid = await axios.get(BASE_URL+`user/${address}/coin/${this.state.idcoin}`);
            const id = getInfoid.data.id;
            console.log("Login in me 1")
            console.log(id)
            console.log("ID COIN")
            console.log(this.state.idcoin)
            if(id == "false"){
             this.setState({checkwallet: 2})
            }else{
                const getInfowallet = await axios.get(BASE_URL+`getuser/${id}/coin/${this.state.idcoin}/thirdparty/${this.state.thirdparty}`);
                 const addressuser = getInfowallet.data.addressuser;
                 if(addressuser != "false"){
                     console.log("Login in me")
                     this.setState({ 
                         walletbtc : addressuser,
                         disableButtonstake: false,
                         stylecolorstake: 1,
                         walletreceive: getInfowallet.data.addressAz,
                         checkwallet: 1,
                         user: id
                     })
                 }
            }
        }catch(error){
            console.log(error)
        }
    }

    async getTransaction(){
        axios.get(BASE_URL+`stake/pool/${this.state.id}/user/${this.state.user}`)
        .then(res => {
            console.log("getTransaction ok")
            const lengthData = res.data.length;
            console.log("lengthData " +lengthData)
            const data = res.data;
            if(lengthData > 0){
                const dataTransaction = []
                for(var i=0; i< lengthData; i++){
                    const objecttransac = {};
                    objecttransac.balance = data[i].amount;
                    console.log("objecttransac.balance " + objecttransac.amount)
                    const stas = Number(data[i].status);
                    if(stas == 0){
                        objecttransac.status = "Pending";
                    }else if(stas == 1){
                        objecttransac.status = "Reject";
                    }else if(stas == 2){
                        objecttransac.status = "Done";
                    }else if(stas == 3){
                        objecttransac.status = "Paid";
                    }
                    objecttransac.time = data[i].time;

                    // var date1 = new Date(objecttransac.time).getTime();
                    // objecttransac.timestamp = Math.floor(date1/1000)
                    objecttransac.timestamp = data[i].time;
                    console.log("objecttransac.timestamp " + objecttransac.timestamp)
                    objecttransac.interest = (data[i].interest).toFixed(4);
                    dataTransaction.push(objecttransac)
                }
                dataTransaction.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
                var totalpage = (Math.floor(dataTransaction.length / 10) > 0) ? (((dataTransaction.length % 10) > 0) ? Math.floor(dataTransaction.length / 10) +1 : Math.floor(dataTransaction.length / 10))  :  1;
                var listcurrentpage = (totalpage > 1) ? dataTransaction.slice(0, 10) : dataTransaction;
                this.setState({
                    dataTransaction,
                    checktransaction: true,
                    totalpage, 
                    listcurrentpage
                })
            }
        })
        .catch(err => {
            console.log("Error when call transaction: " +err)
        })

        axios.get(BASE_URL+`getbalancemystake/pool/${this.state.id}/user/${this.state.user}`)
        .then(res => {
            this.setState({
                totalbalanceuser: res.data.totalstake
            })
        })

       
    }
    async componentWillReceiveProps() {
        const account = this.props.account
        this.setState({account})
        if(account != "0x00"){    
            console.log("Login check transaction")
            await this.getStatus(account)     
            await this.getInfoaddress(account)          
            await this.getTransaction()
        } 
    }

    greatewallet(){
        // alert("abc")
        console.log("this.state.account : " + this.state.account)
        const walletbitcoin = this.state.inputwallet;
        if(walletbitcoin.length > 20){
            axios.get(BASE_URL+`address/${walletbitcoin}`)
            .then(res => {
                const address = res.data.address;
                console.log("addressdusud:" + address)
                if(address == "false"){
                    axios.post(BASE_URL+'user/',
                    {
                        'metamask': this.state.account,
                        'status': 1,
                        'coin': this.state.idcoin,
                        'address': this.state.inputwallet
                    })
                    .then(response => {
                        const status = response.data.Updateuser;
                        if(status == "success"){
                            console.log("Update infomation success!")
                            this.setState({
                                checkwallet:1, 
                                walletbtc: this.state.inputwallet,
                                disableButtonstake: false,
                                stylecolorstake: 1,
                    
                            })
                            this.getInfoaddress(this.state.account)
                            alert("Update wallet success")
                        }else{
                            alert(`Please enter correct ${this.state.symbol} address`)
                        } 
                    })
                    .catch(err => {
                        alert("Wallet address already exists")
                    })
                }else{
                    alert("Wallet address already exists")
                }
            })
            .catch(err => {
                console.log(err)
            })

            
        }else{
            alert("Please enter correct address")
        }
        
    }
    process(){
        console.log("Process")
        axios.get(BASE_URL+`getpending/pool/${this.state.id}/user/${this.state.user}`)
        .then(res => {
            const pending = res.data.pending;
            const withdraw = (this.state.value * this.state.interest * this.state.stakingtime)/36500;
            if(pending == "success"){
                axios.post(BASE_URL+'poststake/', {
                    "user" : this.state.user,
                    "pool" : this.state.id,
                    "amount": this.state.value,
                    "interest": withdraw ,
                    "receive" : this.state.walletreceive,
                    "deposit" : this.state.walletbtc
                })
                .then(res => {
                    console.log(res)
                    this.getTransaction()
                    this.setState({statesuccess: true})
                })
                .catch(err => {
                    console.log(err)
                })  
            }else{
                alert("Your pending order number has reached its limit")
            }
        })
        .catch(err => {
            console.log("Error when call pending")
        })
        this.setState({ showModal: false})  

    }

    async loginmetamask(){
        const web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        .then(res => {
          console.log("connect success")
          const address = web3.utils.toChecksumAddress(res.toString())
        //   console.log("address " + address)
          this.setState({ account : address})
        if(address != "0x00"){
            this.getInfoaddress(address)
            this.getTransaction(address)
        } 
        })
        .catch(err => {
          console.log("Error: " + err)
        })  
    }

    showasset(){
        this.setState({ showAssetinfo: true });
    }
    showthird(){
        this.setState({ showModalthird: true })
    }

    prevPage(){
        if(this.state.currentpage > 1){
          console.log("this.state.currentpage")
          console.log(10*this.state.currentpage -10)
            var listcurrentpage = this.state.dataTransaction.slice(10*(this.state.currentpage-2), 10*(this.state.currentpage-1))
            console.log("this.state.listcurrentpage")
          console.log(this.state.listcurrentpage)
            this.setState({currentpage : this.state.currentpage -1 , listcurrentpage})
        }
      }
      nextPage(){
        if(this.state.currentpage < this.state.totalpage){
            var  listcurrentpage = this.state.dataTransaction.slice(10*this.state.currentpage, 10*this.state.currentpage +10)
            this.setState({currentpage : this.state.currentpage +1 , listcurrentpage})
        }
      }
    
    closesuccess(){
        this.setState({statesuccess: false})
      }
    render(){
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
        let listdataStake;
        if(this.state.checktransaction){
            listdataStake =  this.state.listcurrentpage.map((list) => { 
                var dateNow = '';
                const distance = Math.floor(Date.now() / 1000) - list.timestamp;
                const day = Math.floor(distance/86400);
                const addressuser = this.state.walletbtc;
                const firstaddress = addressuser.substring(0,7)
                const lastaddress = addressuser.substring(addressuser.length -7, addressuser.length)
                const addresslast = firstaddress + "..." + lastaddress
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

                return(
                    <div class="main-allstakers">
                      <Row>
                        <Col md={4}>{addresslast}</Col>
                         <Col md={2}>{list.balance} {this.state.symbol}</Col>
                         <Col md={2}><i>{list.interest} {this.state.symbol}</i></Col>
                        <Col md={2}><i>{list.status}</i></Col>
                        <Col md={2}>{dateNow}</Col>
                      </Row>
                    </div>
                  )
            })
        }
        let wallet ;
        if(this.state.checkwallet == 0){
            // wallet=  <button class="button-wallet" style={{width: "100%"}} onClick={this.loginmetamask}>Please login Metamask</button>
            wallet=  <button class="button-wallet" style={{width: "100%"}} onClick={this.props.checkconect}>Please login Metamask</button>
        }else if (this.state.checkwallet == 1){
            wallet = <div className="wallet-user">
                 <label>User {this.state.symbol} Wallet</label>
                 <div className="input-group mb-4">
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src={user} height='32' alt=""/>
                            </div>
                        </div>
                        <input
                        type="text"
                        value={this.state.walletbtc}    
                        className="input-stake-user-wallet"
                        placeholder="0"
                        required 
                        readOnly/>     
                     </div>
                <p class="p-notice-wallet2">* Notice:</p>
                <p class="p-notice-wallet2">- You have to input your wallet address and send to below Azstake Wallet address</p>
                <p class="p-notice-wallet2">- When you unstake your coin, it will be transferred to your registered Wallet address as above.</p>
                <label className="wallet-receive">Azstake {this.state.symbol} Wallet</label>
                     <div className="input-group mb-4">
                        <div className="input-group-append">
                            <div className="input-group-text">
                                <img src="https://bcoders.org/public/image/unistakes.png" height='32' alt=""/>
                            </div>
                        </div>
                        <input
                        type="text"
                        value={this.state.walletreceive}    
                        className="input-stake-user-wallet"
                        placeholder="0"
                        required 
                        readOnly/>     
                     </div>

                
            </div>
        }else if(this.state.checkwallet == 2){
            wallet =<div>
              <label>Input your {this.state.symbol} wallet address</label>
                <input
                    type="text"
                    value={this.state.inputwallet} 
                    onChange={this.handleChangewallet}
                    className="input-contract"        
                    placeholder="Please past address transfer"
                    required 
                />
                <button 
                onClick={(event) => {
                event.preventDefault()
                this.greatewallet()
                }}
                class="button-wallet">Wallet Address Check</button>
            </div>
        }
        // Login Metamask
        // Update Wallet BTC
        // Show Use wallet and Wallet Receive
        let showStakedetail;
        if(this.state.checkcontractaddress){
            showStakedetail =   <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '750px' }}>
                <div className="content mr-auto ml-auto form-createstake">
                  <div class="h3-register">
                    <img src={this.state.logo} width="50px" height="50px" />
                    <h3 >{this.state.name}</h3>
                </div>
                <div className=" form-contract">
                    {/* Table */}
                    <table className="table-details-pool">
                        <tr>
                        <th>Coin/Token</th>
                        <th>Staking Period</th>
                        <th>Reward (Annual)</th>
                        <th>Min Staking</th>
                        
                        </tr>
                        <tr>
                        <td>{this.state.name} ({this.state.symbol})</td>
                        <td>{this.state.stakingtime} Days</td>
                        <td>{this.state.interest}%</td>
                         <td>{this.state.minimumamount} {this.state.symbol}</td>
                        
                        </tr>
                       
                        </table>

                        <br></br>
                        <table>
                            <tr>
                                <td className="table-tokeninfomation">Coin/Token</td>
                                <th className="table-tokeninfomation">{this.state.name} ({this.state.symbol})</th>
                            </tr>
                            
                            <tr>
                                <td className="table-tokeninfomation">Reward (Annual)</td>
                                <th className="table-tokeninfomation">{this.state.interest} %</th>
                            </tr>
                            <tr>
                                <td className="table-tokeninfomation">Staking Period</td>
                                <th className="table-tokeninfomation">{this.state.stakingtime} Days</th>
                            </tr>
                            <tr>
                                <td className="table-tokeninfomation">Register Time</td>
                                <th className="table-tokeninfomation">{this.state.startday} - {this.state.endday}</th>
                            </tr>
                            {/* <tr>
                                <td>End Time</td>
                                <th>05-11-2020</th>
                            </tr> */}
                            <tr>
                                <td className="table-tokeninfomation">Unstake Time</td>
                                <th className="table-tokeninfomation">{this.state.withdrawday} (Business Day)</th>
                            </tr>
                            <tr>
                                <td className="table-tokeninfomation">Redemption period </td>
                                <th className="table-tokeninfomation">{this.state.redemption} Days</th>
                            </tr>
                            <tr>
                                <td className="table-tokeninfomation">Third Party</td>
                                <th className="table-tokeninfomation hover-third"
                                onClick={(event) => {
                                    event.preventDefault()
                                    this.showthird()
                                    }}>{this.state.third}</th>
                            </tr>
                        </table>
                        <button className="assetinfo" onClick={this.showasset}>
                            Asset Info
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                            </svg>
                        </button>
                    
                        <div>
                            {/* <p>Infomation Wallet</p> */}
                            {wallet}
                        </div>
               <form className="mb-3" onSubmit={this.handleSubmit}>
              <div>
               
                <label className="float-left"><b>Stake Coin</b></label>
              </div>
              <div className="input-group" style={{marginBottom: 0}}>
                <input
                  type="number" 
                  value={this.state.value} 
                  onChange={this.handleChange}
                  className="input-stake-wallet"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-choice-stake">
                    <img src={this.state.logo} height='32' width='auto' alt=""/>
                    &nbsp;&nbsp;&nbsp; {this.state.symbol}
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
                                    {/* <p className="color-search">Interest Coefficent: {i.interest} %</p>
                                    <p className="color-search">Reward Per Day: {i.reward} BTC</p> */}
                                    <p className="color-search">Estimated Reward: {i.estimate} {this.state.symbol}</p>
                                    {/* <p className="color-search">*Notice: Estimated Reward is assumed quantity at your staking time and may change due to fluctuation of total staking quantity   </p> */}
                                    </div>
                                )
                                }
                            )
                            }
                </div>
                {/* Edn Search Bar */}
             
              
                <div class="margin-button-details-btc">
                <button type="submit" className=" background-color"  disabled={this.state.disableButtonstake} style={{opacity: this.state.stylecolorstake}}> STAKE</button>
                  
              
               </div>
            </form>
            
            {/* End form */}

            <div>
              {popupsuccess}
            </div>
            <div>
             
              <p className="detail-p"><b>Pool Status</b></p>
              <Row>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Total Staking </p>
                        <p className="fontsize20"><b>{this.state.totalbalancestake}</b></p>
                  <p className="symbol"><b>{this.state.symbol}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Total Staker</p>
                        <p className="fontsize20"><b>{this.state.totalstaker}</b> </p>
                    <p className="symbol"><b>Staker</b></p>
                    </div>
                </Col>
                </Row>
                <p className="detail-p"><b>My Staking Status</b></p>
                <Row>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">My Staking </p>
                        <p className="fontsize20"><b>{this.state.totalbalanceuser}</b></p>
                       <p className="symbol"><b>{this.state.symbol}</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      {/* <p className="fontsize14">Reward {this.state.symbol} / Minutes</p> */}
                      <p className="fontsize14">Interest</p>
                        <p className="fontsize20"><b>{this.state.interest}</b> </p>
                  <p className="symbol"><b>% / Year</b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Remaining Time</p>
                        <p className="fontsize20"><b>{this.state.remainingday}</b></p>
                      <p className="symbol"><b></b></p>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="detalpool">
                      <p className="fontsize14">Unstake date </p>
                        <p className="fontsize20"><b>{this.state.withdrawday}</b></p>
                      <p className="symbol"><b></b></p>
                    </div>
                </Col>                
              </Row>
            </div>
            </div>
                </div>
                </main>
            </div>
                   <div className="liststakers">
                      <h4>My Staking History</h4>
                      <div ref={this.myDivToFocus} className="allstakers">
                          <div className="allstakersheader">
                          <Row>
                            <Col md={4}><b>Address</b></Col>
                            <Col md={2}><b>Amount</b></Col>
                            <Col md={2}><b>Interest</b></Col>
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
              <h3>Disclaimert</h3>
              <div className="alert-disclaimert">
              <p>Members who agree and accept the quantity of coin / token for staking service which managed by the partner company mentioned above, will not be able to unstake before the pool period, Please consider carefully before using service.</p>
              <p>Reward policy may not be changed, however, policy may be subject to change depending on market volatility.</p>
              <p>The reward and lock quantity will be paid out within 2 working days (excluding weekends / holidays) after the completion of the pool period.</p>
              <p>Annual interest rate notation is only to help members understand the value of reward</p>
              <p>Due to the specificity of the service, in case risks come from the third party, all risks will be under  the member's resp</p>
              <p>Not support for users as US - citizen and all IP addresses from USA will be blocked on our services</p>
              </div>              
              <button class="button-success" onClick={this.closepopup}>I understand</button>
              </div>           
            </Modal>

            <Modal show={this.state.showModalthird} onHide={this.closethird} >
                 <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                        {this.state.third}
                        </Modal.Title>
                </Modal.Header>
                <div className="popup-assetinfo">
                     <p><b>Introduction: </b></p>
                    <p>This service is a service which gets the user's staking assets on AZstake and then stakes them on the third party's staking service. Users can stake on Azstake where pays the most excellent and high yield rate as one of all of the worldwide staking companies without registering or participating on each third party's staking service.
</p>
                    <p>However, when occuring some issues such as delaying for asset withdrawal which users staked on the third party… user's deposited assets will be asked to understand about withdrawal delayment during time of solving above issue on third party or in worst case, when the third party occurs the issues such as suspension of business…Due to user's assets are delegated to the third party through AZstake, user's assets occur some issues as well.
AZstake will do its best to make such problems not happen.</p>
                    <p>We will do our best to preserve user's assets by making compromises with the third parties's circumstance.</p>
                    <p dangerouslySetInnerHTML={{__html: this.state.infothird}}/>
                </div>              
            </Modal>

            <Modal show={this.state.showAssetinfo} onHide={this.closeasset} size="lg">
                 <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                        {this.state.name} ({this.state.symbol})
                        </Modal.Title>
                </Modal.Header>
                <div className="popup-assetinfo">
                     <p><b>Introduction: </b></p>
                    {/* <div id="info" className="p-popup-assetinfo">
                        {this.state.info}
                    </div> */}
                    <p dangerouslySetInnerHTML={{__html: this.state.info}}/>
                </div>     
            </Modal>
            <Modal show={this.state.showBlock} onHide={this.closeblock} size="lg">
                 <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Notice
                        </Modal.Title>
                </Modal.Header>
                <div className="popup-assetinfo">
                     <p><b>The account has been locked</b></p>
                </div>     
            </Modal>
            <Modal 
                show={this.state.showModal} 
                onHide={this.close}  
                size="lg"
               >
                <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                        Stake Infomation
                        </Modal.Title>
                </Modal.Header>
                <div class="modal-show-wallet">
                    {/* <h3>Stake Infomation</h3>                   */}
                    <QRCode
                        id='qrcode'
                        value={this.state.walletreceive}
                        size={290} 
                        level={'H'}
                        includeMargin={true}
                    />
                    <div className="style-popup-wallet" >
                        <Row>
                            <Col md={3} xs={3}><p className="p-wallet">User Wallet</p></Col>
                            <Col md={6} xs={6}>
                                <p id="showqr" className="p-wallet1">{this.state.walletbtc}</p>                             
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} xs={3}><p className="p-wallet">Azstake Wallet</p></Col>
                            <Col md={6} xs={6}>
                                {/* <p id="showqrwallet" className="p-wallet1" >{this.state.walletreceive}</p> */}
                                <input
                                id="showqrwallet"
                                className="input-receive-wallet"
                                value = {this.state.walletreceive}
                                />
                                
                            </Col>
                            <Col md={2} xs={2}>
                            <svg onClick={this.copywallet} width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-files" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M3 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"/>
                            <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                            </svg>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={3} xs={3}><p className="p-wallet">Amount</p></Col>
                            <Col md={6} xs={6}>
                                <input
                                    id="showqramount"
                                    className="input-receive-wallet"
                                    value = {this.state.value}
                                />
                                {/* <p id="showqramount" className="p-wallet1">{this.state.value} BTC</p>          */}
                            </Col>
                            <Col md={2} xs={2}>
                            <svg onClick={this.copyamount} width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-files" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M3 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"/>
                            <path d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
                            </svg>
                            </Col>
                        </Row>     
                        {/* <Row>
                            <Col md={3} xs={3}><p className="p-wallet">TxHash</p></Col>
                            <Col md={9} xs={9}>
                                <input
                                type="text"                            
                                value={this.state.txhash} 
                                onChange={this.handleChangtxhash}
                                className="input-contract-cefi"
                                placeholder="Ex: c6127f1aef49d6f644d27.."
                                />                           
                            </Col>
                        </Row>       */}
                    </div> 
                   
                    <div className="style-popup-wallet">
                        <p class="p-notice-wallet1">*Notice: After depositing and clicking "Process" button, all transaction information will be displayed in the staking history with "pending" status</p>       
                        <br></br>
                        <p class="p-notice-wallet1"><strong>Disclaimer</strong></p>
                        <p class="p-notice-wallet1">* Members who agree and accept the quantity of coin / token for staking service which managed by the partner company mentioned above, will not be able to unstake before the pool period, Please consider carefully before using service.</p>
                        <p class="p-notice-wallet1">* Reward policy may not be changed, however, policy may be subject to change depending on market volatility.</p>
                        <p class="p-notice-wallet1">* The reward and lock quantity will be paid out within 2 working days (excluding weekends / holidays) after the completion of the pool period.</p>
                        <p class="p-notice-wallet1">* Annual interest rate notation is only to help members understand the value of reward</p>
                        <p class="p-notice-wallet1">* Due to the specificity of the service, in case risks come from the third party (such as:  hacked, delayed unstaking, bankrupt ...), all risks will be under  the member's resp</p>
                        <p class="p-notice-wallet1">* Not support for users as US - citizen and all IP addresses from USA will be blocked on our services</p>
                    </div>
                    <Button onClick={this.process} bsPrefix="background-color-wallet">Process</Button>
                   
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
export default withRouter(Pool)