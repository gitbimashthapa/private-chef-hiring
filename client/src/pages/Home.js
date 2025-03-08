import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="jumbotron text-center">
        <h1 className="display-4">Private Chef Hiring</h1>
        <p className="lead">
          Find the perfect chef for your next private dining experience
        </p>
        <hr className="my-4" />
        <p>
          Browse through profiles of professional chefs and book them for special occasions, 
          dinner parties, or regular meal preparations.
        </p>
        <Link to="/chefs" className="btn btn-primary btn-lg">
          Find a Chef
        </Link>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h3>Browse Chefs</h3>
              <p>
                Explore profiles of talented chefs in your area with various
                specialties and cuisine expertise.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h3>Book a Chef</h3>
              <p>
                Select dates, review availability, and book your preferred chef
                for your next event or meal.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <h3>Enjoy Your Meal</h3>
              <p>
                Sit back and enjoy a professionally prepared dining experience
                in the comfort of your own home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;