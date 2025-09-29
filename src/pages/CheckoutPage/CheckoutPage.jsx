import React from 'react';
import { useLocation } from 'react-router-dom';
import './CheckoutPage.css'; // We'll create this CSS

// A component to display a summary card for a section
const CheckoutSectionSummary = ({ title, items, isAuction = false }) => {
    return (
        <div className="checkout-section">
            <h3>{title} ({items.length} Items)</h3>
            {items.map(item => (
                <div key={item.id} className="checkout-item-summary">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                        Price: ₹{isAuction 
                            ? item.finalBid.toLocaleString('en-IN') 
                            : item.discountedPrice.toLocaleString('en-IN')}
                    </p>
                    <p className="item-qty">Qty: {item.qty}</p>
                </div>
            ))}
        </div>
    );
};

export default function CheckoutPage() {
    const location = useLocation();
    // Retrieve data passed from the CartPage
    const { marketplace, auction } = location.state || { marketplace: [], auction: [] };

    // Hybrid Approach Logic: Calculate totals for both product types
    const calculateFinalTotals = () => {
        const marketplaceTotal = marketplace.reduce((acc, item) => 
            acc + (item.discountedPrice * item.qty) + item.protectFee - item.maxSavings, 0);

        const auctionTotal = auction.reduce((acc, item) => 
            acc + (item.finalBid * item.qty), 0);
        
        const subTotal = marketplaceTotal + auctionTotal;
        const totalItems = marketplace.length + auction.length;
        
        // Mocking other fees for a realistic checkout
        const deliveryFee = totalItems > 0 ? 40 : 0;
        const convenienceFee = 20;

        const totalPayable = subTotal + deliveryFee + convenienceFee;

        return { subTotal, deliveryFee, convenienceFee, totalPayable, totalItems };
    };

    const totals = calculateFinalTotals();

    if (totals.totalItems === 0) {
        return (
            <div className="checkout-page-container">
                <h2>Checkout</h2>
                <p>No items found for checkout. Please return to the cart.</p>
            </div>
        );
    }

    const handlePayment = () => {
        alert(`Initiating payment of ₹${totals.totalPayable.toLocaleString('en-IN')}`);
        // In a real application, this would call a payment gateway API
    };

    return (
        <div className="checkout-page-container">
            <h1 className="checkout-title">Unified Checkout</h1>
            <div className="checkout-content-wrapper">
                
                {/* Left Section: Item Review, Delivery Address, Payment Options */}
                <div className="checkout-steps">
                    {/* Step 1: Item Review (Hybrid View) */}
                    <div className="checkout-step-card">
                        <h2>1. Review Order Items (Hybrid)</h2>
                        {marketplace.length > 0 && (
                            <CheckoutSectionSummary 
                                title="Marketplace Products (Fixed Price)" 
                                items={marketplace} 
                            />
                        )}
                        {auction.length > 0 && (
                            <CheckoutSectionSummary 
                                title="Auction Won Products (Final Bid)" 
                                items={auction} 
                                isAuction={true}
                            />
                        )}
                    </div>
                    
                    {/* Step 2: Delivery Details */}
                    <div className="checkout-step-card">
                        <h2>2. Delivery Address</h2>
                        <p className="address-mock">
                            John Doe, Flat 404, Silicon Towers, Bangalore - 560068 
                            <button className="change-btn">Change</button>
                        </p>
                    </div>

                    {/* Step 3: Payment Options (Simplified) */}
                    <div className="checkout-step-card">
                        <h2>3. Payment Method</h2>
                        <div className="payment-options">
                            <label><input type="radio" name="payment" defaultChecked /> Credit/Debit Card</label>
                            <label><input type="radio" name="payment" /> UPI</label>
                            <label><input type="radio" name="payment" /> Net Banking</label>
                        </div>
                    </div>
                </div>

                {/* Right Section: Price Details Card (Unified Total) */}
                <div className="price-details-card checkout-summary-card">
                    <h2>TOTAL ORDER SUMMARY</h2>
                    <hr />
                    <div className="price-line">
                        <span>Subtotal ({totals.totalItems} items)</span>
                        <span>₹{totals.subTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-line">
                        <span>Delivery Fee</span>
                        <span>+ ₹{totals.deliveryFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-line">
                        <span>Convenience Fee</span>
                        <span>+ ₹{totals.convenienceFee.toLocaleString('en-IN')}</span>
                    </div>
                    <hr />
                    <div className="price-line total-amount">
                        <span>Total Payable</span>
                        <span className="total-value">₹{totals.totalPayable.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                        className="pay-now-btn" 
                        onClick={handlePayment}
                    >
                        PAY ₹{totals.totalPayable.toLocaleString('en-IN')}
                    </button>
                    <div className="secure-payments">
                        <span>✅ Safe and Secure Transaction.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}