import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setMapView, setSelectedPropertyId } from '../../store/slices/searchSlice';

const PropertyCard = ({ property, index }) => {
  const dispatch = useDispatch();

  const handleCardClick = () => {
    if (property.latitude && property.longitude) {
      dispatch(setMapView({
        center: { lat: property.latitude, lng: property.longitude },
        zoom: 16
      }));
      dispatch(setSelectedPropertyId(property.id));
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: '100%',
        mb: 2,
        display: 'flex',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 1.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            {index ? `#${index} - ` : ''} {property.id}
          </Typography>
          <Typography variant="h6" color="primary">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(property.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {property.address}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {property.bedrooms} Bed | {property.bathrooms} Bath
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 0.5 }}>
          <Button size="small">Details</Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default PropertyCard;
