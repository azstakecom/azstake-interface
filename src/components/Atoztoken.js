import React, {Component} from 'react';
import Web3 from 'web3'
import Footer from '../components/Footer'
import atoztoken from '../assets/atoz-token.jpg'
export default class Setwallet extends Component {
    render() {
        return(
            <div>
                {/* <iframe src={azstakev1} height="1000px" width="100%">
                </iframe> */}
                <img src={atoztoken} width="100%" height="auto"/>
               <Footer />
            </div>
        )
    }
}