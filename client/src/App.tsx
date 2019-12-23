import React from 'react';
import AppHeader from './components/HeaderBar/AppHeader';
import MapContent from './components/Map/MapContent';
import './App.css';

class App extends React.Component {

  render() {
    return (
    <div >
      <AppHeader />

      <MapContent />
    </div>)
  }

  constructor(props: any) {
    super(props);
  }
}

export default App;
