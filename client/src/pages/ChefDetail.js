import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChefById, createBooking } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ChefDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [bookingTime, setBookingTime] = useState('18:00');
  const [duration, setDuration] = useState(3);
  const [guestCount, setGuestCount] = useState(4);
  const [specialRequests, setSpecialRequests] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        const data = await getChefById(id);
        setChef(data);
        // Set default cuisine type if chef has cuisines
        if (data.cuisine && data.cuisine.length > 0) {
          setCuisineType(data.cuisine[0]);
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching chef details. Please try again.');
        setLoading(false);
      }
    };

    fetchChefData();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/chefs/${id}` } });
      return;
    }

    try {
      setBookingError(null);
      
      // Combine date and time
      const dateTime = new Date(bookingDate);
      const [hours, minutes] = bookingTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      const bookingData = {
        chefId: id,
        date: dateTime,
        duration: duration,
        guestCount: guestCount,
        cuisineType: cuisineType,
        specialRequests: specialRequests,
      };

      await createBooking(bookingData);
      setBookingSuccess(true);
      
      // Reset form
      setBookingDate(new Date());
      setBookingTime('18:00');
      setDuration(3);
      setGuestCount(4);
      setSpecialRequests('');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    }
  };

  const handleAvailabilityCheck = () => {
    // This would typically check against the chef's availability in a real app
    return true; // Placeholder for availability check
  };

  if (loading) return <div className="text-center mt-5">Loading chef details...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!chef) return <div className="alert alert-warning mt-5">Chef not found</div>;

  const totalPrice = chef.hourlyRate * duration;

  return (
    <div className="container mt-4">
      {bookingSuccess && (
        <div className="alert alert-success">
          Booking request has been sent successfully! The chef will be notified and will respond to your request.
        </div>
      )}
      
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            {chef.profileImage ? (
              <img
                src={chef.profileImage}
                className="card-img-top"
                alt={`Chef ${chef.user ? chef.user.name : 'Unknown'}`}
              />
            ) : (
              <div className="card-img-top bg-secondary text-white d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
                <span>No Image Available</span>
              </div>
            )}
            <div className="card-body">
              <h3 className="card-title">
                {chef.user ? chef.user.name : 'Unknown Chef'}
              </h3>
              <h6 className="card-subtitle mb-3 text-muted">
                {chef.speciality}
              </h6>
              
              <div className="chef-info mb-3">
                <p>
                  <strong>Experience:</strong> {chef.experience} years
                </p>
                <p>
                  <strong>Hourly Rate:</strong> ${chef.hourlyRate}
                </p>
                <p>
                  <strong>Cuisines:</strong> {chef.cuisine ? chef.cuisine.join(', ') : 'Not specified'}
                </p>
              </div>
              
              <div className="chef-rating mb-3">
                <strong>Rating:</strong> {chef.rating ? `${chef.rating}/5` : 'Not rated yet'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">About the Chef</h4>
              <p>{chef.bio || 'No biography available for this chef.'}</p>
              
              <hr className="my-4" />
              
              <h4 className="mb-3">Book This Chef</h4>
              {bookingError && <div className="alert alert-danger">{bookingError}</div>}
              
              <form onSubmit={handleBookingSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="bookingDate">Date</label>
                      <DatePicker
                        id="bookingDate"
                        selected={bookingDate}
                        onChange={date => setBookingDate(date)}
                        minDate={new Date()}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="bookingTime">Time</label>
                      <select
                        id="bookingTime"
                        className="form-control"
                        value={bookingTime}
                        onChange={e => setBookingTime(e.target.value)}
                        required
                      >
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="20:00">8:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="duration">Duration (hours)</label>
                      <select
                        id="duration"
                        className="form-control"
                        value={duration}
                        onChange={e => setDuration(parseInt(e.target.value))}
                        required
                      >
                        <option value="2">2 hours</option>
                        <option value="3">3 hours</option>
                        <option value="4">4 hours</option>
                        <option value="5">5 hours</option>
                        <option value="6">6 hours</option>
                        <option value="8">8 hours</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="guestCount">Number of Guests</label>
                      <input
                        type="number"
                        id="guestCount"
                        className="form-control"
                        min="1"
                        max="20"
                        value={guestCount}
                        onChange={e => setGuestCount(parseInt(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="cuisineType">Preferred Cuisine</label>
                  <select
                    id="cuisineType"
                    className="form-control"
                    value={cuisineType}
                    onChange={e => setCuisineType(e.target.value)}
                    required
                  >
                    <option value="">Select Cuisine</option>
                    {chef.cuisine && chef.cuisine.map((cuisine, index) => (
                      <option key={index} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group mb-3">
                  <label htmlFor="specialRequests">Special Requests or Dietary Restrictions</label>
                  <textarea
                    id="specialRequests"
                    className="form-control"
                    rows="3"
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="price-calculator card bg-light mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Price Calculation</h5>
                    <div className="row">
                      <div className="col-8">Hourly Rate</div>
                      <div className="col-4 text-right">${chef.hourlyRate}</div>
                    </div>
                    <div className="row">
                      <div className="col-8">Duration</div>
                      <div className="col-4 text-right">{duration} hours</div>
                    </div>
                    <hr />
                    <div className="row font-weight-bold">
                      <div className="col-8">Total</div>
                      <div className="col-4 text-right">${totalPrice}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={!handleAvailabilityCheck()}
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {chef.reviews && chef.reviews.length > 0 && (
        <div className="card mt-4 mb-4">
          <div className="card-body">
            <h4 className="card-title mb-4">Reviews</h4>
            {chef.reviews.map((review, index) => (
              <div key={index} className="review mb-3">
                <div className="d-flex justify-content-between">
                  <h5>{review.userName || 'Anonymous'}</h5>
                  <div className="rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-warning" : "text-muted"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-muted small">
                  {new Date(review.date).toLocaleDateString()}
                </p>
                <p>{review.comment}</p>
                {index < chef.reviews.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDetail;