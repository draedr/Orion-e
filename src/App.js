import {observer} from 'mobx-react-lite'
import React, {useContext} from 'react';

import { ServerContext } from './observables/Server';
import Controls from './components/Controls';
import { LocationMap } from './components/Map';
import './styles/App.css';

import 'mapbox-gl/dist/mapbox-gl.css';

const App = observer(() => {
    const server = useContext(ServerContext);
    return (
      <div className="App">
        <LocationMap/>
        <Controls />
      </div>
  )});

export default App;
