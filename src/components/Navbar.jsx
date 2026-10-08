import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <span className="logo">🍕 Zomato Clone</span>
        <Link to="/">Home</Link>
        {token && <Link to="/cart">Cart</Link>}
        {token && <Link to="/orders">My Orders</Link>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {token ? (
          <>
            <span className="user-chip">{userEmail}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;