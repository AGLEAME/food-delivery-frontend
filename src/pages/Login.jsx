import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = (e) => {
  e.preventDefault();
  api.post('/auth/login', { email, password })
    .then(response => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userName', response.data.name);
      navigate('/');
    })
    .catch(() => setError('Invalid email or password'));
};

  return (
    <div className="form-container">
      <h1>Welcome back</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit">Login</button>
      </form>
      <p className="form-footer">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;