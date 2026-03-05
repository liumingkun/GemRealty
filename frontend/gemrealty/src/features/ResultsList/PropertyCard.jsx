import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Box } from '@mui/material';

const PropertyCard = ({ property }) => {
  return (
    <Card sx={{ width: '100%', mb: 2, display: 'flex' }}>
      <CardMedia
        component="img"
        sx={{ width: 140 }}
        image={property.image_url || 'https://via.placeholder.com/300x140'}
        alt={property.address}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 1.5 }}>
          <Typography variant="h6" color="primary">
            {property.price}
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
