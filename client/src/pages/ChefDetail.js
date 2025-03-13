import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChefById, createBooking } from '../services/apiService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import ReviewList from '../components/ReviewList';
import BookingCalendar from '../components/BookingCalendar';
import Gallery from '../components/Gallery';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import '../styles/ChefDetail.css';

const ChefDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        setLoading(true);
        const chefData = await getChefById(id);
        setChef(chefData);
        setError(null);
      } catch (err) {
        console.error('Error fetching chef details:', err);
        setError('Failed to load chef details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to book a chef');
      navigate('/login', { state: { from: `/chefs/${id}` } });
      return;
    }

    if (!selectedDate || !selectedMeal) {
      toast.error('Please select a date and meal type');
      return;
    }

    try {
      const bookingData = {
        chefId: id,
        userId: user.id,
        date: selectedDate,
        mealType: selectedMeal,
        guestCount: guestCount,
        specialRequests: specialRequests,
      };

      await createBooking(bookingData);
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  if (loading) return <Spinner />;
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={() => navigate('/chefs')}>Back to Chefs</Button>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="not-found-container">
        <h2>Chef Not Found</h2>
        <p>The chef you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/chefs')}>Browse Chefs</Button>
      </div>
    );
  }

  return (
    <div className="chef-detail-container">
      <div className="chef-header">
        <div className="chef-profile">
          <img src={chef.profileImage} alt={`Chef ${chef.name}`} className="chef-profile-image" />
          <div className="chef-info">
            <h1>{chef.name}</h1>
            <div className="chef-badges">
              {chef.specialties.map((specialty, index) => (
                <span key={index} className="badge">{specialty}</span>
              ))}
            </div>
            <div className="chef-rating">
              <span className="stars">{renderStars(chef.averageRating)}</span>
              <span className="rating-count">({chef.reviewCount} reviews)</span>
            </div>
            <p className="chef-price">Starting at {formatCurrency(chef.pricePerPerson)} per person</p>
          </div>
        </div>
      </div>

      <div className="chef-content">
        <div className="chef-main-content">
          <section className="chef-bio">
            <h2>About {chef.name}</h2>
            <p>{chef.bio}</p>
          </section>

          <section className="chef-experience">
            <h2>Experience</h2>
            <ul>
              {chef.experience.map((exp, index) => (
                <li key={index}>
                  <h3>{exp.position} at {exp.company}</h3>
                  <p className="experience-years">{exp.years}</p>
                  <p>{exp.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="chef-menu-samples">
            <h2>Sample Menus</h2>
            {chef.sampleMenus.map((menu, index) => (
              <div key={index} className="menu-sample">
                <h3>{menu.title}</h3>
                <p className="menu-description">{menu.description}</p>
                <ul className="menu-items">
                  {menu.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="chef-gallery">
            <h2>Gallery</h2>
            <Gallery images={chef.gallery} />
          </section>

          <section className="chef-reviews">
            <h2>Reviews</h2>
            <ReviewList reviews={chef.reviews} />
          </section>
        </div>

        <div className="booking-sidebar">
          <div className="booking-card">
            <h2>Book {chef.name}</h2>
            
            <div className="booking-field">
              <label>Select Date</label>
              <BookingCalendar 
                availableDates={chef.availability}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            
            <div className="booking-field">
              <label>Meal Type</label>
              <div className="meal-type-options">
                {chef.mealTypes.map((meal) => (
                  <button
                    key={meal}
                    className={`meal-type-btn ${selectedMeal === meal ? 'selected' : ''}`}
                    onClick={() => setSelectedMeal(meal)}
                  >
                    {meal}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="booking-field">
              <label>Number of Guests</label>
              <div className="guest-counter">
                <button 
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  disabled={guestCount <= 1}
                >
                  -
                </button>
                <span>{guestCount}</span>
                <button 
                  onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                  disabled={guestCount >= 20}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="booking-field">
              <label>Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Allergies, dietary restrictions, etc."
                rows="4"
              />
            </div>
            
            <div className="booking-summary">
              <div className="summary-item">
                <span>Base Price:</span>
                <span>{formatCurrency(chef.pricePerPerson)} x {guestCount}</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>{formatCurrency(chef.pricePerPerson * guestCount)}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleBooking} 
              className="book-now-btn"
              disabled={!selectedDate || !selectedMeal}
            >
              Book Now
            </Button>
            
            <p className="booking-info">
              You won't be charged yet. {chef.name} will confirm the booking
              within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to render star ratings
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
  }
  
  return stars;
};

export default ChefDetail;