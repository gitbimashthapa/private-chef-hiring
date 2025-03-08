import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link to="/register" className="nav-link">Register</Link>
      </li>
      <li className="nav-item">
        <Link to="/login" className="nav-link">Login</Link>
      </li>
    </>
  );

  const authLinks = (
    <>
      {user && user.role === 'client' && (
        <li className="nav-item">
          <Link to="/bookings" className="nav-link">My Bookings</Link>
        </li>
      )}
      {user && user.role === 'chef' && (
        <>
          <li className="nav-item">
            <Link to="/chef-profile" className="nav-link">My Profile</Link>
          </li>
          <li className="nav-item">
            <Link to="/chef-bookings" className="nav-link">Bookings</Link>
          </li>
        </>
      )}
      {user && user.role === 'admin' && (
        <li className="nav-item">
          <Link to="/admin" className="nav-link">Admin Dashboard</Link>
        </li>
      )}
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </li>
      <li className="nav-item">
        <a href="#!" onClick={handleLogout} className="nav-link">Logout</a>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">Private Chef Hiring</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/chefs" className="nav-link">Find a Chef</Link>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;