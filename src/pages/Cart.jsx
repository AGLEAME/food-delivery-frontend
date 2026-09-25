import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Cart() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updateQuantity = (menuItemId, delta) => {
    const updated = cart.map(item =>
      item.menuItemId === menuItemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (menuItemId) => {
    const updated = cart.filter(item => item.menuItemId !== menuItemId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const restaurantId = cart[0].restaurantId;

    api.post('/orders', {
      restaurant: { id: restaurantId },
      status: 'PENDING',
      totalAmount: total,
      orderItems: cart.map(item => ({
        menuItem: { id: item.menuItemId },
        quantity: item.quantity
      }))
    })
      .then(() => {
        localStorage.removeItem('cart');
        navigate('/orders');
      })
      .catch(() => setError('Failed to place order. Are you logged in?'));
  };

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Browse restaurants and add something tasty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Your Cart</h1>
        <button className="btn-secondary" onClick={clearCart}>Clear Cart</button>
      </div>

      {cart.map(item => (
        <div key={item.menuItemId} className="cart-row">
          <div>
            <div className="item-name">{item.name}</div>
            <div className="item-price">₹{item.price} each</div>
          </div>
          <div className="qty-controls">
            <button className="btn-round" onClick={() => updateQuantity(item.menuItemId, -1)}>−</button>
            <span>{item.quantity}</span>
            <button className="btn-round" onClick={() => updateQuantity(item.menuItemId, 1)}>+</button>
            <button className="btn-secondary" onClick={() => removeItem(item.menuItemId)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Cart;