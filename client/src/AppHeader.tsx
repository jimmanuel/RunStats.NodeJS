import React from 'react';
import './AppHeader.css';

class AppHeader extends React.Component {

    private async importFiles() : Promise<void> {
      alert('hello there');
    }
  
    render() {
      return (
      <div className="App-header">
        <div>
          <h2>RunStats.JS</h2>
        </div>
        <div className="Button-Table">
          <div className="Button-container">
            <button className="Import-button" onClick={() => this.importFiles()}>Import File(s)</button>
          </div>
        </div>
      </div>)
    }
  
    constructor(props: any) {
      super(props);
    }
  }
  
  export default AppHeader;