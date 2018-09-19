import React, { Component } from 'react';

import Viewer from '../containers/viewer';
import ControlPanel from './control_panel';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Viewer />
        <ControlPanel />        
      </div>
    );
  }
}
