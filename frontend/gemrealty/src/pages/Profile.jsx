import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Divider, 
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { AccountCircle, Edit, Save, Cancel, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { updateProfile, clearError } from '../store/slices/authSlice';

const Profile = () => {
  const { user, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel editing, reset form
      setFormData({
        email: user?.email || '',
        password: '',
        confirmPassword: ''
      });
      dispatch(clearError());
    }
    setIsEditing(!isEditing);
    setSuccessMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      // This is a simple client-side validation
      return; 
    }

    const updateData = {};
    if (formData.email !== user?.email) updateData.email = formData.email;
    if (formData.password) updateData.password = formData.password;

    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }

    dispatch(updateProfile(updateData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, position: 'relative' }}>
        <IconButton 
          aria-label="close"
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
              <AccountCircle sx={{ fontSize: 60 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                User Profile
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isEditing ? 'Update your account information' : 'Manage your account and preferences'}
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={isEditing ? <Cancel /> : <Edit />} 
            onClick={handleToggleEdit}
            disabled={status === 'loading'}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Username
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.disabled' }}>
                {user?.username}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Role
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Email Address
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                  sx={{ mb: 2 }}
                />
              ) : (
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {user?.email || 'Not set'}
                </Typography>
              )}

              {isEditing && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    New Password (optional)
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Confirm New Password
                  </Typography>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    size="small"
                    error={formData.password !== formData.confirmPassword}
                    helperText={formData.password !== formData.confirmPassword ? "Passwords don't match" : ""}
                  />
                </>
              )}
            </Grid>
          </Grid>
          
          {isEditing && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                startIcon={status === 'loading' ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={status === 'loading' || (formData.password && formData.password !== formData.confirmPassword)}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};


export default Profile;
