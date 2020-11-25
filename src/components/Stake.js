import React, { Component } from 'react';
import '../css/App.css'
import { Carousel, Modal, Col, Row} from 'react-bootstrap';
import ethnew from '../assets/eth-logo.png'
import register from '../assets/regispool.png'
import comment1 from '../assets/comment1.png'
import comment2 from '../assets/comment2.png'
import dailogo from '../assets/dai.png'
import usdtlogo from '../assets/usdt.png'
import bannerstake from '../assets/banner-stake.jpg'
import banner1 from '../assets/1.jpg'
import bannertop1 from '../assets/bannertop1.jpg'
import bannermobile1 from '../assets/bannermobile1.jpg'
import bannermobile2 from '../assets/bannermobile2.jpg'
import bannermobile3 from '../assets/bannermobile3.jpg'
import like from '../assets/icon-like.png'
import Footer from '../components/Footer'
import Web3 from 'web3' 
import StakeToken from '../abis/StakePool.json'
import EthPool from '../abis/EthPool.json'
import AtozPool from '../abis/AtozPool.json'
// import bannermobile from '../assets/mobile.svg'
import axios from 'axios';
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
export default class Stake extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            totalETH: '',
            totalAtoz: 0,
            totalUSDT: '',
            priceETH: 0,
            showModalpopup: false,
            disableButton: true,
            statebackgroundcolor: "#cecece",
            showday: false

            
        }
        this.handleSubmitnotice = this.handleSubmitnotice.bind(this);
        this.handleInputChangenote =  this.handleInputChangenote.bind(this);
        this.handleInputChangeshowday =  this.handleInputChangeshowday.bind(this);
    }
    handleSubmitnotice(event) {
        event.preventDefault()  
        this.setState({showModalpopup: false})  
        if(this.state.showday){
            const timeNow = Math.floor(Date.now()/1000);
            const timenew = Number(timeNow) + 86400;
            console.log(timeNow) 
            console.log(timenew) 
            localStorage.setItem("timeazstake", timenew);
        }
    }
    handleInputChangeshowday(event) {
        this.setState({showday: event.target.checked})     
    }
    handleInputChangenote(event) { 
        if(event.target.checked){
            this.setState({disableButton: false, statebackgroundcolor: "#0984e3"})
        }else{
            this.setState({disableButton: true, statebackgroundcolor: "#cecece"})
        }
       }
    async componentDidMount(){
        await this.getPriceETH()
        await this.loadWeb3()
        await this.notice()
    }
    async notice(){
        const timeNow = Math.floor(Date.now()/1000);
        var timeSave = localStorage.getItem("timeazstake");
        if(timeSave == null){
            timeSave = 0;
        }
        console.log("time save" + timeSave)
        if(Number(timeSave)> Number(timeNow)){
            this.setState({showModalpopup: false})
        }else{
            this.setState({showModalpopup: true})
        }
    }
    async getPriceETH() {
        try{
          axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT')
          .then(response => {this.setState({priceETH: response.data.price})}) 
        }catch {
          this.setState({priceETH: 0})
        }     
      }
    async loadBlockchainData() {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId() 
        const ethPooltoken = EthPool.networks[networkId]
        if(ethPooltoken){
          const contractEthpool = new web3.eth.Contract(EthPool.abi, ethPooltoken.address)                   
          const totalpool = await contractEthpool.methods.totalpoolEth().call()
          const totalpoolUSDT = await contractEthpool.methods.totalpoolUsdt().call()
          console.log("totalpool ETH" + totalpool)
          this.setState({contractEthpool , addressEthpool : ethPooltoken.address, totalETH: totalpool.toString(),totalUSDT: totalpoolUSDT.toString() })
        }
        const atozPooltoken = AtozPool.networks[networkId]
        if(atozPooltoken){
          const contractAtozpool = new web3.eth.Contract(AtozPool.abi, atozPooltoken.address)          
          
          const totalpoolatoz = await contractAtozpool.methods.totalpoolAtoz().call()
          console.log("totalpool ATOZ" +totalpoolatoz)
          this.setState({contractAtozpool , addressAtozpool : atozPooltoken.address, totalAtoz : totalpoolatoz.toString()})
        //   this.setState({totalAtoz : totalpoolatoz})

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
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
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

    render() {
        let i =0;
        let showlistpool;
        let withscreen = window.innerWidth;
        let bannershow1 = (withscreen < 1024) ? bannermobile1 : banner1;
        let bannershow2 = (withscreen < 1024) ? bannermobile2 : bannertop1;
        let bannershow3 = (withscreen < 1024) ? bannermobile3 : bannerstake;
        console.log("withscreen " + withscreen)
        // console.log("this.props.lengthStaketoken" +  this.props.lengthStaketoken)
        if(this.props.loadpool) {
            showlistpool = 
            this.props.datashowpool.map((list) => { 

                var status = list.status;
                let colordeceend;
                let deceend;
                let dece;
                let colordece;
                let colorvote;
                let colorvoter;
                var ratio;
                var ratiomines;
                var linkid;
                var reamingtime;
                var showtime = '';
                var voteandapy='';
                let poolend;
                let totalvote;
                let marginvote = "0 5%"
                if(status == 1){
                    // DEFI
                   
                    const totaltime = list.lasttime - Math.floor(Date.now() / 1000);
                    var gettimenow='';                 
                    if(totaltime > 0) {
                    const day = Math.floor(totaltime / 86400);
                    const hour = Math.floor((totaltime - day * 86400)/ 3600);
                    const mi = Math.floor((totaltime - day * 86400 - hour*3600) / 60);
                    const se = totaltime - day * 86400 - hour*3600 - mi*60;
                    var gettimenow = day.toString() + "D:" + hour.toString() + "H:" + mi.toString() + "M"
                    }else {
                    var gettimenow = "Pool End";
                    }
                    const estimet =(list.ratio * 1440/(10**list.decimal)).toString(); //SET DAY
                    const estimetstring = estimet.substring(0,7)
                    ratio = estimetstring + ".."
                    // ratiomines = list.symPool + "/Min"     
                    ratiomines = " /Day" //SET DAY
                    dece ="DEFI";
                    colordece = "rgb(217, 31, 38)"
                    linkid='/stake/' + list.contractaddress;
                    showtime = gettimenow;
                    reamingtime = "Remaining Time:";
                    voteandapy = "Total Vote: "
                    colorvote = "#3498db"
                    colorvoter = "#ffffff" 
                    totalvote = list.totalvote
                    marginvote = "0 20%"
                }else if (status ==2){
                    // CEFI
                    ratio = list.ratio
                    ratiomines = "%/Year"
                    linkid = '/pool/' + list.contractaddress;
                    showtime = list.lasttime + 'Days';
                    reamingtime = "Staking Period:";
                    voteandapy = "Register Time: "
                    poolend = (list.check == 1) ? "#ffffff" : "#dfe6e9"
                    // colordeceend = (list.check == 1) ? "#ffffff" : "rgb(217, 31, 38)"
                    // deceend = (list.check == 1) ? "" : "END"
                    totalvote = list.firstday + "-" + list.endday
                }else if(status == 3){
                    // ATOZ
                    dece ="DEFI";
                    colordece = "rgb(217, 31, 38)"
                    ratio = list.ratio
                    ratiomines = " ATOZ"
                    linkid = '/azstake/' + list.contractaddress;
                    showtime = list.lasttime;
                    reamingtime = "Staking Time:";
                    voteandapy = "APY: "
                    colorvoter = "#2ecc71"
                    if(list.contractaddress == "ethereumusdt"){
                        // const web3 = new Web3(window.ethereum); 
                        const web3 = window.web3;
                        const amountETH = (this.convert(this.state.totalETH)).toString()
                        var amountETHuser = parseFloat(web3.utils.fromWei(amountETH, 'ether')).toFixed(6);
                        console.log("amountETHuser " + amountETHuser)
                        // alert(amountETHuser)
                        const amountUSDT = (this.convert(this.state.totalUSDT)).toString()
                        var amountUSDTuser = parseFloat(web3.utils.fromWei(amountUSDT, 'mwei')).toFixed(6);
                        console.log("amountUSDTuser " + amountUSDTuser)
                        var totalethusdtpool = 5*(Number(this.state.priceETH) * Number(amountETHuser) + Number(amountUSDTuser))
                        console.log("totalethusdtpool " + totalethusdtpool)
                        if(totalethusdtpool == 0){
                            totalvote = "∞%"
                        }else{
                            totalvote = (1800000 * 100 / totalethusdtpool).toFixed(4) + " %"
                        }
                    }else{
                        // totalvote = "2500%"
                        var totalatozpool = Number(this.state.totalAtoz)
                        console.log("totalatozpool " + totalatozpool )
                        if(totalatozpool == 0){
                            totalvote = "∞%"
                        }else{
                            totalvote = (6000000000000000000000000 * 100/ totalatozpool).toFixed(4) + " %"
                        }
                    }
                    
                }       
                var iconregister=''
                if(list.iconPool=="https://bcoders.org/public/image/regispool.png"){
                    iconregister=register;
                }else{
                    iconregister = list.iconPool;   
                }
                let token;
                if(list.hastoken){
                    token = <img src={iconregister} width="35px" height="35px" className="icon-methods"/>
                }
                let eth;
                if(list.haseth){
                    eth = <img src={ethnew} width="35px" height="auto" className="icon-methods"/>
                }
                let usdt;
                if(list.hasusdt){
                    usdt = <img src={usdtlogo} width="35px" height="auto"  className="icon-methods"/>
                }
                let dai;
                if(list.hasdai){
                    dai=  <img src={dailogo} width="35px" height="auto"  className="icon-methods"/>
                }

                
                if(list.contractaddress.length > 20){                  
                    
                }else {
                    
                     

                }

                return(          
                    <Col md={4} xs={12}>
                        <Link to={linkid} style={{ textDecoration: 'none' }}>
                            <div className="mainpool" style={{backgroundColor: poolend}}>
                                <div class="de-ce" style={{backgroundColor: colordece}}>
                                    {dece} 
                                </div>
                                <div class="de-ce-end" style={{backgroundColor: colordeceend}}>
                                    {deceend} 
                                </div>
                                <div className="image-pool">
                                    <img src={iconregister} width="auto" height="30px" className="header-icon"/>
                                </div>
                                
                                <div className="main-content-pool">
                                    <p className="header-namepool">{list.namePool}</p>
                                    <span className="stakeba">{ratio} <span className="p-content-pool">{ratiomines}</span> </span>
                                    
                                    <p className="p-content-pool"><b>Staking Method</b></p>
                                        {token}
                                        {eth}
                                        {usdt}
                                        {dai}
                                        <p className="p-content-pool number-voter" style={{backgroundColor: colorvote, color: colorvoter, margin: marginvote}}><b>{voteandapy}</b> {totalvote}</p>
                                        {/* <div className="main-class-vote">
                                            <div className="vote-image-class">
                                                    <img src={like} width="15px" height="auto"  className="vote-image"/>
                                            </div>
                                             <p className="p-content-pool number-voter" style={{backgroundColor: colorvote, color: colorvoter, margin: marginvote}}><b>{voteandapy}</b> {totalvote}</p>
                                        </div>                                     */}
                                        <p className="p-content-pool"><b>{reamingtime}</b> {showtime}</p>
                                    <button className="button-visit">DETAIL</button>
                                </div>
                            </div>
                        </Link>
                    </Col>
                )

            })
            
        }else {
            showlistpool = <div className="div-image-loading">
            <img src="https://bcoders.org/public/image/unistakes.png" className="image-loading"/>
        </div> 
        }
        return(
            <>
            <Modal show={this.state.showModalpopup} onHide={this.closepopup} >
              <div class="modal-show-notice">
                <h3 className="h3-notice">Precautions for using the Aztake services</h3>
                <div class="scrollbar-y">
                    <p><b>Please read carefully the following notes regarding AZstake's service before making registration and using our service:</b></p>
                    <p>1. AZstake is one place where worldwide Defi yield farming services are gathered. AZstake is a Defi platform service which is created to gather all DeFi yield farming projects in a place by DeFi platform service for convenient and easy use. To search more information, DeFi Yield farming users can reach to various DeFi yield projects on AZstake without accessing or surveying many other websites. AZstake is a service that anyone is able to easily use and join in.</p>
                    <p>2. Ownership of ATOZ Token will not be sponsored by any liability or interest to any owner or enterprise. When comparing the assets of other exchanges, the value of the ATOZ Token will not change so buyers should consider the "announcement of course". After the MTO Token is listed, the volatility in value of the ATOZ Token will be huge, so the buyer should understand that the price of the ATOZ Token will be able to increase or decrease at that time.</p>
                    <p>3. Azstake is not a stock exchange, portfolio of goods or services, unit of business, or unit in an institutional investment plan, equivalent to any other authority.</p>
                    <p>4. If you want to exchange ATOZ or other tokens or exchange one token for another, all tokens are not understood, interpreted, classified or handled as follows: ( a) any currency other than cryptocurrencies; (b) debts, stocks or shares issued by any legal entity (c) rights, options and derivatives in respect of such debts or shares; (d) a contractual right for a difference or under any other contract for the purpose of pretending to secure profits or avoid losses; or e) is an entity in a collective investment program, business trust or any other type of security.</p>
                    <p>5. The tokens used on AZstake are cryptocurrencies, and cryptocurrencies are traded 365 days 24 hours around the world and due to the rapid fluctuations of market prices, it can lead to continuous fluctuations in value.</p>
                    <p>6. ATOZ toke or other tokens are not used or valuable for the exchange, purchase, sale, mortgage, pledge, loan ... with real goods in the real economic market.</p>
                    <p>7. Decision of exchange, staking or other services of AZstake depends entirely on the user or the project. To maintain high liquidity and ensure the token value, the project will create appropriate value through which users evaluate whether or not to implement the service.</p>
                    <p>8. Azstake is an intermediary service so it does not require customers to provide personal information or contact via email, phone call, chat application, message ... under the name of Azstake in any case.</p>
                    <p>9. Projects that require all funds, such as real estate, art, investment, and entrepreneurship, can be STAKED by customers from all around the world via T.Finance platform.</p>
                    <p>10. Specific content please see the "Disclaimer" in the introduction file about Azstake and application sections.</p>
                    <p>Thank you !</p>
                    <p>AZstake Team </p>
                </div>
                <form onSubmit={this.handleSubmitnotice}>
                             <input
                                className="methods-token"
                                name="readnote"
                                type="checkbox"
                                checked={this.state.readnote}                               
                                onChange={this.handleInputChangenote} 
                                />
                                <span style={{marginRight:"10px", fontSize:"14px"}}>
                                     I have read and agree the above notice.
                                </span>
                                <br></br>
                                <input
                                className="methods-token"
                                name="readnote"
                                type="checkbox"
                                checked={this.state.showday}                               
                                onChange={this.handleInputChangeshowday} 
                                />
                                <span style={{marginRight:"10px", fontSize:"14px"}}>
                                     Don't show for a day
                                </span>
                     <button class="button-notice" 
                        onClick={this.closepopup}
                        disabled={this.state.disableButton}
                        style={{backgroundColor: this.state.statebackgroundcolor}}>I understand</button>
                </form>
                
              </div>
              
            </Modal>
            <div >              
                    <Carousel indicators ={false} controls={false}>
                        <Carousel.Item interval={300}>
                            <img
                            className="d-block w-100"
                            src={bannershow1}
                            alt="First slide"
                            style={{width: "100%", height: "auto"}} 
                            />
                        </Carousel.Item>
                        <Carousel.Item interval={300}>
                            <img
                            className="d-block w-100"
                            src={bannershow2}
                            alt="Third slide"
                            style={{width: "100%", height: "auto"}} 
                            />
                        </Carousel.Item>
                        <Carousel.Item interval={300}>
                            <img
                            className="d-block w-100"
                            src={bannershow3}
                            alt="Third slide"
                            style={{width: "100%", height: "auto"}} 
                            />
                        </Carousel.Item>
                    </Carousel>
                <div className="main-stake">
                    <p className="header-tittle"><b>Pool Farm</b></p>                  
                    <Row>
                    {showlistpool}
                    </Row>  
                        <table className="ulprevandnext">
                            <tr>
                            <th><button className="buttonprevandnext" disabled={this.props.disableButtonPrev} onClick={this.props.prev}>Prev</button></th>
                            <th><button className="buttonprevandnext" onClick={this.props.next}>Next</button></th>
                            </tr>
                        </table>

                        <div>
                        
                            <br></br>
                            <img src={comment1} width="100%" height="auto"/>
                            <img src={comment2} width="100%" height="auto"/>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            
                        </div>
                </div>
                <div className="main-img-mobile">
                         <div className="mobile-app">
                            <h3 className="h3-mobile">AZstake Mobile App</h3>
                            <p className="p-mobile">Easy and Quick access on Mobile</p>
                           <div className="app-azstake-link-group">
                               <a class="app-azstake-link  outline-app">
                                   Google Play
                               </a>
                                <a class="app-azstake-link outline-app">
                                    App Store
                                </a>                              
                            </div>
                        </div>
                </div>
                <Footer/>
             </div>
             </>
        )
    }
}