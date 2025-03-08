import React, { useState, useEffect } from 'react';
import { getChefBookings, updateBookingStatus } from '../services/api';

const ChefBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getChefBookings();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching bookings. Please try again.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'confirmed');
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
    } catch (err) {
      setError('Error accepting booking. Please try again.');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'rejected');
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'rejected' } : booking
      ));
    } catch (err) {
      setError('Error rejecting booking. Please try again.');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'completed');
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'completed' } : booking
      ));
    } catch (err) {
      setError('Error completing booking. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'confirmed':
        return 'badge bg-success';
      case 'completed':
        return 'badge bg-info';
      case 'cancelled':
        return