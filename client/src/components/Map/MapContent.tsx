import React from 'react';
import logo from './../../logo.svg';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { IDataPointService, DataPointService } from '../../services/DataPointService';

interface MapContentProps {
  activities: IActivityItem[];
  apiKey: string;
  google: any;
}

interface MapContentState {
  selectedActivityId: number;
}

class MapContent extends React.Component<MapContentProps, MapContentState> {

  async showOnMap(activityId: number) : Promise<void> {
    //const dataPoints = await this.dataPointService.getDataPoints(activityId);

  }

  render() {

    return (
    <div className="Map-Content">
      <div className="Activity-List">
        <ActivityList showOnMap={this.showOnMap} activities={this.props.activities} />
      </div>
      <div>
        <Map 
          google={this.props.google}
          zoom={14}
          initialCenter={{ 
          lat: 38.8892955268143,
          lng: -77.0501980539345
          }}
        />
      </div>
    </div>)
  }

  private readonly dataPointService : IDataPointService = new DataPointService();
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