import React, {Component} from 'react';
import Web3 from 'web3'
import azstakev2 from '../document/azstake-introduction-v2.pdf'
import Footer from '../components/Footer'
import atoztoken from '../assets/atoz-token.jpg'
export default class Introduction extends Component {
    render() {
        return(
            <div>
                <iframe src={azstakev2} height="1000px" width="100%">
                </iframe>
               
               <Footer />
            </div>
        )
    }
}