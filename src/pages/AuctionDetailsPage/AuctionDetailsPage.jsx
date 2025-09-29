import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AuctionCard from "../../components/Card/AuctionCard/AuctionCard"; 
import Timer from "../../components/Timer/Timer"; // ✅ Import Timer
import { CircleDollarSign, User, History, CheckCircle, XCircle, ChevronUp, ChevronDown } from 'lucide-react'; 
import peanutImage1 from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png";
import peanutImage2 from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png"; 
import peanutImage3 from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png";
import './AuctionDetailsPage.css'; 

// --- Mock Data ---
const mockAuctionData = {
    name: "Peanuts",
    producer: "AGRO PRODUCTIONS",
    producerId: "agro101", 
    currentBid: 120000,
    basePrice: 100000,
    bidStatus: 'up', 
    images: [peanutImage1, peanutImage2, peanutImage3], 
    fullDescription: "High-quality, grade A peanuts available for auction. Certified organic farming practices used. Ideal for oil extraction or direct consumption. Inspection available upon request. The starting bid is ₹100,000 for a total of 80 bags (1 kg each).",
    quantityAvailable: 80, 
    bidStep: 5000,
    startTime: new Date(Date.now() - 3600000).toISOString(), 
    endTime: new Date(Date.now() + 86400000).toISOString(), 
    location: "Andhra Pradesh, India",
};

const mockBidHistory = [
    { user: "Rohan_T", amount: 120000, time: new Date(Date.now() - 10000).toLocaleTimeString('en-IN') },
    { user: "Buyer_23", amount: 115000, time: new Date(Date.now() - 60000).toLocaleTimeString('en-IN') },
    { user: "FarmFresh_Co", amount: 110000, time: new Date(Date.now() - 120000).toLocaleTimeString('en-IN') },
];

const similarProductsData = [
    { id: 'sim1', name: 'Product A', image: peanutImage1, currentBid: 125, endsIn: '02:10:15' },
    { id: 'sim2', name: 'Product B', image: peanutImage1, currentBid: 120, endsIn: '01:05:00' },
];

const auctionEndsSoonData = [
    { id: 'end1', name: 'Product X', image: peanutImage1, currentBid: 125, endsIn: '00:08:10' },
    { id: 'end2', name: 'Product Y', image: peanutImage1, currentBid: 120, endsIn: '00:03:55' },
];

