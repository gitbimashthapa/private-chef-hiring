// client/src/pages/chefbooking.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './chefbooking.css';

const ChefBooking = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const response = await axios.get(`/api/chefs/${id}`);
        setChef(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChef();
  }, [id]);

  const handleBooking = async () => {
    try {
      const response = await axios.post(`/api/bookings`, { chefId: id });
      setBookingStatus(response.data.status);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="chef-booking">
      <h1>Book Chef {chef.name}</h1>
      <p>{chef.description}</p>
      <button onClick={handleBooking}>Book Now</button>
      {bookingStatus && <p>Booking Status: {bookingStatus}</p>}
    </div>
  );
};

export default ChefBooking;