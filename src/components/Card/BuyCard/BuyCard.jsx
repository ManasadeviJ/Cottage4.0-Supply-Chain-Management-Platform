import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyCard.css";
import { FaHeart } from 'react-icons/fa';

// FIX: Added 'hideWishlistIcon' prop
export default function BuyCard({ product, hideWishlistIcon }) { 
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`); // Navigate to a product detail page
  };

  return (
    <div className="buy-card" onClick={handleCardClick}>
      {/* Product Image */}
      <img src={product.image} alt={product.name} className="buy-card-img" />
      
      {/* Heart Button - HIDDEN IF hideWishlistIcon is true */}
      {!hideWishlistIcon && (
        <button 
          className={`buy-card-favorite-btn ${isFavorite ? 'favorite' : ''}`}
          onClick={handleFavoriteClick}
        >
          <FaHeart />
        </button>
      )}
      
      {/* Product Info Section */}
      <div className="buy-card-info">
        <h3 className="buy-card-title">{product.name}</h3>
        <p className="buy-card-price">₹{product.price}</p>
        <div className="buy-card-rating">
          ★★★★☆ <span>(88)</span>
        </div>
      </div>
    </div>
  );
}