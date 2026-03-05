import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 43.6532,
  lng: -79.3832,
};

const MapView = () => {
  const { results, mapView } = useSelector((state) => state.search);
  const mapRef = React.useRef(null);

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapView.center || defaultCenter}
          zoom={mapView.zoom || 12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {results.map((property) => (
            <Marker
              key={property.id}
              position={{
                lat: property.latitude,
                lng: property.longitude,
              }}
              title={property.address}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapView;
