import React, { Component } from 'react';
import '../css/App.css'
import usdtlogo from '../assets/usdt.png'
import bannerbuy from '../assets/banner-input_02.jpg'
import Footer from '../components/Footer'
import { Modal} from 'react-bootstrap';
import {NETWORK_ETH, WALLET_USDT} from '../constants'
export default class Buytoken extends Component {
    constructor(props) {
        super(props)
        this.state = { 
          output: 0,   
          decimalToken:0,
          valueSelect:'choice',
          ratio: 0,
          symbol: '',
          balancetoken: 0,
          etherAmount: 0,
          showModal: false,
          totalsupply: 0,
          allowan: 0,
          showapprove: 1 ,
          showetherscan: false,
          UsdtAddress: WALLET_USDT, 
          allowanusdt: 0,
          backgroundApprove: "#00a8ff",
            colorApprove: "white",
            backgroundApproveStake: "#a4b0be",
            colorApproveStake: "#dfe6e9",
            disableApprove: false,
            disableApproveStake: true,
            stateapprove: true,
            statestake: true,
            balanceUT: 0
              
        } 
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.close = this.close.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }
    handleChangeInput(event) { 
        const re = /^[0-9\b\.]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
                const etherAmount = event.target.value.toString()
                this.setState({
                    output: etherAmount * this.state.ratio / (10**this.state.decimalToken),
                    etherAmount
                })         
        }     
      }
    async loaddata(){
        if(this.props.account != "0x00"){
            const web3 = window.web3 
            var abi = require('human-standard-token-abi')
            var tokenUSDT = new web3.eth.Contract(abi, this.state.UsdtAddress)
            var allowan = await tokenUSDT.methods.allowance(this.props.account,this.props.addressBuy).call()
            .catch(err => {console.log("Error: " + err)})          
            if(allowan > 0) {this.setState({showapprove : 1,allowanusdt: allowan/ (10**6)})}
            this.setState({balanceUT: this.props.balanceUSDT})
        }
    }
    async componentDidMount(){
       await this.loaddata()
    }

    async componentWillReceiveProps() {
        await this.loaddata()
    }

    async handleChangeSelect(event) {
        const option = event.target.value;
        this.setState({
            valueSelect: option
        })
        if(option !== "choice"){
            const ratio = await this.props.contractBuy.methods.ratiotoken(option).call()
            const decimalToken = await this.props.contractBuy.methods.decimaltoken(option).call()
            const balancetoken = await this.props.contractBuy.methods.balancetoken(option).call()
            console.log("balancetoken" + balancetoken)
            this.setState({
                ratio,
                decimalToken,
                balancetoken, 
                output: 0,
                showetherscan: true
            });
        }else{
            this.setState({
                balancetoken: 0,
                ratio:0,
                showetherscan: false,
                etherAmount: 0,
                output: 0
            })
        }
    }
 
    async whenSwapsuccess(option){
        if(option !== "choice"){
            const web3 = window.web3 
            var abi = require('human-standard-token-abi')
            var tokenUSDT = new web3.eth.Contract(abi, this.state.UsdtAddress)
            var allowan = await tokenUSDT.methods.allowance(this.props.account,this.props.addressBuy).call()
            var balanceUT = await tokenUSDT.methods.balanceOf(this.props.account).call()
            const ratio = await this.props.contractBuy.methods.ratiotoken(option).call()
            const decimalToken = await this.props.contractBuy.methods.decimaltoken(option).call()
            const balancetoken = await this.props.contractBuy.methods.balancetoken(option).call()
            this.setState({
                ratio,
                decimalToken,
                balancetoken, 
                output: 0,
                showetherscan: true,
                allowanusdt: allowan/ (10**6),
                balanceUT
            });
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
     
    async handleSubmit(event) {
        event.preventDefault();
        if(this.state.valueSelect !== "choice"){
        this.Swaptoken()
        //   console.log("totalsupply " + totalsupply)
          
        }else{
            alert("Please choice token sale")
        }      
      }

      async Swaptoken(){
        var usdtbalance = this.state.balanceUT;
        var balanceusdt = this.state.etherAmount*(10**6)
        var avaiabletoken = this.state.balancetoken / (10**this.state.decimalToken);
        if(Number(this.state.output) > Number(avaiabletoken)){return alert("The amount you want to swap is more than the available quantity")}
        if(Number(balanceusdt) > Number(usdtbalance)){return alert("Your balance is not enough to swap")}
        const web3 = window.web3 
        var abi = require('human-standard-token-abi')
     
      var tokenUSDT = new web3.eth.Contract(abi,this.state.UsdtAddress)
        console.log("this.state.output " +  this.state.output)
        var balance = (this.convert(this.state.output*10**this.state.decimalToken)).toString()
        var totalsupply =  await tokenUSDT.methods.totalSupply().call();
        var allowan = await tokenUSDT.methods.allowance(this.props.account,this.props.addressBuy).call();
        var balanceusdt = this.state.etherAmount*(10**6)
          console.log("allowan" + allowan)
          console.log("balance " + balance)
          var confirm =0;
        this.setState({showapprove: 2})
        if(Number(allowan) > Number(balanceusdt)){
          this.props.contractBuy.methods.buytoken(this.state.valueSelect, balance).send({ from: this.props.account }).on('confirmation', (confNumber, receipt) => {
              if(confirm == 0){
                  this.setState({showModal: true, showapprove: 1})
                  setTimeout(this.whenSwapsuccess(this.state.valueSelect) , 1000);
              } 
              confirm =1;          
          }).on('error', (error) => {this.setState({showapprove: 1})})  
        }else {
          tokenUSDT.methods.approve(this.props.addressBuy, totalsupply).send({ from: this.props.account }).on('confirmation', (confNumber, receipt) => {
              this.setState({showapprove: 1 })
          }).on('error', (error) => {this.setState({showapprove: 0})})
        }
      }
      async Approve(){
        const web3 = window.web3; 
        let confirm =0;
        var abi = require('human-standard-token-abi')
        this.setState({stateapprove: false})
        var tokenUSDT = new web3.eth.Contract(abi, this.state.UsdtAddress)
        var totalsupplytoken = await tokenUSDT.methods.totalSupply().call()
        tokenUSDT.methods.approve(this.props.addressBuy, totalsupplytoken).send({ from: this.props.account }).on('confirmation', (confNumber, receipt) => {
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
  async ApproveSwap(){
      this.Swaptoken()
  }
    render() {
        let infoEtherscan;
        if(this.state.showetherscan){
            infoEtherscan = <a href={NETWORK_ETH + 'token/' + this.state.valueSelect} target="_blank" className="veiwetherscan">
                View contract on Etherscan 
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
                    </svg>
                </a>
        }
        let approvepool;
      if(this.state.showapprove == 0){
        approvepool = "SUBMIT SWAP"
      }else if (this.state.showapprove ==1){
        approvepool = "SWAP"
      }else if (this.state.showapprove ==2){
        approvepool = <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader-swap"></div>
        </div>
      }
        let listitem;
        if(this.props.lengthBuy>0){
            listitem = this.props.datalistBuytoken.map((i) => {
                return(
                <option value={i.contractaddress}>{i.symbol}</option> 
                )
            })
        }
        let approvetext;
        if(this.state.stateapprove){
            approvetext= <div>1. Approve</div>
        }else{
            approvetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader-swap"></div>
        </div>
        }
        let sattetext;
        if(this.state.statestake){
            sattetext =  <div>2. Swap</div>
        }else{
            sattetext= <div style={{marginLeft: "auto", marginRight: "auto"}}>
        <div class="loader-swap"></div>
        </div>
        }
        let buttonoperation;
        if(!this.props.enableSwap){
            if(Number(this.state.allowanusdt) > Number(this.state.etherAmount)){
                buttonoperation=  <button type="submit" className="btn  btn-block btn-lg background-color-swap" style={{backgroundColor: "#00a8ff", color: "white"}}>{approvepool}</button>
            }else{
                buttonoperation = <div>
                    <button type="submit" className="btn btn-block btn-lg background-color-swap" 
                     style={{backgroundColor: this.state.backgroundApprove, color: this.state.colorApprove}}
                     disabled={this.state.disableApprove}
                     onClick={(event) => {
                        event.preventDefault()
                        this.Approve()
                     }}>{approvetext}</button>
                    <button type="submit" className="btn btn-block btn-lg background-color-swap"
                    style={{backgroundColor: this.state.backgroundApproveStake, color: this.state.colorApproveStake}}
                    disabled={this.state.disableApproveStake}
                    onClick={(event) => {
                        event.preventDefault()
                        this.ApproveSwap()
                      }}>{sattetext}</button>
                </div>
            }
            // Login success
        }else{
            buttonoperation =  <button type="submit" className="btn btn-primary btn-block btn-lg background-color-swap" 
            style={{backgroundColor: "#00a8ff", border: "1px solid transparent"}}
            onClick={(event) => {
                event.preventDefault()
                this.props.checkconect()
              }}>Connect Wallet</button>
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
                  <button class="button-success" onClick={this.close}>OK</button>
                  {/* <p>SUCCESS</p> */}
              </div>
            </Modal>
            <div className="main-buytoken">
                <div className="buytoken"> 
                    <div className="row" style={{marginLeft: 0, marginRight: 0}}>
                        <main role="main" className="col-lg-12 ml-auto mr-auto main-buy" style={{ maxWidth: '400px' }}>
                            <div className="content mr-auto ml-auto buytoken-main">
                                <form className="mb-3" onSubmit={this.handleSubmit}>
                                <div>
                                    <label className="float-left"><b>Input</b></label>
                                    <span className="float-right text-muted p-content-pool">
                                    {/* Balance: {window.web3.utils.fromWei(this.state.ethBalance, 'Ether')} */}
                                    Balance: {this.state.balanceUT/ (10**6)} USDT
                                    </span>
                                </div>
                                <div className="input-group mb-4">
                                    <input
                                        type="number"
                                        // onChange={(event) => {
                                        //         const etherAmount = this.input.value.toString()
                                        //         this.setState({
                                        //         output: etherAmount * this.state.ratio / (10**this.state.decimalToken),
                                        //         etherAmount
                                        //         })                                             
                                        // }} 
                                        value={this.state.etherAmount} 
                                        onChange={this.handleChangeInput}
                                        // ref={(input) => { this.input = input }}
                                        className="form-control form-control-lg"
                                        placeholder="0"
                                        required />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <img src={usdtlogo} height='32' alt=""/>
                                            &nbsp;&nbsp;&nbsp; USDT
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="float-left"><b>Output</b></label>
                                    <span className="float-right text-muted p-content-pool">
                                    Available Swap: {this.state.balancetoken / (10**this.state.decimalToken)}
                                    </span>
                                </div>
                                <div className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="0"
                                        value={this.state.output}
                                        disabled
                                        />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <select className="select-token" value={this.state.valueSelect} onChange={this.handleChangeSelect} style={{color: "black"}}>
                                            <option selected value="choice">Choice</option>
                                            {listitem}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-5 buy-token-rate">
                                    <span className="float-left text-muted p-content-pool">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-shield-fill-check icon-exchange" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 .5c-.662 0-1.77.249-2.813.525a61.11 61.11 0 0 0-2.772.815 1.454 1.454 0 0 0-1.003 1.184c-.573 4.197.756 7.307 2.368 9.365a11.192 11.192 0 0 0 2.417 2.3c.371.256.715.451 1.007.586.27.124.558.225.796.225s.527-.101.796-.225c.292-.135.636-.33 1.007-.586a11.191 11.191 0 0 0 2.418-2.3c1.611-2.058 2.94-5.168 2.367-9.365a1.454 1.454 0 0 0-1.003-1.184 61.09 61.09 0 0 0-2.772-.815C9.77.749 8.663.5 8 .5zm2.854 6.354a.5.5 0 0 0-.708-.708L7.5 8.793 6.354 7.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                                    </svg>
                                    Swap Rate</span>
                                        <span className="float-right text-muted p-content-pool">1 USDT = {this.state.ratio / (10**this.state.decimalToken)} {this.state.symbol}</span>
                                </div>
                                {infoEtherscan}
                                {buttonoperation}
                                {/* <button type="submit" className="btn btn-primary btn-block btn-lg background-color-swap" disabled={this.props.enableSwap}>{approvepool}</button> */}
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            </>
        )
    }
}