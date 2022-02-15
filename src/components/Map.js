import React, { useContext, useState, useEffect } from 'react';
import { ServerContext } from './../observables/Server';
import { observer } from 'mobx-react-lite'
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';

import { Map } from '@esri/react-arcgis';
import { loadArcGISModules } from '@deck.gl/arcgis';
import moment from 'moment';

const getScatterplotLayer = (data) => {
  console.log("Rendering Scatterplot Layer");
  return new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: data,
    pickable: true,
    opacity: 0.8,
    stroked: false,
    filled: true,
    radiusScale: 10,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => [59, 149, 204, 130],
    getLineColor: d => [0, 0, 0, 0]
  })
}

const getHeatmapLayer = (data) => {
  console.log("Rendering Heatmap Layer");
  return new HeatmapLayer({
    id: 'heatmap-layer',
    data: data,
    radiusPixels: 30,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => moment(d.fixTime).unix(),
    aggregation: 'SUM',
    colorRange: [
      [241,238,246,255],
      [208,209,230,255],
      [166,189,219,255],
      [116,169,207,255],
      [43,140,190,255],
      [4,90,141,255]
    ]
  });
}

const getLinesLayer = (data) => {
  console.log("Rendering Lines Layer");
  return new LineLayer({
    id: 'line-layer',
    data,
    getWidth: 2,
    getSourcePosition: d => [d.source.longitude, d.source.latitude],
    getTargetPosition: d => [d.target.longitude, d.target.latitude],
    getColor: d => {
      const z = d.start[2];
      const r = z / 10000;
    
      return [255 * (1 - r * 2), 128 * r, 255 * r, 255 * (1 - r)];
    }    
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
      var compiled = server.positions.map((currentValue, currentIndex) => {
        if( currentIndex < server.positions.length )
          return {
            source: server.positions[currentIndex],
            target: server.positions[currentIndex + 1]
          }
      });

      compiled.pop();
      layers = [ getLinesLayer(compiled) ];
      break;
    default:
      layers = [ getScatterplotLayer(server.positions) ];
      break;
  }

  return (
    <Map
      key="map-arcgis"
      mapProperties={{ basemap: 'dark-gray-vector' }}
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