import React, { useContext, useState, useEffect } from 'react';
import { ServerContext } from './../observables/Server';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';

import { Map } from '@esri/react-arcgis';
import { loadArcGISModules } from '@deck.gl/arcgis';
import { GeoJsonLayer, ArcLayer } from '@deck.gl/layers';

export const DeckGLLayer = (props) => {
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

export const LocationMap = () => {
  const server = useContext(ServerContext);

  const REACT_APP_MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZmVsaW5vLW5lcHR1bmUiLCJhIjoiY2t6b2E0aXc1MDk2bTJ3bGgwcDM0NmU3MiJ9.89bv9tcw5e-n39lE4ArpAA";

  const layers = [
      new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: server.positions,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => {
        console.log(d);
        return [d.longitude, d.latitude];
      },
      getFillColor: d => [0, 128, 255],
      getLineColor: d => [0, 128, 255]
    })
  ];

  return (
    <Map
      mapProperties={{ basemap: 'dark-gray-vector' }}
      viewProperties={{
        center: [10.4496693, 44.7013056],
        zoom: 14
      }}
    >
      <DeckGLLayer
        getTooltip={info => info.object && info.object.properties.name}
        layers={layers}
      />
    </Map>
  );
}