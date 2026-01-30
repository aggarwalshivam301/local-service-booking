import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiSearch, FiCalendar, FiStar, FiCheckCircle, 
  FiTool, FiHome, FiZap, FiScissors, FiBook, FiWrench,
  FiArrowRight, FiShield, FiClock, FiDollarSign
} from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { icon: <FiHome />, name: 'Cleaning', path: '/services?category=cleaning' },
    { icon: <FiTool />, name: 'Plumbing', path: '/services?category=plumbing' },
    { icon: <FiZap />, name: 'Electrical', path: '/services?category=electrical' },
    { icon: <FiScissors />, name: 'Beauty', path: '/services?category=beauty' },
    { icon: <FiBook />, name: 'Tutoring', path: '/services?category=tutoring' },
    { icon: <FiWrench />, name: 'Repair', path: '/services?category=repair' }
  ];

  const features = [
    {
      icon: <FiSearch />,
      title: 'Easy Discovery',
      description: 'Find the perfect service provider in your area with our advanced search and filters'
    },
    {
      icon: <FiCalendar />,
      title: 'Smart Booking',
      description: 'Book appointments instantly with real-time availability and conflict-free scheduling'
    },
    {
      icon: <FiStar />,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from customers to make informed decisions'
    },
    {
      icon: <FiShield />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with buyer protection'
    },
    {
      icon: <FiClock />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you whenever you need'
    },
    {
      icon: <FiDollarSign />,
      title: 'Best Prices',
      description: 'Competitive pricing with transparent costs and no hidden fees'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '5K+', label: 'Service Providers' },
    { number: '50K+', label: 'Bookings Completed' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FiCheckCircle /> Trusted by 10,000+ Users
          </div>
          <h1 className="hero-title">
            Find Local Services
            <br />
            <span className="hero-title-accent">At Your Fingertips</span>
          </h1>
          <p className="hero-subtitle">
            Connect with trusted local service providers for cleaning, repairs, 
            beauty services, tutoring, and more. Book instantly and get the job done.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn btn-primary btn-lg">
              Browse Services <FiArrowRight />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Become a Provider
              </Link>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-card hero-card-1">
            <div className="hero-card-icon">
              <FiStar />
            </div>
            <div>
              <p className="hero-card-label">Top Rated</p>
              <p className="hero-card-value">4.9/5.0</p>
            </div>
          </div>
          
          <div className="hero-card hero-card-2">
            <div className="hero-card-icon">
              <FiCheckCircle />
            </div>
            <div>
              <p className="hero-card-label">Bookings</p>
              <p className="hero-card-value">50K+</p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-pattern"></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-subtitle">
              Explore our wide range of services
            </p>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link 
                to={category.path} 
                key={index} 
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <div className="category-arrow">
                  <FiArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ServiceHub?</h2>
            <p className="section-subtitle">
              Everything you need for hassle-free service booking
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of satisfied customers and providers on ServiceHub today
            </p>
            <div className="cta-actions">
              <Link to="/services" className="btn btn-primary btn-lg">
                Find Services <FiArrowRight />
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Sign Up Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
