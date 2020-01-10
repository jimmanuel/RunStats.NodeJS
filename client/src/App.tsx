import React from 'react';
import AppHeader from './components/HeaderBar/AppHeader';
import MapContent from './components/Map/MapContent';
import './App.css';
import { ActivityService, IActivityService, IActivityItem } from './services/ActivityService';
import { IConfigService } from './services/ConfigService';

interface AppState {
  activities: IActivityItem[];
  headerDescription: string;
}

interface AppProps {
  configService: IConfigService;
}

class App extends React.Component<AppProps, AppState> {

  async refresh() : Promise<void> {
    const acts = await this.activityService.getAllActivities();
    this.setState( { activities: acts });
  }

  public showOnHeader(description: string) : void {
    this.setState({activities: this.state.activities, headerDescription: description});
  }

  render() : JSX.Element {

    let acts : IActivityItem[] = [];
    let headerDesc = '';
    if (this.state) {
      acts = this.state.activities;
      headerDesc = this.state.headerDescription;
    }

    return (
    <div >
      <AppHeader invokeRefresh={() => this.refresh()} headerDescription={headerDesc} />

      <MapContent activities={acts} showOnHeader={x => this.showOnHeader(x)} apiKey={this.props.configService.getGoogleApiKey()}/>
    </div>)
  }

  private readonly activityService : IActivityService = new ActivityService();
  constructor(props: any) {
    super(props);
    this.setState({activities: [], headerDescription: ''});
    this.refresh();
  }
}

export default App;
