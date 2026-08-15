import { useEffect, useState } from 'react';
import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import './ModernDashboard.css';

const initialForm = { title: '', description: '', category: 'repair', price: '', priceType: 'fixed', duration: 60, images: '', location: { city: '', state: '', address: '' } };

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadServices = async () => {
    try {
      const response = await api.get('/services/provider/my-services');
      setServices(response.data.services || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load your services');
    }
  };

  useEffect(() => { loadServices(); }, []);

  const updateLocation = (field, value) => setForm({ ...form, location: { ...form.location, [field]: value } });

  const createService = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/services', { ...form, price: Number(form.price), images: form.images ? form.images.split(',').map((value) => value.trim()) : [] });
      setForm(initialForm);
      setShowForm(false);
      toast.success('Service created');
      loadServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create service');
    } finally {
      setSubmitting(false);
    }
  };

  const archiveService = async (id) => {
    if (!window.confirm('Archive this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service archived');
      loadServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to archive service');
    }
  };

  return (
    <div className="dashboard-shell"><div className="dashboard-container">
      <div className="dashboard-heading"><div><div className="eyebrow">Provider workspace</div><h1>My services</h1><p>Publish focused offers, keep details current, and manage your service catalog.</p></div><button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FiPlus /> {showForm ? 'Close form' : 'Add service'}</button></div>
      {showForm && <form className="panel modern-form" onSubmit={createService}><div className="form-grid"><label>Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option value="cleaning">Cleaning</option><option value="plumbing">Plumbing</option><option value="electrical">Electrical</option><option value="beauty">Beauty</option><option value="tutoring">Tutoring</option><option value="repair">Repair</option><option value="other">Other</option></select></label><label>Price<input type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label><label>Duration (minutes)<input type="number" min="15" required value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} /></label></div><label>Description<textarea required rows="4" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><div className="form-grid"><label>City<input value={form.location.city} onChange={(event) => updateLocation('city', event.target.value)} /></label><label>State<input value={form.location.state} onChange={(event) => updateLocation('state', event.target.value)} /></label></div><label>Image URLs <span className="muted">comma-separated</span><input value={form.images} onChange={(event) => setForm({ ...form, images: event.target.value })} /></label><button className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Publish service'}</button></form>}
      <div className="provider-service-grid">{services.map((service) => <article className="provider-service-card" key={service._id}><img src={service.images?.[0] || 'https://via.placeholder.com/600x360'} alt="" /><div><span className="eyebrow">{service.category}</span><h3>{service.title}</h3><p>{service.description}</p><div className="provider-card-footer"><strong>${service.price} / {service.priceType}</strong><div><button className="icon-button" title="Edit service"><FiEdit3 /></button><button className="icon-button danger" title="Archive service" onClick={() => archiveService(service._id)}><FiTrash2 /></button></div></div></div></article>)}</div>
    </div></div>
  );
};

export default ProviderServices;