export default function AuctionDetailsPage() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState(0); 
    const [isBiddingMode, setIsBiddingMode] = useState(false); 
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bidHistory, setBidHistory] = useState(mockBidHistory); 
    const [feedback, setFeedback] = useState(null); 

    useEffect(() => {
        setAuction({ ...mockAuctionData, id });
        setBidAmount(mockAuctionData.currentBid + mockAuctionData.bidStep); 
        
        const imageCount = mockAuctionData.images.length;
        if (imageCount > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageCount);
            }, 5000); 
            return () => clearInterval(interval); 
        }
    }, [id]);

    if (!auction) return <p>Loading...</p>;

    const handleBidChange = (event) => {
        const newBid = Number(event.target.value);
        setBidAmount(Math.max(auction.currentBid + auction.bidStep, newBid));
    };

    const handleIncrementBid = () => {
        setBidAmount(prev => prev + auction.bidStep);
    };

    const handleDecrementBid = () => {
        setBidAmount(prev => Math.max(auction.currentBid + auction.bidStep, prev - auction.bidStep));
    };

    const activateBidding = () => {
        setIsBiddingMode(true);
        setFeedback(null); 
    };
    
    const handleConfirmBid = () => {
        const minBid = auction.currentBid + auction.bidStep;

        if (bidAmount < minBid) {
            setFeedback({ type: 'error', message: `Bid must be at least ₹${minBid.toLocaleString('en-IN')} (Current + Step).` });
        } else {
            const newBid = { user: "You", amount: bidAmount, time: new Date().toLocaleTimeString('en-IN') };
            
            setAuction(prev => ({ ...prev, currentBid: bidAmount, bidStatus: 'up' }));
            setBidHistory(prev => [newBid, ...prev]);

            setFeedback({ type: 'success', message: `Your bid of ₹${bidAmount.toLocaleString('en-IN')} has been placed successfully!` });
            
            setIsBiddingMode(false); 
            setBidAmount(bidAmount + auction.bidStep); 
            
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const TrendIcon = auction.bidStatus === 'up' ? ChevronUp : ChevronDown;
    const trendClass = auction.bidStatus === 'up' ? 'trend-up' : 'trend-down';
    
    return (
        <div className="auction-details-page">
            <h1 className="section-title">Raw Materials</h1>
            
            <div className="raw-materials-section">
                {/* 1. Image Gallery Section (Auto-scrolling + Thumbnails + Timer) */}
                <div className="image-gallery-container">
                    <div className="image-gallery">
                        {/* ✅ Using external Timer component */}
                        <Timer endTime={auction.endTime} /> 
                        <img 
                            src={auction.images[currentImageIndex]} 
                            alt={auction.name} 
                            className="auction-details-img" 
                        />
                    </div>
                    <div className="thumbnail-gallery">
                        {auction.images.map((image, index) => (
                            <img 
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. Details Section */}
                <div className="product-details">
                    <h2 className="product-name">{auction.name}</h2>
                    
                    <p className="agro-productions">
                        <User size={16} /> 
                        <Link to={`/seller/${auction.producerId}`} className="producer-link">
                            {auction.producer}
                        </Link>
                    </p>
                    
                    <div className="bid-info-row">
                        <p className="highest-bid">
                            Highest Bid: <span className="bid-value">₹{auction.currentBid.toLocaleString('en-IN')}</span>
                            <span className={`bid-trend-indicator ${trendClass}`}>
                                <TrendIcon size={12} />
                            </span>
                        </p>
                        <p className="base-price">Base Price: ₹{auction.basePrice.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="auction-timing">
                        <p className="timing-item">
                            <span>Auction Starts: {formatDate(auction.startTime)}</span>
                        </p>
                        <p className="timing-item">
                            <span>Auction Ends: {formatDate(auction.endTime)}</span>
                        </p>
                    </div>
                    
                    <div className="action-row">
                        <span className="stock-indicator">
                            <CircleDollarSign size={18} /> Available: {auction.quantityAvailable} kgs
                        </span>

                        <button className="action-button cart-button">ADD TO CART</button>
                        <button 
                            className="action-button place-bid-button"
                            onClick={activateBidding}
                            disabled={isBiddingMode} 
                        >
                            PLACE BID
                        </button>
                    </div>
                    
                    {feedback && (
                        <div className={`feedback-message ${feedback.type}`}>
                            {feedback.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            <p>{feedback.message}</p>
                        </div>
                    )}

                    {isBiddingMode && (
                        <div className="bid-quantity-box">
                            <p className="box-title">Enter your bid for {auction.quantityAvailable} kgs:</p>
                            
                            <div className="bid-input-container">
                                <div className="bid-input">
                                    <button onClick={handleDecrementBid}>-</button>
                                    <input 
                                        type="number" 
                                        value={bidAmount} 
                                        onChange={handleBidChange} 
                                        min={auction.currentBid + auction.bidStep}
                                        step={auction.bidStep} 
                                    />
                                    <button onClick={handleIncrementBid}>+</button>
                                </div>
                                <button 
                                    className="action-button place-bid-small-button"
                                    onClick={handleConfirmBid}
                                >
                                    Confirm Bid
                                </button>
                            </div>
                            <p className="bid-info-text">Next minimum bid: ₹{(auction.currentBid + auction.bidStep).toLocaleString('en-IN')} (Increments of ₹{auction.bidStep.toLocaleString('en-IN')})</p>
                        </div>
                    )}
                    
                    <div className="description-section">
                        <h3>Product Description</h3>
                        <p>{auction.fullDescription}</p>
                        <p className="product-location">Location: {auction.location}</p>
                    </div>
                </div>
            </div>
            
            {/* Bid History/Log Section */}
            <div className="bid-history-log">
                <h2><History size={20} className="history-icon"/> Bid History ({bidHistory.length} Bids)</h2>
                <div className="bid-history-table">
                    <div className="table-header table-grid">
                        <span>User</span>
                        <span>Bid Amount</span>
                        <span>Time</span>
                    </div>
                    {bidHistory.map((bid, index) => (
                        <div key={index} className={`table-row table-grid ${bid.user === 'You' ? 'my-bid' : ''}`}>
                            <span className="bid-user">{bid.user}</span>
                            <span className="bid-amount">₹{bid.amount.toLocaleString('en-IN')}</span>
                            <span className="bid-time">{bid.time}</span>
                        </div>
                    ))}
                    {bidHistory.length === 0 && <p className="no-bids">Be the first to bid on this item!</p>}
                </div>
            </div>

            <h2 className="section-title product-list-title">Similar Products</h2>
            <div className="product-grid">
                {similarProductsData.map(product => (
                    <AuctionCard key={product.id} auction={product} />
                ))}
            </div>

            <h2 className="section-title product-list-title">Auction Ends Soon</h2>
            <div className="product-grid">
                {auctionEndsSoonData.map(product => (
                    <AuctionCard key={product.id} auction={product} />
                ))}
            </div>
        </div>
    );
}
