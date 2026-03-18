import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { Box, Typography, GlobalStyles } from '@mui/material';

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
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });
  const mapRef = React.useRef(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

  const hoveredProperty = results.find(p => p.id === hoveredPropertyId);
  const currentCenter = hoveredProperty && hoveredProperty.latitude && hoveredProperty.longitude
    ? { lat: hoveredProperty.latitude, lng: hoveredProperty.longitude }
    : (mapView.center || defaultCenter);

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%'
      }}
    >
      <GlobalStyles
        styles={{}}
      />
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentCenter}
          zoom={mapView.zoom || 12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {results.map((property) => (
            <React.Fragment key={property.id}>
              <Marker
                position={{
                  lat: property.latitude,
                  lng: property.longitude,
                }}
                title={property.address}
                onClick={() => setHoveredPropertyId(hoveredPropertyId === property.id ? null : property.id)}
              />
              {hoveredPropertyId === property.id && (
                <InfoWindow
                  position={{
                    lat: property.latitude,
                    lng: property.longitude,
                  }}
                  options={{
                    disableAutoPan: true,
                    pixelOffset: new window.google.maps.Size(0, -35)
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      MLS # {property.id}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(property.price)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {property.bedrooms} Bed | {property.bathrooms} Bath
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Elementary: {property.elementary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Intermediate: {property.intermediate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Secondary: {property.secondary}
                    </Typography>
                  </Box>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>Loading map...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapView;
