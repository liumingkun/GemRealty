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
  Link
} from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login, clearError } from '../store/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }

    // Clear any previous errors on mount
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      dispatch(login({ username, password }));
    }
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
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 2,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign in to GemRealty
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={status === 'loading'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'loading'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={status === 'loading' || !username || !password}
            >
              {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Box>
          </Box>

        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
