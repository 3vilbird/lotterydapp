import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  // ecma script 26 format for constructor.. 
    state = { account: "", 
              manager:"" ,
              players:[],
              balance:"",
              value:"",
              message:''           
            
            };
  

  componentWillMount() {
    this.loadblock();
  }
  
  async componentDidMount(){
    const manager = await lottery .methods.manager().call();
    const players = await lottery .methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager,players,balance});
  }

  async loadblock() {
    //const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    console.log("fucking working......");
    const network = await web3.eth.net.getNetworkType();
    const accounts = await web3.eth.getAccounts();
    console.log(network);
    console.log(accounts[0]);
    this.setState({ account: accounts[0] });

    // fetch accounts
  }

  onSubmit = async (event)=>{
    event.preventDefault();

    const accounts= await web3.eth.getAccounts();
    this.setState({message:'waiting on transaction success..........!'});

    await lottery.methods.enter().send({
      from :accounts[0],
      value:web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:'you have been entered...!'});
  };

  onClick = async() =>{
    const accounts = await web3.eth.getAccounts();
    this.setState({message:'waiting on transaction success..........!'});

    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });
    this.setState({message:'winner has been piked..........!'});


  };
  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
         
          <h2>a lottery contract </h2>         
          
          <p>your account is :{this.state.account}</p>
                   
          <p> this contract is managed by :- {this.state.manager}</p>

          <p>there are currently {this.state.players.length} number of people entered compiting to win
           {web3.utils.fromWei(this.state.balance,'ether')} ether</p>
        
        <hr />
        <form onSubmit={this.onSubmit} >
          <h4>try your' luck</h4>
          <div>
            <label>amount of ether to enter</label>
            <input
            value= {this.state.value}
            onChange={event=>this.setState({value:event.target.value})}            
            />         
            <button>Enter into the contract</button>
          
          </div>
        
        </form>
        <hr/>
        <h4>Ready to pick winner??</h4>
        <button  onClick={this.onClick}>pick a  winner.!</button>

        <hr/>
        <h1>{this.state.message}</h1>
        </header>
      </div>
    );
  }
}
export default App;
