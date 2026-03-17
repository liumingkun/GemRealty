import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GemRealty
        </Typography>
        <Button color="inherit" onClick={handleAuthClick}>
          {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
