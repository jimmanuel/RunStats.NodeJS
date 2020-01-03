import React from 'react';
import logo from './../../logo.svg';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'

interface MapContentProps {
  activities: IActivityItem[];
}

class MapContent extends React.Component<MapContentProps, any> {

  render() {
    return (
    <div className="Map-Content">
      <ActivityList activities={this.props.activities} />
      
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
