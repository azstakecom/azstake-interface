import React, {Component} from 'react';
import comingsoon from '../assets/comingsoon.jpg'
import Footer from '../components/Footer'
import {  Modal} from 'react-bootstrap';
export default class Tfinance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: true
        }
        this.close = this.close.bind(this);
    }
    close() {this.setState({ showModal: false });}
    render(){
        return(
            <>
            <Modal show={this.state.showModal} onHide={this.close} >
                <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                        <h3 className="h3-notice">
                        Beyond the limits of Crypto STAKE service.
                        </h3>
                        </Modal.Title>
                </Modal.Header>
                <div className="popup-assetinfo">
                    Projects that require all funds, such as real estate, art, investment, and entrepreneurship, can be STAKED by customers from all around the world via T.Finance platform.
                </div>              
            </Modal>
            <div>
                <img src={comingsoon} width="100%" height="auto"/>
                <Footer/>
            </div>
            </>
        )
    }
}