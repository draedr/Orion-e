import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react';

import { ServerContext } from './observables/Server';
import Controls from './components/Controls';
import { LocationMap } from './components/Map';
import { MissingSettings } from './components/MissingSettings';
import './styles/App.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import { Settings } from './settings';

const App = observer(() => {
  const server = useContext(ServerContext);
  return (
    <div className="App">
      {Settings.connect && (
        Settings.url === '' ||
        Settings.username === '' ||
        Settings.password === ''
      ) ?
        <MissingSettings />
        : <>
            <LocationMap />
            <Controls />
          </>
      }
    </div>
  )
});

export default App;
