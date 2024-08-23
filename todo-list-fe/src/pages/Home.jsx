import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuthStore } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        {isAuthenticated ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {user.email}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleLogout} 
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to the Todo List App!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login')} 
              sx={{ mt: 2 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => navigate('/register')} 
              sx={{ mt: 2, ml: 2 }}
            >
              Register
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;
