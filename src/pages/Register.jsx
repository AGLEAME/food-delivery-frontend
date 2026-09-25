import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/users', form)
      .then(() => navigate('/login'))
      .catch(() => setError('Registration failed. Try a different email.'));
  };

  return (
    <div className="form-container">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit">Register</button>
      </form>
      <p className="form-footer">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register;