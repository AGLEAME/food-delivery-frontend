import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/restaurants')
      .then(response => {
        setRestaurants(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching restaurants:', err);
        setError('Could not load restaurants.');
        setLoading(false);
      });
  }, []);

  const query = search.toLowerCase();

  const filtered = restaurants.filter(r => {
    const name = (r?.name || '').toLowerCase();
    const cuisine = (r?.cuisine || '').toLowerCase();
    return name.includes(query) || cuisine.includes(query);
  });

  if (loading) {
    return (
      <div className="page">
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Restaurants near you</h1>
      <p className="page-subtitle">Order food from your favorite places</p>
      <input
        className="search-input"
        placeholder="Search by name or cuisine..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No restaurants found.</p>
        </div>
      ) : (
        <div className="restaurant-grid">
          {filtered.map(restaurant => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="restaurant-card"
            >
              {restaurant.imageUrl ? (
                <img src={restaurant.imageUrl} alt={restaurant.name} className="card-image" />
              ) : (
                <div className="card-banner">
                  {restaurant.name ? restaurant.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="card-body">
                <h3>{restaurant.name || 'Unnamed Restaurant'}</h3>
                <div className="meta-row">
                  <span>{restaurant.cuisine || 'Cuisine not listed'}</span>
                  <span className="rating-badge">
                    ★ {restaurant.rating != null ? restaurant.rating : 'N/A'}
                  </span>
                </div>
                <p className="address">{restaurant.address || 'Address not available'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;