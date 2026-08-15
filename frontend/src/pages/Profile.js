import { useEffect, useState } from 'react';
import { FiSave, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './ModernDashboard.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ displayName: '', phoneNumber: '', businessName: '', businessDescription: '', profileImage: '', address: { street: '', city: '', state: '', zipCode: '' } });

  useEffect(() => {
    if (!user) return;
    setForm({
      displayName: user.displayName || '',
      phoneNumber: user.phoneNumber || '',
      businessName: user.businessName || '',
      businessDescription: user.businessDescription || '',
      profileImage: user.profileImage || '',
      address: user.address || { street: '', city: '', state: '', zipCode: '' }
    });
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await updateProfile(form);
      toast.success('Profile saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateAddress = (field, value) => setForm({ ...form, address: { ...form.address, [field]: value } });

  return <div className="dashboard-shell"><div className="dashboard-container"><div className="dashboard-heading"><div><div className="eyebrow">Account</div><h1>Your profile</h1><p>Keep your contact details and provider information current.</p></div><div className="stat-pill"><FiUser /> {user?.role}</div></div><form className="panel modern-form" onSubmit={submit}><div className="form-grid"><label>Display name<input required value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} /></label><label>Phone number<input value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} /></label></div>{user?.role === 'provider' && <><div className="form-grid"><label>Business name<input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} /></label><label>Profile image URL<input value={form.profileImage} onChange={(event) => setForm({ ...form, profileImage: event.target.value })} /></label></div><label>Business description<textarea rows="4" value={form.businessDescription} onChange={(event) => setForm({ ...form, businessDescription: event.target.value })} /></label></>}<div className="form-grid"><label>City<input value={form.address.city || ''} onChange={(event) => updateAddress('city', event.target.value)} /></label><label>State<input value={form.address.state || ''} onChange={(event) => updateAddress('state', event.target.value)} /></label></div><button className="btn btn-primary" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save profile'}</button></form></div></div>;
};

export default Profile;
