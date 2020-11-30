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
  showOnHeader: (description: string) => void;
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

  public showOnHeader(description: string) : void {
    this.props.showOnHeader(description);
  }

  render() {
    return <div />;
/*
    if (!this.state || !this.state.dataPoints) {

      return (
        <div className="Map-Content">
          <div className="Activity-List">
            <ActivityList showOnMap={x => this.showOnMap(x)} showOnHeader={x => this.showOnHeader(x)} activities={this.props.activities} />
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


    // const center = { 
    //   lat: actBounds.topLeft.latitude - ((actBounds.topLeft.latitude - actBounds.bottomLeft.latitude) / 2),
    //   lng: actBounds.topLeft.longitude - ((actBounds.topLeft.longitude - actBounds.topRight.longitude) / 2) };

    console.log(`BOUNDS: ${JSON.stringify(actBounds)}`);
    console.log(`START: ${JSON.stringify(act.theStart)}`);
    console.log(`END: ${JSON.stringify(act.theEnd)}`);

    console.log(`LINE: ${JSON.stringify(lineCoords)}`)
    return (
    <div className="Map-Content">
      <div className="Activity-List">
        <ActivityList showOnMap={x => this.showOnMap(x)} showOnHeader={x => this.showOnHeader(x)} activities={this.props.activities} />
      </div>
      <div>
        <Map 
          google={this.props.google}
          zoom={14}
          //initialCenter={center}
          bounds={bounds}
        >

 <Marker
    label={'Begin'} 
    title={'Begin'}
    position={{lat: act.theStart.latitude, lng: act.theStart.latitude}} />
  <Marker />

  <Marker
    label={'End'}
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
    */
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