// src/pages/Profile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Your Profile</h1>
      {/* Add your user info here if needed */}
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
