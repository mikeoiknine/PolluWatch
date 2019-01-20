import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";

import { makeWeightedLocation, LatLng } from '../utils'


const API_KEY = 'AIzaSyAh5E9VIaCYVQwt1Gwa4dDMGZ9KG4n_5v8'

const MapComponent = compose(
  withProps({
    googleMapURL:
      `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=visualization,geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  console.log('Raw data', props.data)
  const data = props.data.map(d => makeWeightedLocation(d.lat, d.lng, d.weight));
  const mapCenter = data.length ? data[data.length - 1].location : {lat: 45, lng: -73};
  const options = props.options;
  console.log('Heatmap data:', data);
  console.log('Heatmap radius:', options.radius);
  return <GoogleMap
    ref={props.setMap}
    defaultZoom={15}
    center={mapCenter}
    onZoomChanged={props.onZoomChanged}
  >
    <HeatmapLayer
      data={data}
      options={options}
    />
    {React.Children.toArray(
      props.data.map(m => <Marker position={m} onClick={() => props.onMarkerClick(m)} />))}
    {props.children}
  </GoogleMap>
});

export default MapComponent
