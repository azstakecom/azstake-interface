import React, { Component } from 'react';
import '../css/App.css'
import Web3 from 'web3'
import { Col, Row} from 'react-bootstrap';
import BuyToken from '../abis/BuyToken.json'
import StakeToken from '../abis/StakePool.json'
import Addpool from '../abis/AddPoolNew.json'
import {
    BrowserRouter as Router,
    Redirect
  } from "react-router-dom";
import Footer from '../components/Footer'
export default class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showtoken: false,
            widthtoken: "150px",
            heighttoken:"150px",
            showstake: false,
            widthstake: "150px",
            heightstake:"150px",
            valuetoken: '',
            redirecttoken: false,
            contracttoken: '',
            valuestake: '',
            redirectstake: false,
            alerttoken: false,
            alertstake:false,
            account: '',
            contractAdd:{},
            contractBuy:{}

        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitstake = this.handleSubmitstake.bind(this);
        this.handleChangestake = this.handleChangestake.bind(this);
    }
    handleChange(event) { this.setState({valuetoken: event.target.value});}
    handleChangestake(event) { this.setState({valuestake: event.target.value});}
    handleSubmit(event) {
        event.preventDefault()
        this.getToken(this.state.valuetoken) 
    }

    handleSubmitstake(event) {
        event.preventDefault()
        this.getTokenstake(this.state.valuestake) 
    }
    async componentDidMount() {
        // await this.loadweb3()
        await this.loaddata()
    }
    async loadweb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
        //   await window.ethereum.enable()
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
        const networkId = await web3.eth.net.getId()  
        const addToken = Addpool.networks[networkId]
        if(addToken) {
          const contractAdd = new web3.eth.Contract(Addpool.abi, addToken.address)
          this.setState({
            contractAdd
          })
        }
        const buyToken = BuyToken.networks[networkId]
        if(buyToken) {
          const contractBuy = new web3.eth.Contract(BuyToken.abi, buyToken.address)        
          this.setState({
            contractBuy
          })
        }

    } 
    getTokenstake(contract) {
        const web3 = window.web3 
        var abi = require('human-standard-token-abi')    
        try{
            var tokenHuman = new web3.eth.Contract(abi, contract)
            tokenHuman.methods.name().call().then(respone => {  
                const hasListed = this.state.contractAdd.methods.hasListed(contract).call()
                .then(res => {
                    console.log("hasListed check has")
                    console.log(res)
                    if(res){
                        
                        const lasttime = this.state.contractAdd.methods.lasttime(contract).call()
                        .then(restime => {
                            const timecheck = restime - Math.floor(Date.now() / 1000);
                            if(timecheck > 0){
                                this.setState({
                                    alertstake: true                     
                                })
                            }else{
                                this.setState({
                                    redirectstake: true                     
                                })
                            }
                        })
                    }else{
                        this.setState({
                            redirectstake: true
                        })
                    }

                })
                
            })
            .catch(error => {
                alert("Contract Address Wrong")
            })
            
        }catch{
            alert("Contract Address Wrong")
        }
        // alert(contract)
    }

    

    getToken(contract) {
        const web3 = window.web3 
        var abi = require('human-standard-token-abi')    
        try{
            var tokenHuman = new web3.eth.Contract(abi, contract)
            tokenHuman.methods.name().call().then(respone => {              
                const hasbuyListed = this.state.contractBuy.methods.hasbuyListed(contract).call()
                .then(res => {
                    if(res){
                        this.setState({
                            alerttoken: true                     
                        })
                    }else{
                        this.setState({
                            redirecttoken: true
                        })
                    }
                })
                
            })
            .catch(error => {
                alert("Contract Address Wrong")
            })
      
        }catch{
            alert("Contract Address Wrong")
        }
        // alert(contract)
    }

    someHandlertoken() {
        this.setState({
            showtoken: true,
            widthtoken: "50px",
            heighttoken: "50px"
        })
    }

    someHandLeavetoken() {
        this.setState({
            showtoken: false,
            widthtoken: "150px",
            heighttoken: "150px"
        })
    }

    someHandlerstake() {
        this.setState({
            showstake: true,
            widthstake: "50px",
            heightstake: "50px"
        })
    }

    someHandLeavestake() {
        this.setState({
            showstake: false,
            widthstake: "150px",
            heightstake: "150px"
        })
    }
    
    render() {
        if(this.state.redirecttoken) {
            return <Redirect to={'/create/token/' + this.state.valuetoken}/>
        }
        if(this.state.alerttoken){
            alert("Token already exists.")
            window.location.reload();
        }
        if(this.state.redirectstake) {
            return <Redirect to={'/create/stake/' + this.state.valuestake}/>
        }
        if(this.state.alertstake){
            alert("Pool already exists.")
            window.location.reload();
        }
        // console.log("alerttoken: " + this.state.alerttoken)
        let contentoken;
        if(this.state.showtoken) { 
            contentoken =<div>
            {/* <p>If you want to create token</p> */}
                <div className="container-fluid mt-5" >
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                            <div className="content mr-auto ml-auto">
                                <form onSubmit={this.handleSubmit}>
                                    <input
                                        type="text"       
                                        value={this.state.valuetoken} 
                                        onChange={this.handleChange}                                   
                                        className="form-control form-control-lg input-contract"
                                        placeholder="Token Address"
                                        required 
                                        />
                                    <button type="submit" className="btn btn-block btn-lg background-pool" style={{backgroundColor: "#fdcb6e", color: "white"}}>Search</button>
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        }
        let contentstake;
        if(this.state.showstake) {
            contentstake = <div>
                            {/* <p>If you want to create pool</p> */}
                                <div className="container-fluid mt-5" >
                                    <div className="row">
                                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                                            <div className="content mr-auto ml-auto">
                                                <form  onSubmit={this.handleSubmitstake}>
                                                    <input
                                                        type="text"       
                                                        value={this.state.valuestake} 
                                                         onChange={this.handleChangestake}                                    
                                                        className="form-control form-control-lg input-contract"
                                                        placeholder="Token Address"
                                                        required 
                                                        />
                                                    <button type="submit" className="btn btn-block btn-lg background-pool" style={{backgroundColor: "#ff6b81", color: "white"}}>Search</button>
                                                </form>
                                            </div>
                                        </main>
                                    </div>
                                </div>
                            </div>
        }
        return(
           <div>
               
               <Row>
                        <Col  md={6} xs={12}
                        className="creat-css-register"
                        onMouseEnter={() => this.someHandlertoken()}
                        onMouseLeave={() => this.someHandLeavetoken()}>
                           {/* <Link to="create/token-register">TOKEN REGISTER</Link> */}
                            <div class="main-icon-create">
                                
                                <svg width={this.state.widthtoken} height={this.state.heighttoken} viewBox="0 0 16 16" class="bi bi-kanban" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M13.5 1h-11a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11z"/>
                                    <path d="M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3z"/>
                                </svg>
                                <h3 class="h3-create-pool">Token Sales</h3>
                                 {contentoken}
                            </div>
                        </Col>
                        <Col  md={6} xs={12}
                        className="creat-css-stake"
                        onMouseEnter={() => this.someHandlerstake()}
                        onMouseLeave={() => this.someHandLeavestake()}>
                           {/* <Link to="create/token-register">TOKEN REGISTER</Link> */}
                            <div class="main-icon-create">
                                
                                <svg width={this.state.widthstake} height={this.state.heightstake} viewBox="0 0 16 16" class="bi bi-gift-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3z"/>
                                <path d="M15 7v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7h6zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9H2.5z"/>
                                </svg>
                                <h3 class="h3-create-pool">Pool Creation</h3>
                                 {contentstake}
                            </div>
                        </Col>
                     </Row>
                     <Footer/>
           </div> 
        )
    }
}