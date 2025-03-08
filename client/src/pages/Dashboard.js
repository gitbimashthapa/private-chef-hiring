import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Render based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'client':
        return (
          <div>
            <h2>Client Dashboard</h2>
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Find a Chef</h5>
                    <p className="card-text">
                      Browse our selection of professional chefs and book your next dining experience.
                    </p>
                    <Link to="/chefs" className="btn btn-primary">
                      Browse Chefs
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">My Bookings</h5>
                    <p className="card-text">
                      View and manage your current and past chef bookings.
                    </p>
                    <Link to="/bookings" className="btn btn-info">
                      View Bookings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chef':
        return (
          <div>
            <h2>Chef Dashboard</h2>
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">My Profile</h5>
                    <p className="card-text">
                      Update your chef profile, skills, and availability.
                    </p>
                    <Link to="/chef-profile" className="btn btn-primary">
                      Manage Profile
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Booking Requests</h5>
                    <p className="card-text">
                      View and manage your booking requests from clients.
                    </p>
                    <Link to="/chef-bookings" className="btn btn-info">
                      View Bookings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div>
            <h2>Admin Dashboard</h2>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Admin Controls</h5>
                    <p className="card-text">
                      Manage chef profiles, users, and bookings.
                    </p>
                    <Link to="/admin" className="btn btn-primary">
                      Admin Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="welcome-card mb-4">
            <h1>Welcome, {user && user.name}</h1>
            <p className="lead">
              This is your personal dashboard where you can manage your account.
            </p>
          </div>
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;