import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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
  const mapRef = React.useRef(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

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
        height: '100%',
        '& .gm-style-iw-c button': { display: 'none !important' },
        '& .gm-ui-hover-effect': { display: 'none !important' }
      }}
    >
      <GlobalStyles
        styles={{
          '.gm-style-iw-c button[title="Close"]': { display: 'none !important' },
          '.gm-style-iw-c .gm-ui-hover-effect': { display: 'none !important' },
          'button.gm-ui-hover-effect': { display: 'none !important' }
        }}
      />
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapView.center || defaultCenter}
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
                    <Typography variant="caption" color="text.secondary">
                      {property.bedrooms} Bed | {property.bathrooms} Bath
                    </Typography>
                  </Box>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapView;
