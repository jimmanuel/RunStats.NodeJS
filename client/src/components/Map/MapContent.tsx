import React from 'react';
import logo from './../../logo.svg';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'
import { Map, GoogleApiWrapper } from 'google-maps-react';

interface MapContentProps {
  activities: IActivityItem[];
  apiKey: string;
  google: any;
}

class MapContent extends React.Component<MapContentProps, any> {

  render() {

    return (
    <div className="Map-Content">
      <ActivityList activities={this.props.activities} />
      
      <Map
        google={this.props.google}
        zoom={14}
        initialCenter={{
         lat: -1.2884,
         lng: 36.8233
        }}
      />
    </div>)
  }

  constructor(props: any) {
    super(props);
  }
}

//export default MapContent;
export default GoogleApiWrapper(
  (props) => ({
    apiKey: props.apiKey
  }
))(MapContent)