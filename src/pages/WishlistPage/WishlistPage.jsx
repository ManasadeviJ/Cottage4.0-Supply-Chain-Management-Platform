import React, { useState, useRef, useEffect, useCallback } from 'react';
import WishlistProductCard from '../../components/WishlistProductCard/WishlistProductCard'; // Corrected path
import './WishlistPage.css'; 

// --- 1. Initial Sample Product Data (Outside Component) ---
const INITIAL_PRODUCTS_WISHLIST = [
    // Marketplace Products (Type: 'buy')
    { id: 1, type: 'buy', name: 'Premium Leather Wallet', price: 899, originalPrice: 2999, discount: 70, image: 'product1.jpg' },
    { id: 3, type: 'buy', name: 'Noise-Cancelling Headphones', price: 1999, originalPrice: 9999, discount: 80, image: 'product3.jpg' },
    { id: 4, type: 'buy', name: 'Electric Coffee Maker', price: 4500, originalPrice: 6000, discount: 25, image: 'product4.jpg' },
    { id: 6, type: 'buy', name: '4K Ultra HD Monitor', price: 22000, originalPrice: 35000, discount: 37, image: 'product6.jpg' },
    { id: 7, type: 'buy', name: 'Designer Backpack', price: 1599, originalPrice: 4000, discount: 60, image: 'product7.jpg' },
    { id: 9, type: 'buy', name: 'Smart Home Speaker', price: 3499, originalPrice: 5000, discount: 30, image: 'product9.jpg' },
    { id: 10, type: 'buy', name: 'Portable Power Bank', price: 999, originalPrice: 1999, discount: 50, image: 'product10.jpg' },

    // Auction Products (Type: 'auction')
    { id: 2, type: 'auction', name: 'Vintage Swiss Watch', currentBid: 12500, status: 'increasing', image: 'product2.jpg', endsIn: '2025-10-15T10:00:00' },
    { id: 5, type: 'auction', name: 'Limited Edition Sneaker', currentBid: 5500, status: 'decreasing', image: 'product5.jpg', endsIn: '2025-10-01T14:30:00' },
    { id: 8, type: 'auction', name: 'Rare Collectible Coin', currentBid: 850, status: 'increasing', image: 'product8.jpg', endsIn: '2025-09-30T23:59:59' },
];

const tabs = [
    { key: 'autojoined', label: 'Auction Lots' }, // Shortened tab names for better visual spacing
    { key: 'marketplace', label: 'Marketplace Items' },
];

// --- 2. WishlistPage Component ---
export default function WishlistPage() {
    const [activeTab, setActiveTab] = useState('marketplace'); // Default to marketplace items for the initial image
    const [wishlistProducts, setWishlistProducts] = useState(INITIAL_PRODUCTS_WISHLIST);
    
    // Refs for sliding underline logic
    const tabRefs = useRef({});
    const [underlineStyle, setUnderlineStyle] = useState({});
    const containerRef = useRef(null); // Ref for the tab container

    // Function to handle product removal
    const handleRemoveProduct = useCallback((id) => {
        setWishlistProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    }, []);

    // Filter products based on the active tab
    const filteredProducts = wishlistProducts.filter(p => 
        activeTab === 'autojoined' ? p.type === 'auction' : p.type === 'buy'
    );

    // Function to calculate and update the sliding underline position (Half-Width Logic)
    const updateUnderline = useCallback((key) => {
        const containerElement = containerRef.current;

        if (containerElement) {
            const containerWidth = containerElement.getBoundingClientRect().width;
            
            // Translate the line to the start of the current half (0 or 50% of container width)
            const isAutojoined = key === 'autojoined';
            
            setUnderlineStyle({
                // Force the width to exactly half of the container
                width: `${containerWidth / 2}px`, 
                // Translate based on half the container width
                transform: `translateX(${isAutojoined ? 0 : containerWidth / 2}px)`, 
            });
        }
    }, []);


    // Handle tab click
    const handleTabClick = (key) => {
        setActiveTab(key);
        // Update is called here and in useEffect
        updateUnderline(key); 
    };

    // Initial load and resize handling (to ensure the underline stays aligned)
    useEffect(() => {
        // Run once after initial render
        const timeoutId = setTimeout(() => updateUnderline(activeTab), 0);
        
        // Setup resize listener
        const handleResize = () => updateUnderline(activeTab);
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [activeTab, updateUnderline, wishlistProducts]); // Depend on wishlistProducts to recalculate if grid size changes

    return (
        <div className="wishlist-page-container">
            
            {/* Tab Navigation Section */}
            <div className="wishlist-tabs-container">
                <div className="wishlist-tabs" ref={containerRef}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            ref={el => tabRefs.current[tab.key] = el}
                            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.key)}
                        >
                            {tab.label} ({wishlistProducts.filter(p => (tab.key === 'autojoined' ? p.type === 'auction' : p.type === 'buy')).length})
                        </button>
                    ))}
                </div>
                {/* Sliding Underline Element */}
                <div className="tab-underline" style={underlineStyle}></div>
            </div>

            {/* Product Grid Section */}
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <WishlistProductCard 
                            key={product.id} 
                            product={product} 
                            onRemove={handleRemoveProduct} // Pass the removal function
                        />
                    ))
                ) : (
                    <p className="no-products-message">No items found in this section of your Wishlist.</p>
                )}
            </div>
        </div>
    );
};