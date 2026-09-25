import { useState, useEffect } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

 useEffect(() => {
  const userId = localStorage.getItem('userId');
  api.get(`/orders/user/${userId}`)
    .then(response => setOrders(response.data))
    .catch(() => setError('Could not load orders. Are you logged in?'));
}, []);

  if (error) return <div className="page"><p className="error-text">{error}</p></div>;

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 && <div className="empty-state"><p>No orders yet.</p></div>}
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <strong>Order #{order.id}</strong>
            <span className="status-badge">{order.status}</span>
          </div>
          <p>Total: ₹{order.totalAmount}</p>
          <ul>
            {order.orderItems && order.orderItems.map(item => (
              <li key={item.id}>
                {item.menuItem?.name ?? 'Item'} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Orders;