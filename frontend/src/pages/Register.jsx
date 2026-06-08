import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerAPI(form);
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed : Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>PrimeTrade</h2>
        <h3>Create Account</h3>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text" name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange} required
          />
          <input
            type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required
          />
          <input
            type="password" name="password" placeholder="Password (min 6 chars)"
            value={form.password} onChange={handleChange} required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}