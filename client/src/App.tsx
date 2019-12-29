import React from 'react';
import AppHeader from './components/HeaderBar/AppHeader';
import MapContent from './components/Map/MapContent';
import './App.css';
import { ActivityService, IActivityService, IActivityItem } from './services/ActivityService';

interface AppState {
  activities: IActivityItem[];
}

class App extends React.Component<any, AppState> {

  async refresh() : Promise<void> {
    const acts = await this.activityService.getAllActivities();
    this.setState( { activities: acts });
  }

  render() {

    let acts : IActivityItem[] = [];
    if (this.state) {
      acts = this.state.activities;
    }

    return (
    <div >
      <AppHeader invokeRefresh={() => this.refresh()}/>

      <MapContent activities={acts}/>
    </div>)
  }

  private readonly activityService : IActivityService = new ActivityService();
  constructor(props: any) {
    super(props);
    this.setState({activities: []});
    this.refresh();
  }
}

export default App;
