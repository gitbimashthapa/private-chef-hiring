import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChefs } from '../services/api';

const ChefList = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const data = await getChefs();
        setChefs(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching chefs. Please try again.');
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCuisineFilterChange = (e) => {
    setCuisineFilter(e.target.value);
  };

  // Filter chefs based on search and cuisine filter
  const filteredChefs = chefs.filter(chef => {
    const nameMatch = chef.user && chef.user.name && 
      chef.user.name.toLowerCase().includes(filter.toLowerCase());
    
    const specialityMatch = chef.speciality && 
      chef.speciality.toLowerCase().includes(filter.toLowerCase());
    
    const cuisineMatch = cuisineFilter === '' || 
      (chef.cuisine && chef.cuisine.some(c => 
        c.toLowerCase().includes(cuisineFilter.toLowerCase())
      ));
    
    return (nameMatch || specialityMatch) && cuisineMatch;
  });

  // Get unique cuisines for filter dropdown
  const cuisines = chefs.reduce((acc, chef) => {
    if (chef.cuisine && Array.isArray(chef.cuisine)) {
      chef.cuisine.forEach(c => {
        if (!acc.includes(c)) {
          acc.push(c);
        }
      });
    }
    return acc;
  }, []);

  if (loading) return <div className="text-center mt-5">Loading chefs...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Find a Chef</h1>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or speciality"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <select
              className="form-control"
              value={cuisineFilter}
              onChange={handleCuisineFilterChange}
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="row">
        {filteredChefs.length === 0 ? (
          <div className="col-12 text-center mt-5">
            <h3>No chefs found matching your criteria</h3>
          </div>
        ) : (
          filteredChefs.map(chef => (
            <div key={chef._id} className="col-md-4 mb-4">
              <div className="card">
                {chef.profileImage && (
                  <img
                    src={chef.profileImage}
                    className="card-img-top"
                    alt={`Chef ${chef.user ? chef.user.name : 'Unknown'}`}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">
                    {chef.user ? chef.user.name : 'Unknown Chef'}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {chef.speciality}
                  </h6>
                  <p className="card-text">
                    Experience: {chef.experience} years
                  </p>
                  <p className="card-text">
                    Rate: ${chef.hourlyRate}/hour
                  </p>
                  <p className="card-text">
                    <small>
                      Cuisines: {chef.cuisine ? chef.cuisine.join(', ') : 'Not specified'}
                    </small>
                  </p>
                  <Link to={`/chefs/${chef._id}`} className="btn btn-primary">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChefList;