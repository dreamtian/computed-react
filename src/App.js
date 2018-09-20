import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {computedWrap} from './computed-react';
@computedWrap()
class App extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      num: 1,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }
    // 被computedWrap的组件可以定义__computed属性
    this.__computed = {
      getTextNum(num) {
        console.log('num is change')
        return num * 2
      }
    }
  }
  changeNum = () => {
    this.setState({
      num: this.state.num + 1
    })
  }
  changeColor = () => {
    this.setState({
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    })
  }
  render() {
    const {getTextNum} = this.__computed
    const {num, color} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p style={{color}}>{getTextNum(num)}</p>
        <button onClick={this.changeNum}>
          change-number
        </button>
        <button onClick={this.changeColor}>
          change-color
        </button>
      </div>
    );
  }
}

export default App;
