import React, { useState } from 'react';
import { formatDate } from '../utils/formatters';
import '../styles/ReviewList.css';

const ReviewList = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [sortBy, setSortBy] = useState('recent');
  
  const getSortedReviews = () => {
    switch (sortBy) {
      case 'recent':
        return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      default:
        return reviews;
    }
  };
  
  const sortedReviews = getSortedReviews();
  const hasMoreReviews = visibleReviews < reviews.length;
  
  const loadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 3, reviews.length));
  };
  
  // Helper function to render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else {
        stars.push(<span key={i} className="star">☆</span>);
      }
    }
    return stars;
  };
  
  return (
    <div className="reviews-container">
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet for this chef.</p>
        </div>
      ) : (
        <>
          <div className="review-filter">
            <span>Sort by: </span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
          
          <div className="reviews-list">
            {sortedReviews.slice(0, visibleReviews).map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <img 
                      src={review.userAvatar || '/images/default-avatar.png'} 
                      alt={review.userName} 
                      className="reviewer-avatar" 
                    />
                    <div>
                      <h4>{review.userName}</h4>
                      <div className="review-date">{formatDate(review.date)}</div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="review-body">
                  <p>{review.comment}</p>
                </div>
                {review.chefResponse && (
                  <div className="chef-response">
                    <h5>Response from Chef</h5>
                    <p>{review.chefResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {hasMoreReviews && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More Reviews
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;