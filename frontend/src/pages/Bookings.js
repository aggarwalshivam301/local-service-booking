import { useEffect, useState } from 'react';
import { FiCalendar, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ModernDashboard.css';

const statusCopy = {
  pending: 'Awaiting provider confirmation',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update booking');
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    try {
      await api.delete(`/bookings/${id}`, { data: { cancellationReason: 'Cancelled by user' } });
      toast.success('Booking cancelled');
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to cancel booking');
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">
        <div className="dashboard-heading">
          <div><div className="eyebrow">Workspace</div><h1>{user?.role === 'provider' ? 'Booking requests' : 'My bookings'}</h1><p>Track appointment requests, status changes, and next actions in one place.</p></div>
          <div className="stat-pill"><FiCalendar /> {bookings.length} total</div>
        </div>

        {loading ? <div className="loading">Loading bookings...</div> : bookings.length === 0 ? (
          <div className="empty-state"><FiCalendar size={34} /><h2>No bookings yet</h2><p>Browse services to create your first appointment request.</p></div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <article className="booking-row" key={booking._id}>
                <div className="booking-date"><strong>{new Date(booking.date).toLocaleDateString()}</strong><span>{booking.startTime}–{booking.endTime}</span></div>
                <div className="booking-main"><h3>{booking.serviceId?.title || 'Service appointment'}</h3><p>{user?.role === 'provider' ? `Customer: ${booking.customerId?.displayName || 'Customer'}` : `Provider: ${booking.providerId?.displayName || 'Provider'}`}</p><small>{booking.customerNotes || 'No additional notes'}</small></div>
                <div className="booking-actions"><span className={`status-badge status-${booking.status}`}><FiClock /> {statusCopy[booking.status]}</span>{user?.role === 'provider' && booking.status === 'pending' && <><button className="icon-button success" title="Confirm booking" onClick={() => updateStatus(booking._id, 'confirmed')}><FiCheck /></button><button className="icon-button danger" title="Decline booking" onClick={() => updateStatus(booking._id, 'cancelled')}><FiX /></button></>}{['pending', 'confirmed'].includes(booking.status) && <button className="text-button" onClick={() => cancelBooking(booking._id)}>Cancel</button>}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
