import React from 'react';
import logo from './logo.svg';
import './MapContent.css';

class MapContent extends React.Component {

  render() {
    return (
    <div className="Map-Content">
      <div>
        TODO: populate the list of activities
      </div>
      
      <header className="App-header2">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>)
  }

  constructor(props: any) {
    super(props);
  }
}

export default MapContent;
