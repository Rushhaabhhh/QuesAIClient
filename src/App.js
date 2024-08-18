import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './components/HomePage/Homepage';
import EditTranscript from './components/EditTranscript/EditTranscript';
import Create from './components/Create/Create';
import AccountSettings from './components/AccountSettings/AccountSettings';
import ProtectedRoute from './Elements/ProtectedRoutes';
import AuthRoute from './Elements/AuthRoute';
import Help from './AdditionalPages/Help';
import Upgrade from './AdditionalPages/Upgrade';
import PodcastWidget from './AdditionalPages/PodcastWidget';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />

        <Route path="/homepage" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/edit-transcript/:id" element={
          <ProtectedRoute>
            <EditTranscript />
          </ProtectedRoute>
        } />

        <Route path="/create-repurpose" element={
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        } />
        <Route path="/accountSettings" element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        } />

        <Route path="/help" element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } />

        <Route path="/upgrade" element={
          <ProtectedRoute>
            <Upgrade />
          </ProtectedRoute>
        } />
        <Route path="/podcast-widget" element={
          <ProtectedRoute>
            <PodcastWidget />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router> 
  );
}

export default App;