import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'buyer'
  });
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2
          }}
        >
          <Box
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              p: 2,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <PersonAddOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Register for GemRealty
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Registration successful! Redirecting to login...
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              disabled={status === 'loading' || success}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'loading' || success}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={status === 'loading' || success}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
                disabled={status === 'loading' || success}
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={status === 'loading' || success || !formData.username || !formData.password || !formData.email}
            >
              {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
