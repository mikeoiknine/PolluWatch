import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import HeatMap from './components/heatmap'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="map-container">
          <HeatMap />
        </div>
      </div>
    );
  }
}

export default App;
