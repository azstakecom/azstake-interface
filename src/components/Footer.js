import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';
import '../css/App.css'
import { WEB} from '../constants'
export default class Footer extends Component {
    render() {
        return(
            <div class="footer">
            <div class="main-footer">
                <nav className="navbar navbar-expand-sm  navbar-default header">
                    <div class="ul-footer">
                    <table className="table-footer">
                            <tr>
                                <th><a href="https://www.notion.so/deaf600d88f947be94afa0f8c2e469ac?v=35f6676e8b674557a475386c6a8c6fdc" target="_blank">Wiki</a></th>
                                <th><a href={WEB + "introduction"}>Introduction</a></th>
                                <th><a href={WEB + "notice"}>Notice</a></th>
                                <th><a href="https://t.me/azstake" target="_blank">Telegram</a></th>
                                <th><a href="https://medium.com/@azstakegroup" target="_blank">Medium</a></th>
                                <th><a href="https://twitter.com/az_stake" target="_blank">Twitter</a></th>
                                <th><a href="" target="_blank">Github</a></th>
                                <th> <a href="" target="_blank">contact@azstake.com</a></th>                     
                            </tr>
                    </table>
                    <div className="table-footer-mobile">
                        <Row>
                            <Col xs={4}>
                                <a href="https://www.notion.so/deaf600d88f947be94afa0f8c2e469ac?v=35f6676e8b674557a475386c6a8c6fdc" target="_blank">Wiki</a>     
                            </Col>
                            <Col xs={4}>
                                <a href={WEB + "introduction"}>Introduction</a>     
                            </Col>
                            <Col xs={4}>
                                <a href={WEB + "notice"}>Notice</a>     
                            </Col>
                            <Col xs={4}>
                                 <a href="https://t.me/azstake" target="_blank">Telegram</a>     
                            </Col>
                            <Col xs={4}>
                                <a href="https://medium.com/@azstakegroup" target="_blank">Medium</a>     
                            </Col>
                            <Col xs={4}>
                              <a href="https://twitter.com/az_stake" target="_blank">Twitter</a>    
                            </Col>
                            <Col xs={4}>
                                 <a href="" target="_blank">Github</a>     
                            </Col>
                            <Col xs={12}>
                                <a href="" target="_blank">contact@azstake.com</a>    
                            </Col>
                        </Row>
                    </div>
                    </div>
                </nav>
            </div>
            <div class="copyright">
                    Copyright© 2020 Azstake.com. All rights reserved.
            </div>
            </div>
        )
    }
}