import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import TreeView from "./TreeView";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </div>
                <div style={{marginTop: "100px"}}>
                    <TreeView/>
                </div>
            </div>
        );
    }
}

export default App;
