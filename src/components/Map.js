import React, { useContext, useState, useEffect } from 'react';
import { ServerContext } from './../observables/Server';
import { observer } from 'mobx-react-lite'
import { ScatterplotLayer } from '@deck.gl/layers';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {TripsLayer} from '@deck.gl/geo-layers';

import { Map } from '@esri/react-arcgis';
import { loadArcGISModules } from '@deck.gl/arcgis';
import moment from 'moment';

import { Settings } from './../settings';
import colors from './../styles/plotColors.json';

const getColors = () => {
  if(Settings.theme)
    return colors[Settings.theme];
  else
    return colors["heatmap"];
}

const getScatterplotLayer = (data) => {
  return new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: data,
    pickable: true,
    opacity: 0.8,
    stroked: false,
    filled: true,
    radiusScale: 10,
    radiusMinPixels: 10,
    radiusMaxPixels: 100,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => getColors()[4],
    getLineColor: d => [0, 0, 0, 0]
  })
}

const getHeatmapLayer = (data) => {
  return new HeatmapLayer({
    id: 'heatmap-layer',
    data: data,
    radiusPixels: 30,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => moment(d.fixTime).unix(),
    aggregation: 'SUM',
    colorRange: getColors()
  });
}

const getLinesLayer = (data, startDate) => {
  return new TripsLayer({
    id: 'trips-layer',
    data,
    getPath: d => d.waypoints.map(p => [p.longitude, p.latitude]),
    // deduct start timestamp from each data point to avoid overflow
    getTimestamps: d => d.waypoints.map(p => moment(p.fixTime).unix() - startDate ),
    getColor: getColors()[4],
    widthMinPixels: 3,
    fadeTrail: false,
    trailLength: 200,
    capRounded: true,
    jointRounded: true,
    currentTime: moment().unix() - startDate
  });

  
}

export const LocationMap = observer(() => {
  const server = useContext(ServerContext);
  const DeckGLLayer = (props) => {
    const [layer, setLayer] = useState(null);

    useEffect(() => {
      let deckLayer;
      loadArcGISModules().then(({ DeckLayer }) => {
        deckLayer = new DeckLayer({});
        setLayer(deckLayer);
        props.map.add(deckLayer);
      });

      // clean up
      return () => deckLayer && props.map.remove(deckLayer);
    }, []);

    if (layer) {
      layer.deck.set(props);
    }

    return null;
  }

  var layers = [];

  switch(server.plotType) {
    case 1:
      layers = [ getHeatmapLayer(server.positions) ];
      break;
    case 2:
      var compiled = [{
        waypoints: []
      }]
      
      for(var i = 0; i < server.positions.length; i++) {
        if( i !== 0 ) {
          if( !moment(server.positions[i].fixTime).isSame(moment(compiled[compiled.length -1].waypoints.fixTime), 'date')) {
            compiled.push({ waypoints: [] });
          }
        }
        compiled[compiled.length -1].waypoints.push({...server.positions[i]});
      }
      layers = [ getLinesLayer(compiled, moment(server.startDate).unix() ) ];
      break;
    default:
      layers = [ getScatterplotLayer(server.positions) ];
      break;
  }

  return (
    <Map
      key="map-arcgis"
      mapProperties={{ 
        basemap: 'dark-gray-vector'
      }}
      viewProperties={{
        center: [10.4496693, 44.7013056],
        zoom: 14
      }}
    >
      <DeckGLLayer
        key="deck-gl-layer"
        layers={layers}
      />
    </Map>
  );
});