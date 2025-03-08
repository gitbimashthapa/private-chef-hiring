import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ClientRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  
  return isAuthenticated && user && user.role === 'client' ? 
    children : 
    <Navigate to="/login" />;
};

export default ClientRoute;