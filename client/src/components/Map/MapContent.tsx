import React from 'react';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'
import { Map, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { IDataPointService, DataPointService, IDataPoint } from '../../services/DataPointService';
import { ActivityData } from '../../models/ActivityData';

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
    let bounds = new this.props.google.maps.LatLngBounds();
    if (this.state && this.state.dataPoints) {
      const act = new ActivityData(this.state.dataPoints);
      
      const sortedPoints = this.state.dataPoints.sort((x : IDataPoint, y: IDataPoint) => {
        if (x.epochTime < y.epochTime) return -1;
        if (x.epochTime > y.epochTime) return 1;
        return 0;
      });

      for(const p of sortedPoints) {
        lineCoords.push({ lat: p.latitude, lng: p.longitude});
      }

      const actBounds = act.getActivityBounds();
      console.log(JSON.stringify(actBounds));
      bounds.extend({ lat: actBounds.topLeft.latitude, lng: actBounds.topLeft.longitude });
      bounds.extend({ lat: actBounds.topRight.latitude, lng: actBounds.topRight.longitude });
      bounds.extend({ lat: actBounds.bottomRight.latitude, lng: actBounds.bottomRight.longitude });
      bounds.extend({ lat: actBounds.bottomLeft.latitude, lng: actBounds.bottomLeft.longitude });

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
          bounds={bounds}
        >

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