import React from 'react';
import logo from './../../logo.svg';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';

interface MapContentState {
  activities: IActivityItem[];
}

class MapContent extends React.Component<MapContentState, any> {

  render() {
    return (
    <div className="Map-Content">
      <div>
        TODO: populate the list of activities ({this.props.activities.length})
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
    this.setState({activities: []});
  }
}

export default MapContent;
