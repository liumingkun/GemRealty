import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery, performSearch } from '../../store/slices/searchSlice';
import { TextField, Button, Box } from '@mui/material';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [inputQuery, setInputQuery] = useState('');

  const handleSearch = () => {
    dispatch(setQuery(inputQuery));
    dispatch(performSearch({ query: inputQuery, conversationHistory: [] }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
      <TextField
        fullWidth
        label="Search properties"
        variant="outlined"
        value={inputQuery}
        onChange={(e) => setInputQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
