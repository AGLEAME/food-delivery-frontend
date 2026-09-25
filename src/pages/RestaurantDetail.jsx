import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/restaurants/${id}`).then(res => setRestaurant(res.data));
    api.get(`/menu-items/restaurant/${id}`).then(res => setMenuItems(res.data));
  }, [id]);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length > 0 && String(cart[0].restaurantId) !== String(id)) {
      const confirmSwitch = window.confirm(
        'Your cart has items from another restaurant. Adding this item will clear your current cart. Continue?'
      );
      if (!confirmSwitch) return;
      localStorage.removeItem('cart');
    }

    const freshCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = freshCart.find(c => c.menuItemId === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      freshCart.push({ menuItemId: item.id, name: item.name, price: item.price, quantity: 1, restaurantId: id });
    }
    localStorage.setItem('cart', JSON.stringify(freshCart));
    setMessage(`${item.name} added to cart`);
    setTimeout(() => setMessage(''), 1500);
  };

  if (!restaurant) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <div className="detail-header">
        {restaurant.imageUrl && (
          <img src={restaurant.imageUrl} alt={restaurant.name} className="detail-image" />
        )}
        <h1>{restaurant.name}</h1>
        <p>{restaurant.cuisine} · {restaurant.address}</p>
      </div>

      {message && <div className="success-banner">{message}</div>}

      <h2 className="page-title" style={{ fontSize: 22 }}>Menu</h2>
      {menuItems.map(item => (
        <div key={item.id} className="menu-item">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
          )}
          <div style={{ flex: 1 }}>
            <h4>{item.name}</h4>
            <span className="price">₹{item.price}</span>
            <p className="desc">{item.description}</p>
          </div>
          <button className="btn-primary" onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default RestaurantDetail;