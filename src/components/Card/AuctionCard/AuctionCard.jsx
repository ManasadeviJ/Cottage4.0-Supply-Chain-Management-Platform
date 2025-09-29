import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuctionCard.css";
import { FaHeart } from "react-icons/fa";
import Timer from "../../Timer/Timer"; // Import reusable timer

// FIX: Added 'hideWishlistIcon' prop
export default function AuctionCard({ auction, hideWishlistIcon }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Handle favorite button click
  const handleFavoriteClick = (event) => {
    event.stopPropagation(); // Prevent card click
    setIsFavorite(!isFavorite);
  };

  // Handle card click for navigation
  const handleCardClick = () => {
    navigate(`/auction/${auction.id}`);
  };

  return (
    <div className="auction-card" onClick={handleCardClick}>
      {/* Product Image */}
      <img src={auction.image} alt={auction.name} className="auction-img" />

      {/* Countdown Timer Badge */}
      <div className="auction-badge">
        <Timer endTime={auction.endsIn} />
      </div>

      {/* Heart Button - HIDDEN IF hideWishlistIcon is true */}
      {!hideWishlistIcon && (
        <button
          className={`auction-favorite-btn ${isFavorite ? "favorite" : ""}`}
          onClick={handleFavoriteClick}
        >
          <FaHeart />
        </button>
      )}

      {/* Product Info Section */}
      <div className="auction-info-content">
        <h3 className="auction-title">{auction.name}</h3>
        <div className="auction-prices">
          <p className="auction-current-bid">Rs : {auction.currentBid}</p>
          <p className="auction-original-price">
            Rs : {auction.currentBid + 40}
          </p>
        </div>
      </div>
    </div>
  );
}