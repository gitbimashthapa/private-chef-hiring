// hooks/useBookings.js
import { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../services/apiService';
import { useAuth } from './useAuth';

const useBookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated, refreshTrigger]);
  
  const refreshBookings = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleCancelBooking = async (id, reason) => {
    try {
      setLoading(true);
      await cancelBooking(id, reason);
      
      // Update the local bookings state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id 
            ? { ...booking, status: 'cancelled', cancelReason: reason } 
            : booking
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Get bookings by status
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };
  
  // Get upcoming bookings (those in the future with active status)
  const getUpcomingBookings = () => {
    const now = new Date().getTime();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date).getTime();
      return bookingDate > now && ['pending', 'confirmed'].includes(booking.status);
    });
  };
  
  // Get past bookings (those in the past or with completed/cancelled status)
  const getPastBookings = () => {
    const now = new Date().getTime();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date).getTime();
      return bookingDate < now || ['completed', 'cancelled'].includes(booking.status);
    });
  };
  
  return {
    bookings,
    loading,
    error,
    refreshBookings,
    handleCancelBooking,
    getBookingsByStatus,
    getUpcomingBookings,
    getPastBookings
  };
};

export default useBookings;