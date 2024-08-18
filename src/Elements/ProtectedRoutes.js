import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/api';

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;