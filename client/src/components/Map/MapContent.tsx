import React from 'react';
import './MapContent.css';
import { IActivityItem } from '../../services/ActivityService';
import { ActivityList } from '../ActivityList/ActivityList'
import { Map, GoogleApiWrapper, Polyline, Marker, Polygon } from 'google-maps-react';
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

    let lineCoords : google.maps.LatLngLiteral[] = [];
    let bounds = new this.props.google.maps.LatLngBounds();
    const act = new ActivityData(this.state.dataPoints);
      
    for(const p of act.orderedPoints) {
      lineCoords.push({ lat: +p.latitude, lng: +p.longitude});
    }

    const actBounds = act.getActivityBounds();
    bounds.extend({ lat: actBounds.topLeft.latitude, lng: actBounds.topLeft.longitude });
    bounds.extend({ lat: actBounds.topRight.latitude, lng: actBounds.topRight.longitude });
    bounds.extend({ lat: actBounds.bottomLeft.latitude, lng: actBounds.bottomLeft.longitude });
    bounds.extend({ lat: actBounds.bottomRight.latitude, lng: actBounds.bottomRight.longitude });

    console.log(`BOUNDS: ${JSON.stringify(actBounds)}`);
    console.log(`START: ${JSON.stringify(act.theStart)}`);
    console.log(`END: ${JSON.stringify(act.theEnd)}`);

    console.log(`LINE: ${JSON.stringify(lineCoords)}`)
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
    name={'Top Left'}
    title={'Top Left'}
    position={{lat: actBounds.topLeft.latitude, lng: actBounds.topLeft.longitude}} />
  <Marker />
<Marker
    name={'Top Right'}
    title={'Top Right'}
    position={{lat: actBounds.topRight.latitude, lng: actBounds.topRight.longitude}} />
  <Marker />
<Marker
    name={'Bottom Left'}
    title={'Bottom Left'}
    position={{lat: actBounds.bottomLeft.latitude, lng: actBounds.bottomLeft.longitude}} />
  <Marker />
<Marker
    name={'Bottom Right'}    
    title={'Bottom Right'}
    position={{lat: actBounds.bottomRight.latitude, lng: actBounds.bottomRight.longitude}} />
  <Marker /> */}

 <Marker
    name={'Begin'} 
    title={'Begin'}
    position={{lat: act.theStart.latitude, lng: act.theStart.latitude}} />
  <Marker />

  <Marker
    name={'End'}
    title={'End'}
    position={{lat: act.theEnd.latitude, lng: act.theEnd.longitude}} />
  <Marker /> 

         <Polygon

          paths={lineCoords}
          fillOpacity={0.0}
          strokeColor="#0000FF"
          strokeOpacity={1}
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