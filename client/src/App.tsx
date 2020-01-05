import React from 'react';
import AppHeader from './components/HeaderBar/AppHeader';
import MapContent from './components/Map/MapContent';
import './App.css';
import { ActivityService, IActivityService, IActivityItem } from './services/ActivityService';
import { IConfigService } from './services/ConfigService';

interface AppState {
  activities: IActivityItem[];
}

interface AppProps {
  configService: IConfigService;
}

class App extends React.Component<AppProps, AppState> {

  async refresh() : Promise<void> {
    const acts = await this.activityService.getAllActivities();
    this.setState( { activities: acts });
  }

  render() : JSX.Element {

    let acts : IActivityItem[] = [];
    if (this.state) {
      acts = this.state.activities;
    }

    return (
    <div >
      <AppHeader invokeRefresh={() => this.refresh()}/>

      <MapContent activities={acts} apiKey={this.props.configService.getGoogleApiKey()}/>
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
