import React from 'react';

const mockOrderHistory = [
    { id: 'ORD-2025-54321', product: 'Organic Wheat (100 Kg)', date: '2025-09-25', total: 4500, status: 'Delivered', tracking: 'UPS-98765' },
    { id: 'ORD-2025-54322', product: 'Mustard Seeds (50 Kg)', date: '2025-09-28', total: 2800, status: 'Out for Delivery', tracking: 'FED-12345' },
    { id: 'ORD-2025-54323', product: 'Cotton Fabric (20m)', date: '2025-09-30', total: 7200, status: 'Processing', tracking: null },
];

const OrderDetailsTracking = () => {
    return (
        <div className="order-details-tracking">
            <h2>Order Details (Tracking)</h2>
            <p>View your complete order history, track shipments, and manage receipts.</p>

            {mockOrderHistory.map(order => (
                <div key={order.id} className="order-card">
                    <div className="order-header">
                        <strong>Order ID: {order.id}</strong>
                        <span>Date: {order.date}</span>
                    </div>
                    <div className="order-body">
                        <p className="product-name">{order.product}</p>
                        <p>Total: ₹{order.total}</p>
                        <div className="order-status-tag status-{order.status.toLowerCase().replace(/ /g, '-') }">
                            Status: {order.status}
                        </div>
                    </div>
                    <div className="order-actions">
                        {order.tracking ? (
                            <button 
                                className="track-btn" 
                                onClick={() => alert(`Tracking link for ${order.tracking}`)}
                            >
                                Track Package
                            </button>
                        ) : (
                            <span className="no-tracking">Tracking available soon</span>
                        )}
                        <button className="view-details-btn">View Receipt</button>
                    </div>
                </div>
            ))}

            {mockOrderHistory.length === 0 && (
                <p className="empty-state">No past orders found.</p>
            )}
        </div>
    );
};

export default OrderDetailsTracking;