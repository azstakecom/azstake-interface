import React, {Component} from 'react';
import Header from './components/Header';
import './css/App.css';
import './font/ChakraPetch-Light.ttf'
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component  {   
  constructor(props) {
    super(props)
    this.state = { 
      theme: false
  }}
  async componentDidMount(){
    await this.calltheme()
  }
  async calltheme(){
    var themeazstake = localStorage.getItem("themeazstake");
    var theme= (themeazstake=='dark')? true : false;
    this.setState({theme: theme})
  }
  render() {  
  return (
    <div className={this.state.theme ? "main-home-dark": "main-home"}>
      <Header 
      />
    </div>
  );
}
}

export default App;
