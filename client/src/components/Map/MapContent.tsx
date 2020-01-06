import React from 'react';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'
import { Map, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { IDataPointService, DataPointService, IDataPoint } from '../../services/DataPointService';

interface MapContentProps {
  activities: IActivityItem[];
  apiKey: string;
  google: any;
}

interface MapContentState {
  selectedActivityId: number;
  dataPoints: IDataPoint[];
}

class MapContent extends React.Component<MapContentProps, MapContentState> {

  public async showOnMap(activityId: number) : Promise<void> {
    const dataPoints = await this.dataPointService.getDataPoints(activityId);
    this.setState({ selectedActivityId: activityId, dataPoints: dataPoints });
  }

  render() {

    let lineCoords : any[] = [];
    if (this.state && this.state.dataPoints) {
      const sortedPoints = this.state.dataPoints.sort((x : IDataPoint, y: IDataPoint) => {
        if (x.epochTime < y.epochTime) return -1;
        if (x.epochTime > y.epochTime) return 1;
        return 0;
      });

      for(const p of sortedPoints) {
        lineCoords.push({ lat: p.latitude, lng: p.longitude});
      }
    }

    return (
    <div className="Map-Content">
      <div className="Activity-List">
        <ActivityList showOnMap={x => this.showOnMap(x)} activities={this.props.activities} />
      </div>
      <div>
        <Map 
          google={this.props.google}
          zoom={14}
          
        >
          <Polyline
            paths={lineCoords}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2} />
          </Map>
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