// F:\Projees\cottage-4.0-frontend\src\components\WishlistProductCard\WishlistProductCard.jsx

import React from 'react';
import BuyCard from '../Card/BuyCard/BuyCard'; 
import AuctionCard from '../Card/AuctionCard/AuctionCard'; 
// FIX: Added FaCaretUp and FaCaretDown imports
import { 
    FaShoppingBag, 
    FaGavel, 
    FaTimes, 
    FaCaretUp, 
    FaCaretDown 
} from "react-icons/fa"; 

export default function WishlistProductCard({ product, onRemove }) {
    const isAuction = product.type === 'auction';

    // Handle 'Move to Bag' / 'Place Bid' button clicks
    const handleActionClick = (event) => {
        event.stopPropagation();
        if (isAuction) {
            console.log(`Placing bid for ${product.name}`);
            // TODO: Navigate to bid modal/page
        } else {
            console.log(`Moving ${product.name} to bag`);
            // TODO: Add to cart/bag state
        }
    };

    // Handle removal from wishlist
    const handleRemoveClick = (event) => {
        event.stopPropagation();
        onRemove(product.id);
    };

    // Conditional Content
    const ActionIcon = isAuction ? FaGavel : FaShoppingBag;
    const ActionText = isAuction ? 'Place Bid' : 'Move to Bag';
    
    // FIX: Define the IndicatorIcon based on status
    const IndicatorIcon = isAuction 
        ? (product.status === 'increasing' ? FaCaretUp : FaCaretDown) 
        : null;

    return (
        <div className="wishlist-card-wrapper">
            
            {/* 1. Auction Indicator (Top Left) */}
            {isAuction && (
                <div className={`wishlist-auction-indicator ${product.status}`}>
                    {IndicatorIcon && <IndicatorIcon />}
                </div>
            )}

            {/* 2. Remove Button (Top Right - Cross) */}
            <button 
                className="wishlist-remove-btn"
                onClick={handleRemoveClick}
            >
                <FaTimes />
            </button>

            {/* 3. Render the core card component 
                FIX: Pass hideWishlistIcon prop to tell the base cards to hide the heart icon */}
            {isAuction ? (
                <AuctionCard auction={product} hideWishlistIcon={true} /> 
            ) : (
                <BuyCard product={product} hideWishlistIcon={true} /> 
            )}

            {/* 4. Wishlist Action Button (Move to Bag / Place Bid) */}
            <div className="wishlist-action-btn-container">
                <button 
                    className="wishlist-action-btn"
                    onClick={handleActionClick}
                >
                    <ActionIcon /> {ActionText}
                </button>
            </div>
        </div>
    );
}