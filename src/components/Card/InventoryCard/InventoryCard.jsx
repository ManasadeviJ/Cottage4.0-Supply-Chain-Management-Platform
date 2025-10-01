import React from 'react';
import { FaEdit, FaTrashAlt, FaClock } from 'react-icons/fa'; 
// Assuming Timer path is correct:
import Timer from '../../Timer/Timer'; 
import './InventoryCard.css'; 

const InventoryCard = ({ product, role }) => {
    
    const isAuctionActive = product.status === 'Active Auction';
    
    const handleAction = (action) => {
        alert(`${action} action triggered for ${product.name}`);
    };
    
    // Determine the text for the primary red button
    let primaryButtonText = product.status;
    if (product.status === 'Ready') {
        primaryButtonText = 'Start Auction';
    } else if (isAuctionActive) {
        primaryButtonText = 'View Live';
    }

    // Determine what action the primary button performs
    const handlePrimaryAction = () => {
        if (product.status === 'Ready') return handleAction('Start Auction');
        if (isAuctionActive) return handleAction('View Live Auction');
        return handleAction(`Check Status: ${product.status}`); // Default for Sold Out/Completed
    };
    
    return (
        <div className="product-card">
            
            {/* 1. Image Area (Square) */}
            <div className="product-image-container">
                <img src={product.image} alt={product.name} />

                {/* Auction Timer/Badge */}
                {isAuctionActive && product.endsIn && (
                    <div className="auction-badge">
                        <FaClock />
                        <Timer endTime={product.endsIn} /> 
                    </div>
                )}
            </div>

            {/* 2. Product Details */}
            <div className="product-info">
                <h3>{product.name}</h3>
                
                {/* Price Line (Matches mockup: Discounted Price, Original Price) */}
                <p className="product-price">
                    Rs : <span className="current-price">{product.currentPrice?.toLocaleString() || 'N/A'}</span> 
                    <span className="original-price">Rs:{product.originalPrice?.toLocaleString() || 'N/A'}</span>
                </p>
                
                <p className="product-meta">Quantity</p>
            </div>

            {/* 3. Action Buttons */}
            <div className="product-actions">
                
                {/* Primary Status/Action Button (Full Width Red Button) */}
                <button 
                    className="action-status-btn" 
                    onClick={handlePrimaryAction}
                >
                    {primaryButtonText}
                </button>
                
                {/* Edit Icon */}
                <button 
                    className="action-icon-btn" 
                    onClick={() => handleAction('Edit')}
                    title="Edit Product Details"
                >
                    <FaEdit /> 
                </button>
                
                {/* Delete Icon */}
                <button 
                    className="action-icon-btn" 
                    onClick={() => handleAction('Remove')}
                    title="Remove Product"
                >
                    <FaTrashAlt /> 
                </button>
                
            </div>
        </div>
    );
};

export default InventoryCard;