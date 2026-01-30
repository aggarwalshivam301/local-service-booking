import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiSearch, FiMapPin, FiStar, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: ''
  });

  const categories = [
    'all',
    'cleaning',
    'plumbing',
    'electrical',
    'beauty',
    'tutoring',
    'repair',
    'other'
  ];

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.city) params.city = filters.city;

      const response = await api.get('/services', { params });
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <h1 className="services-title">Browse Services</h1>
          <p className="services-subtitle">Find the perfect service provider for your needs</p>
        </div>
      </div>

      <div className="container">
        <div className="services-filters">
          <div className="filter-group">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                name="search"
                placeholder="Search services..."
                className="search-input"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-group">
            <select
              name="category"
              className="filter-select"
              value={filters.category}
              onChange={handleFilterChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <div className="location-box">
              <FiMapPin className="location-icon" />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="location-input"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No Services Found</h3>
            <p className="empty-state-text">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <div key={service._id} className="service-card">
                <div className="service-image">
                  <img 
                    src={service.images?.[0] || 'https://via.placeholder.com/300'} 
                    alt={service.title}
                  />
                  <span className="service-category">
                    {service.category}
                  </span>
                </div>
                
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">
                    {service.description.substring(0, 100)}...
                  </p>
                  
                  <div className="service-provider">
                    <div className="provider-avatar">
                      {service.providerId?.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="provider-info">
                      <p className="provider-name">
                        {service.providerId?.displayName || 'Provider'}
                      </p>
                      <div className="provider-rating">
                        <FiStar className="star-icon" />
                        <span>{service.rating || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="service-footer">
                    <div className="service-price">
                      <FiDollarSign className="price-icon" />
                      <span className="price-amount">{service.price}</span>
                      <span className="price-type">/{service.priceType}</span>
                    </div>
                    
                    <button className="btn btn-primary btn-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
