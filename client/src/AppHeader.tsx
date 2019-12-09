import React from 'react';
import './AppHeader.css';

class AppHeader extends React.Component {

    private async importFiles() : Promise<void> {
      alert('hello there');
    }
  
    render() {
      return (
      <div className="App-header">

        <h2>RunStats.JS</h2>
        <button className="importButton" onClick={() => this.importFiles()}>Import File(s)</button>
  
      </div>)
    }
  
    constructor(props: any) {
      super(props);
    }
  }
  
  export default AppHeader;