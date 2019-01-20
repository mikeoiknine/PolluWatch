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
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const Location = LatLng();
  return <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 37.782551, lng: -122.445368 }}
  >
    <HeatmapLayer
      data={[
        makeWeightedLocation(37.782551, -122.445368, 150),
        makeWeightedLocation(37.782745, -122.444586, 10),
        makeWeightedLocation(37.782842, -122.443688, 10),
        makeWeightedLocation(37.782919, -122.442815, 10),
        makeWeightedLocation(37.782992, -122.442112, 10),
        makeWeightedLocation(37.783100, -122.441461, 10)
      ]}
      options={{
        radius: 100
      }}
    />
  </GoogleMap>
});

export default MapComponent
