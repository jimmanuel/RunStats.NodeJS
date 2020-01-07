import React from 'react';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'
import { Map, GoogleApiWrapper, Polyline, Marker } from 'google-maps-react';
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

    if (!this.state || !this.state.dataPoints) {

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
              </Map>
          </div>
        </div>)
    }

    let lineCoords : any[] = [];
    let bounds = new this.props.google.maps.LatLngBounds();
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

{/* <Marker
    name={'Start'}
    position={{lat: sortedPoints[0].latitude, lng: sortedPoints[0].latitude}} />
  <Marker />

  <Marker
    name={'End'}
    position={{lat: sortedPoints[sortedPoints.length-1].latitude, lng: sortedPoints[sortedPoints.length-1].longitude}} />
  <Marker /> */}

        {/* <Polyline
          paths={lineCoords}
          strokeColor="#0000FF"
          strokeOpacity={1}
          strokeWeight={2} /> */}
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