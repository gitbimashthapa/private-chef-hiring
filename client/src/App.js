// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChefList from './pages/ChefList';
import ChefDetail from './pages/ChefDetail';
import ChefProfile from './pages/ChefProfile';
import Bookings from './pages/Bookings';
import PrivateRoute from './components/routing/PrivateRoute';
import ChefRoute from './components/routing/ChefRoute';
import ClientRoute from './components/routing/ClientRoute';
import AdminRoute from './components/routing/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import ChefBooking from './pages/chefbooking'; // Import ChefBooking component
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chefs" element={<ChefList />} />
            <Route path="/chefs/:id" element={<ChefDetail />} />
            <Route path="/chefbooking/:id" element={<ChefBooking />} /> {/* Add ChefBooking route */}
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/bookings" element={<ClientRoute><Bookings /></ClientRoute>} />
            <Route path="/chef-profile" element={<ChefRoute><ChefProfile /></ChefRoute>} />
            <Route path="/chef-bookings" element={<ChefRoute><Bookings /></ChefRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;