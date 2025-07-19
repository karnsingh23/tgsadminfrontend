// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress,
  InputAdornment,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminimg from "../assets/adminimg.png";

export default function Login({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post('https://tgsadminbackend.onrender.com/admin/login', { 
        username, 
        password 
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.grey[100],
        p: isMobile ? 2 : 0
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: '900px',
          mx: 'auto',
          minHeight: isMobile ? 'auto' : '600px',
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        {/* Left side - Image/Graphics */}
        <Box
          sx={{
            width: { xs: '100%', md: '45%' },
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${adminimg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#fff'
          }}
        >
          <Typography variant="h3" fontWeight={600} gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Admin Login Portal
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Secure access to your administration dashboard
            </Typography>
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box
          sx={{
            width: { xs: '100%', md: '55%' },
            p: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#fff'
          }}
        >
          {onClose && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={onClose} sx={{ mb: 1 }}>
                {/* <CloseIcon /> */}
              </IconButton>
            </Box>
          )}

          <Typography variant="h4" fontWeight={600} gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please enter your credentials to access the dashboard
          </Typography>

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              InputProps={{
                style: {
                  borderRadius: '8px'
                }
              }}
            />
            
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 1 }}
              InputProps={{
                style: {
                  borderRadius: '8px'
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Forgot your password?{' '}
              <Button
                variant="text"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Reset here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}