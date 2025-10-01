import React from 'react';

const mockReturns = [
    { id: 'RTN-2025-1001', orderId: 'ORD-2025-50001', product: 'Organic Tomatoes', date: '2025-09-10', reason: 'Damaged during transit', status: 'Refund Processed' },
    { id: 'RTN-2025-1002', orderId: 'ORD-2025-50005', product: 'Hand-woven Shawl', date: '2025-09-15', reason: 'Size issue', status: 'In Review' },
];

const MyReturns = () => {
    const initiateReturn = () => {
        alert("Redirecting to the return initiation wizard. (Requires selecting an eligible order.)");
    };

    return (
        <div className="my-returns-container">
            <h2>My Returns</h2>
            <button className="primary-action-btn" onClick={initiateReturn}>
                Initiate New Return Request
            </button>
            
            <h3>Past Returns</h3>
            
            {mockReturns.map(item => (
                <div key={item.id} className="return-card">
                    <div className="return-summary">
                        <strong>Return ID: {item.id} (Order: {item.orderId})</strong>
                        <p>{item.product}</p>
                        <p className="return-reason">Reason: {item.reason}</p>
                    </div>
                    <div className="return-status-details">
                        <div className={`order-status-tag status-${item.status.toLowerCase().replace(/ /g, '-') }`}>
                            {item.status}
                        </div>
                        <button className="view-details-btn">View Details</button>
                    </div>
                </div>
            ))}

            {mockReturns.length === 0 && (
                <p className="empty-state">No past return requests found.</p>
            )}
        </div>
    );
};

export default MyReturns;