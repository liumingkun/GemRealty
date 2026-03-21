import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Divider, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleEditProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
          <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
          </Box>
          GemRealty
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: '5px' }}
            >
              <Box sx={{ px: 2, py: 1.5, minWidth: 150 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button variant="contained" onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};


export default Header;
