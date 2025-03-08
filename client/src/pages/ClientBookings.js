import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClientBookings, updateBookingStatus, addReview } from '../services/api';

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewBookingId, setReviewBookingId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getClientBookings();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching bookings. Please try again.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
    } catch (err) {
      setError('Error cancelling booking. Please try again.');
    }
  };

  const handleOpenReview = (bookingId) => {
    setReviewBookingId(bookingId);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleCloseReview = () => {
    setReviewBookingId(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(reviewBookingId, {
        rating: reviewRating,
        comment: reviewComment
      });
      
      setBookings(bookings.map(booking => 
        booking._id === reviewBookingId ? { ...booking, reviewed: true } : booking
      ));
      
      handleCloseReview();
    } catch (err) {
      setError('Error submitting review. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'confirmed':
        return 'badge bg-success';
      case 'completed':
        return 'badge bg-info';
      case 'cancelled':
        return 'badge bg-danger';
      case 'rejected':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  };

  if (loading) return <div className="text-center mt-5">Loading bookings...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="alert alert-info">
          You don't have any bookings yet. <Link to="/chefs">Browse chefs</Link> to make a booking.
        </div>
      ) : (
        <div className="row">
          {bookings.map(booking => (
            <div key={booking._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Booking with {booking.chef ? booking.chef.user.name : 'Unknown Chef'}
                  </h5>
                  <span className={getStatusBadgeClass(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="card-body">
                  <div className="booking-details mb-3">
                    <p>
                      <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p>
                      <strong>Duration:</strong> {booking.duration} hours
                    </p>
                    <p>
                      <strong>Guests:</strong> {booking.guestCount}
                    </p>
                    <p>
                      <strong>Cuisine:</strong> {booking.cuisineType}
                    </p>
                    {booking.specialRequests && (
                      <p>
                        <strong>Special Requests:</strong> {booking.specialRequests}
                      </p>
                    )}
                    <p>
                      <strong>Total Price:</strong> ${booking.chef ? booking.chef.hourlyRate * booking.duration : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                    
                    {booking.status === 'completed' && !booking.reviewed && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenReview(booking._id)}
                      >
                        Leave Review
                      </button>
                    )}
                    
                    <Link to={`/chefs/${booking.chef._id}`} className="btn btn-outline-primary btn-sm ms-2">
                      View Chef
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Review Modal */}
      {reviewBookingId && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Leave a Review</h5>
                <button type="button" className="btn-close" onClick={handleCloseReview}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitReview}>
                  <div className="form-group mb-3">
                    <label>Rating</label>
                    <select
                      className="form-control"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  
                  <div className="form-group mb-3">
                    <label>Comment</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCloseReview}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default ClientBookings;