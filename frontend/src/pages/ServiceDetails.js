import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ModernDashboard.css';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ date: '', startTime: '09:00', endTime: '10:00', customerNotes: '' });

  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data.service);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load this service');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/bookings', { ...form, serviceId: id });
      toast.success('Booking request submitted');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="dashboard-shell"><div className="loading">Loading service...</div></div>;
  if (!service) return <div className="dashboard-shell"><div className="empty-state"><h2>Service not found</h2><Link to="/services" className="btn btn-primary">Back to services</Link></div></div>;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">
        <Link to="/services" className="back-link"><FiArrowLeft /> Back to services</Link>
        <div className="detail-grid">
          <section className="detail-card">
            <img className="detail-image" src={service.images?.[0] || 'https://via.placeholder.com/900x560'} alt={service.title} />
            <div className="detail-content">
              <div className="eyebrow">{service.category}</div>
              <h1>{service.title}</h1>
              <p className="detail-description">{service.description}</p>
              <div className="detail-meta-grid">
                <span><FiMapPin /> {service.location?.city || 'Location flexible'}</span>
                <span><FiStar /> {service.rating || 0} rating</span>
                <span><FiClock /> {service.duration || 60} minutes</span>
              </div>
              <div className="provider-panel">
                <div className="provider-avatar large">{service.providerId?.displayName?.charAt(0).toUpperCase()}</div>
                <div><strong>{service.providerId?.displayName || 'Service provider'}</strong><span>{service.providerId?.businessName || 'Independent provider'}</span></div>
              </div>
            </div>
          </section>

          <section className="booking-card">
            <div className="eyebrow">Book this service</div>
            <h2><span>${service.price}</span> / {service.priceType}</h2>
            <form onSubmit={handleSubmit} className="modern-form">
              <label><FiCalendar /> Date<input type="date" required value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
              <div className="form-row">
                <label><FiClock /> Start<input type="time" required value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} /></label>
                <label><FiClock /> End<input type="time" required value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} /></label>
              </div>
              <label>Notes<textarea rows="4" placeholder="Tell the provider what you need..." value={form.customerNotes} onChange={(event) => setForm({ ...form, customerNotes: event.target.value })} /></label>
              <button className="btn btn-primary full-width" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : user ? 'Request booking' : 'Sign in to book'}</button>
            </form>
            <p className="form-help">Overlapping active bookings are rejected by the SQL transaction layer.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
