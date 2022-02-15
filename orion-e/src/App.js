import {observer} from 'mobx-react-lite'
import React, {useContext} from 'react';

import { ServerContext, Server } from './observables/Server';
import Controls from './components/Controls';
import './styles/App.css';

const App = observer(() => {
    const server = useContext(ServerContext);
    return (
      <div className="App">
        <Controls />
      </div>
  )});

export default App;
