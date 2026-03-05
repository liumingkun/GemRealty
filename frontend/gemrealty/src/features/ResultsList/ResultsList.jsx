import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';
import PropertyCard from './PropertyCard';

const ResultsList = () => {
  const { results, loading, error } = useSelector((state) => state.search);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading properties...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>No properties found. Try a different search.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {results && results.length > 0 ? (
          results.map((property) => (
            <Grid item xs={12} key={property.id || Math.random()}>
              <PropertyCard property={property} />
            </Grid>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No properties available to display.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ResultsList;
