import React, { useState, useEffect, useRef, useCallback } from "react";
import "./CartPage.css";
// NOTE: Ensure your project has an image file at this path or replace it.
import peanutImage1 from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png";

// --- Initial Mock Data ---
const initialMarketplaceItems = [
  { id: "mp1", name: "Whirlpool 7 kg Magic Clean 5 Star Fully Automatic Top Load", price: 19550, discountedPrice: 14470, image: peanutImage1, qty: 1, isSelected: true },
  { id: "mp2", name: "Premium Wheat Flour (50kg)", price: 3000, discountedPrice: 2800, image: peanutImage1, qty: 2, isSelected: false },
];
const initialAuctionItems = [
  { id: "a1", name: "Organic Rice - 100kg Lot", finalBid: 12500, image: peanutImage1, qty: 1, isSelected: true },
  { id: "a2", name: "Bulk Fertiliser (50 Bags)", finalBid: 8750, image: peanutImage1, qty: 1, isSelected: false },
];

// Mock saved addresses
const savedAddresses = [
  { id: "addr1", name: "John Doe", street: "123 Main Street", cityState: "Chennai, Tamil Nadu - 600001", default: true },
  { id: "addr2", name: "Jane Smith", street: "456 Side Road", cityState: "Bangalore, Karnataka - 560001", default: false },
];

// ---------------------------------------------------------------------
// 1. Custom Stepper Component (LABELS ON LINE, SHORTER CIRCLE)
// ---------------------------------------------------------------------
const Stepper = ({ step, handleStepClick }) => {
    const steps = [
        { name: "BAG", number: 1 },
        { name: "ADDRESS", number: 2 },
        { name: "PAYMENT", number: 3 },
    ];

    return (
        <div className="stepper-new">
            {steps.map((s, index) => (
                <React.Fragment key={s.number}>
                    <button
                        onClick={() => handleStepClick(s.number)}
                        className={`step-btn ${step >= s.number ? "completed" : ""} ${step === s.number ? "active" : ""}`}
                    >
                        <span className="step-circle">
                            {/* Using ✓ symbol for consistency, styled via CSS */}
                            {step > s.number ? (
                                <span className="check-mark"></span> /* Checkmark handled by CSS background */
                            ) : (
                                s.number
                            )}
                        </span>
                    </button>
                    {index < steps.length - 1 && (
                        <div className={`step-line-wrapper ${step > s.number ? "completed-line-wrapper" : ""}`}>
                            <div className={`step-line ${step > s.number ? "completed-line" : ""}`}></div>
                            <span className="step-label">{steps[index + 1].name}</span> {/* Label on the line */}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};


// ---------------------------------------------------------------------
// 2. Cart Row Component (Mobile Optimizations, Cross Button)
// ---------------------------------------------------------------------
const CartTableRow = ({ item, type, updateItemSelection, removeItem, updateItemQuantity }) => {
  const isMarketplace = type === "marketplace";
  const price = isMarketplace ? item.discountedPrice : item.finalBid;
  const subTotal = price * item.qty;

  const increaseQty = () => updateItemQuantity(item.id, item.qty + 1);
  const decreaseQty = () => {
    if (item.qty > 1) updateItemQuantity(item.id, item.qty - 1);
  };
  const toggleSelect = () => updateItemSelection(item.id, !item.isSelected);
  // const handleShare = () => { alert(`Sharing ${item.name}`); }; // Removed as per request
  const handleDelete = () => { removeItem(item.id); };

  return (
    <div className="cart-table-row">
      <div className="item-details-wrapper">
        <input
            type="checkbox"
            className="item-checkbox"
            checked={item.isSelected}
            onChange={toggleSelect}
        />
        <img src={item.image} alt={item.name} className="item-image" />
        <div>
          <p className="item-name">{item.name}</p>
        </div>
      </div>

      {/* Price cell is hidden on mobile via CSS, kept for desktop */}
      <div className="price-cell">
        <p className="price-current">₹{price.toLocaleString("en-IN")}</p>
      </div>

      <div className="quantity-cell">
        <div className="quantity-control">
            <button className="qty-btn" onClick={decreaseQty} disabled={item.qty <= 1}>-</button>
            <input
              type="number"
              value={item.qty}
              min="1"
              className="quantity-input-box"
              readOnly
            />
            <button className="qty-btn" onClick={increaseQty}>+</button>
        </div>
      </div>

      <div className="subtotal-cell">
        {/* On mobile, only show value, label hidden by CSS */}
        <p className="subtotal-value">₹{subTotal.toLocaleString("en-IN")}</p>
      </div>

      {/* Cross button for removal */}
      <button onClick={handleDelete} className="remove-item-btn">
          &#x2715; {/* Unicode for multiplication sign / cross */}
      </button>

      {/* Mobile/Tablet Actions (Share/Delete buttons removed from here as per request) */}
      {/* <div className="item-actions-mobile">
          <button onClick={handleShare} className="action-btn share-btn">
              <span role="img" aria-label="Share">🔗</span> Share
          </button>
          <button onClick={handleDelete} className="action-btn delete-btn">
              <span role="img" aria-label="Delete">🗑️</span> Delete
          </button>
      </div> */}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Global Cart Actions (Using custom icons based on request)
// ---------------------------------------------------------------------
const CartActionHeader = ({ currentItems, toggleSelectAll, deleteSelected, shareSelected }) => {
    const totalItems = currentItems.length;
    const selectedCount = currentItems.filter(i => i.isSelected).length;
    const allSelected = totalItems > 0 && selectedCount === totalItems;

    return (
        <div className="cart-action-header">
            <div className="select-all-group">
                <input
                    type="checkbox"
                    id="selectAll"
                    className="select-all-checkbox"
                    checked={allSelected}
                    onChange={() => toggleSelectAll(!allSelected)}
                />
                <label htmlFor="selectAll">
                    Select All ({selectedCount} Selected)
                </label>
            </div>

            <div className="global-actions">
                {/* SHARE ICON */}
                <button
                    onClick={shareSelected}
                    className="action-btn share-btn icon-only"
                    disabled={selectedCount === 0}
                >
                    <span></span> {/* Icon handled by CSS */}
                </button>
                {/* DELETE ICON */}
                <button
                    onClick={deleteSelected}
                    className="action-btn delete-btn icon-only"
                    disabled={selectedCount === 0}
                >
                    <span></span> {/* Icon handled by CSS */}
                </button>
            </div>
        </div>
    );
};


// ---------------------------------------------------------------------
// 4. Address Section Component (Show Saved Addresses / New Address Form)
// ---------------------------------------------------------------------
const AddressSection = ({ onAddNewAddressClick, showNewAddressForm, deliveryAddress, setDeliveryAddress }) => {
    const [newAddressFormVisible, setNewAddressFormVisible] = useState(showNewAddressForm);
    const [showSavedAddressesList, setShowSavedAddressesList] = useState(false);
    const [tempNewAddress, setTempNewAddress] = useState({ fullName: "", streetAddress: "", city: "", state: "", pincode: "" });

    useEffect(() => {
        setNewAddressFormVisible(showNewAddressForm);
    }, [showNewAddressForm]);

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setTempNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = () => {
        if (tempNewAddress.fullName && tempNewAddress.streetAddress && tempNewAddress.pincode) {
            // In a real app, you'd save this to a backend/global state
            const newAddr = {
                id: `addr${Math.random()}`, // Simple unique ID
                name: tempNewAddress.fullName,
                street: tempNewAddress.streetAddress,
                cityState: `${tempNewAddress.city}, ${tempNewAddress.state} - ${tempNewAddress.pincode}`,
                default: false,
            };
            // For now, just set it as the current delivery address
            setDeliveryAddress(newAddr);
            setTempNewAddress({fullName: "", streetAddress: "", city: "", state: "", pincode: ""});
            setNewAddressFormVisible(false);
            setShowSavedAddressesList(false); // Hide address list after saving new
            onAddNewAddressClick(false); // Reset parent state
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const handleCancelNewAddress = () => {
        setNewAddressFormVisible(false);
        onAddNewAddressClick(false);
        // If there are saved addresses, show them; otherwise, stay on current delivery address
        if (savedAddresses.length > 0) {
            setShowSavedAddressesList(true);
        }
    };

    const handleSelectAddress = (address) => {
        setDeliveryAddress(address);
        setShowSavedAddressesList(false);
        setNewAddressFormVisible(false);
        onAddNewAddressClick(false);
    };

    const handleChangeAddressClick = () => {
        if (savedAddresses.length > 0) {
            setShowSavedAddressesList(true);
            setNewAddressFormVisible(false); // Hide new address form when showing list
        } else {
            setNewAddressFormVisible(true);
            setShowSavedAddressesList(false);
        }
    };

    const handleAddNewButtonClick = () => {
        setNewAddressFormVisible(true);
        setShowSavedAddressesList(false);
        onAddNewAddressClick(true);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="address-section">
            <div className="section-header-row">
                <h3>Delivery Address</h3>
                {isMobile ? (
                    <button className="add-new-address-btn plus-icon-only" onClick={handleAddNewButtonClick}>
                        +
                    </button>
                ) : (
                    <button className="add-new-address-btn simple-icon-btn" onClick={handleAddNewButtonClick}>
                        + Add New
                    </button>
                )}
            </div>

            {/* Display current selected address if no forms/lists are open */}
            {!newAddressFormVisible && !showSavedAddressesList && deliveryAddress && (
                <div className="address-card">
                    <p><strong>{deliveryAddress.name}</strong></p>
                    <p>{deliveryAddress.street}</p>
                    <p>{deliveryAddress.cityState}</p>
                    <button className="change-address-btn primary-btn" onClick={handleChangeAddressClick}>Change Address</button>
                </div>
            )}

            {/* Show Saved Addresses List */}
            {showSavedAddressesList && (
                <div className="saved-addresses-list">
                    <h4>Select Delivery Address</h4>
                    {savedAddresses.map(addr => (
                        <div key={addr.id} className={`address-card saved-address-item ${deliveryAddress && deliveryAddress.id === addr.id ? 'selected-address' : ''}`} onClick={() => handleSelectAddress(addr)}>
                            <p><strong>{addr.name}</strong></p>
                            <p>{addr.street}</p>
                            <p>{addr.cityState}</p>
                            {deliveryAddress && deliveryAddress.id === addr.id && <span className="selected-indicator">✓ Selected</span>}
                        </div>
                    ))}
                    <button className="add-new-from-list-btn primary-btn" onClick={handleAddNewButtonClick}>Add New Address</button>
                    <button className="cancel-address-selection-btn secondary-btn" onClick={() => setShowSavedAddressesList(false)}>Cancel</button>
                </div>
            )}

            {/* Show New Address Form */}
            {newAddressFormVisible && (
                <div className="new-address-form">
                    <h4>Add New Address Details</h4>
                    <input type="text" placeholder="Full Name" name="fullName" value={tempNewAddress.fullName} onChange={handleNewAddressChange} />
                    <input type="text" placeholder="Street Address" name="streetAddress" value={tempNewAddress.streetAddress} onChange={handleNewAddressChange} />
                    <input type="text" placeholder="City" name="city" value={tempNewAddress.city} onChange={handleNewAddressChange} />
                    <input type="text" placeholder="State" name="state" value={tempNewAddress.state} onChange={handleNewAddressChange} />
                    <input type="text" placeholder="Pincode" name="pincode" value={tempNewAddress.pincode} onChange={handleNewAddressChange} />
                    <div className="address-form-buttons">
                        <button className="save-address-btn primary-btn" onClick={handleSaveAddress}>Save Address</button>
                        <button className="cancel-address-btn secondary-btn" onClick={handleCancelNewAddress}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Other Helper Components (Defined for completeness) ---
const SlidingTabNavigation = ({ activeTab, setActiveTab, mockMarketplaceItems, mockAuctionItems }) => {
    const tabsRef = useRef(null);
    const activeTabRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    useEffect(() => {
        if (activeTabRef.current && tabsRef.current) {
            const activeRect = activeTabRef.current.getBoundingClientRect();
            const parentRect = tabsRef.current.getBoundingClientRect();

            setIndicatorStyle({ width: activeRect.width, left: activeRect.left - parentRect.left });
        }
    }, [activeTab]);

    const handleTabClick = (tabName, e) => {
        setActiveTab(tabName);
        activeTabRef.current = e.currentTarget;
    };
    return (
        <div className="tab-navigation" ref={tabsRef}>
            <button ref={activeTab === "Marketplace" ? activeTabRef : null} className={`tab-btn ${activeTab === "Marketplace" ? "active" : ""}`} onClick={(e) => handleTabClick("Marketplace", e)}>Marketplace Items ({mockMarketplaceItems.length})</button>
            <button ref={activeTab === "Auction" ? activeTabRef : null} className={`tab-btn ${activeTab === "Auction" ? "active" : ""}`} onClick={(e) => handleTabClick("Auction", e)}>Auction Won Lots ({mockAuctionItems.length})</button>
            <div className="tab-indicator" style={indicatorStyle}></div>
        </div>
    );
};
const PriceSummary = ({ totals, onNext }) => {
    const totalDiscount = 805;
    const platformFee = 20;
    const finalTotalAmount = totals.totalAmount - totalDiscount + platformFee;
    return (
        <div className="price-details-card">
            <h4 className="summary-title">PRICE DETAILS <span>({totals.totalItems} Items)</span></h4>
            <div className="price-line"><span className="theme-color-text">Total MRP</span><span className="theme-color-text">₹{totals.subTotal.toLocaleString("en-IN")}</span></div>
            <div className="price-line discount"><span>Discount on MRP</span><span>- ₹{totalDiscount.toLocaleString("en-IN")}</span></div>
            <div className="price-line coupon"><span className="theme-color-text">Coupon Discount</span><span className="apply-coupon">Apply Coupon</span></div>
            <div className="price-line platform-fee"><span className="theme-color-text">Platform & Event Fee <span className="know-more">Know More</span></span><span className="theme-color-text">₹{platformFee.toLocaleString("en-IN")}</span></div>
            <hr className="summary-divider" />
            <div className="price-line total-amount"><span className="theme-color-text">Total Amount</span><span className="theme-color-text">₹{finalTotalAmount.toLocaleString("en-IN")}</span></div>
            <button className="place-order-btn" onClick={onNext} disabled={totals.totalItems === 0}>
                {totals.step === 3 ? "PAY NOW" : "PROCEED TO " + (totals.step === 1 ? "ADDRESS" : "PAYMENT")}
            </button>
        </div>
    );
};
const PaymentSection = () => {
    const paymentOptions = [
        { id: 'upi', name: 'UPI', description: 'GPay, PhonePe, Paytm (Instant Payment)' },
        { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay' },
        { id: 'netbanking', name: 'Net Banking', description: 'All major banks supported' },
        { id: 'cod', name: 'Cash on Delivery (COD)', description: 'Limited to certain pin codes (Pay upon receipt)' },
    ];
    const [selectedOption, setSelectedOption] = useState('upi');
    return (
        <div className="payment-section">
            <h3>Select Payment Option</h3>
            <div className="payment-options-list">
                {paymentOptions.map(option => (
                    <label key={option.id} className={`payment-option-card ${selectedOption === option.id ? 'selected' : ''}`}>
                        <input type="radio" name="paymentOption" value={option.id} checked={selectedOption === option.id} onChange={() => setSelectedOption(option.id)} className="payment-radio-input"/>
                        <div className="payment-details"><span className="payment-name">{option.name}</span><span className="payment-description">{option.description}</span></div>
                    </label>
                ))}
            </div>
        </div>
    );
};


// ---------------------------------------------------------------------
// 5. Main Cart Page Component
// ---------------------------------------------------------------------
export default function CartPage() {
  const [activeTab, setActiveTab] = useState("Marketplace");
  const [step, setStep] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [marketplaceItems, setMarketplaceItems] = useState(initialMarketplaceItems);
  const [auctionItems, setAuctionItems] = useState(initialAuctionItems);
  const [deliveryAddress, setDeliveryAddress] = useState(savedAddresses[0] || null); // Set initial default address

  // Determine current items based on tab
  const currentItems = activeTab === "Marketplace" ? marketplaceItems : auctionItems;
  const setCurrentItems = activeTab === "Marketplace" ? setMarketplaceItems : setAuctionItems;


  // --- Selection Logic ---
  const toggleSelectAll = useCallback((shouldSelect) => {
    setCurrentItems(prevItems => prevItems.map(item => ({ ...item, isSelected: shouldSelect })));
  }, [setCurrentItems]);

  const updateItemSelection = useCallback((id, isSelected) => {
    setCurrentItems(prevItems => prevItems.map(item =>
        item.id === id ? { ...item, isSelected } : item
    ));
  }, [setCurrentItems]);


  // --- Quantity/Delete Logic ---
  const updateItemQuantity = useCallback((id, qty) => {
    setCurrentItems(prevItems => prevItems.map(item =>
        item.id === id ? { ...item, qty } : item
    ));
  }, [setCurrentItems]);

  const removeItem = useCallback((id) => {
    setCurrentItems(prevItems => {
        // alert(`Item ${id} deleted.`); // Removed alert as per request implicit with cross btn
        return prevItems.filter(item => item.id !== id);
    });
  }, [setCurrentItems]);

  const deleteSelected = () => {
    const selectedCount = currentItems.filter(i => i.isSelected).length;
    if (selectedCount === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected item(s)?`)) {
        setCurrentItems(prevItems => prevItems.filter(item => !item.isSelected));
        alert(`${selectedCount} item(s) deleted.`);
    }
  };

  const shareSelected = () => {
    const selectedCount = currentItems.filter(i => i.isSelected).length;
    alert(`Sharing links for ${selectedCount} item(s).`);
  };


  // --- Totals Calculation (across ALL tabs) ---
  const calculateTotals = () => {
    const marketplaceSubtotal = marketplaceItems.reduce((acc, item) => acc + (item.isSelected ? item.discountedPrice * item.qty : 0), 0);
    const auctionSubtotal = auctionItems.reduce((acc, item) => item.finalBid && item.isSelected ? acc + item.finalBid * item.qty : acc, 0);
    const totalItemsCount = marketplaceItems.filter(i => i.isSelected).length + auctionItems.filter(i => i.isSelected).length;

    return {
      subTotal: marketplaceSubtotal + auctionSubtotal,
      totalAmount: marketplaceSubtotal + auctionSubtotal, // Simplified for mock
      totalItems: totalItemsCount,
      step,
    };
  };

  const totals = calculateTotals();

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleStepClick = (newStep) => {
    if (newStep <= step) setStep(newStep);
  };

  return (
    <div className="cart-page-container">

      <Stepper step={step} handleStepClick={handleStepClick} />

      <div className="cart-content-wrapper">
        <div className="cart-left-section">
          {step === 1 && (
            <>
              <SlidingTabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                mockMarketplaceItems={marketplaceItems}
                mockAuctionItems={auctionItems}
              />

              <CartActionHeader
                  currentItems={currentItems}
                  toggleSelectAll={toggleSelectAll}
                  deleteSelected={deleteSelected}
                  shareSelected={shareSelected}
              />

              <div className="cart-table">
                <div className="table-header">
                  <div style={{ paddingLeft: '40px' }}>Product</div>
                  <div>Price</div>
                  <div style={{ textAlign: "center" }}>Quantity</div>
                  <div style={{ textAlign: "right" }}>Sub Total</div>
                  {/* Added space for the cross button on desktop */}
                  <div style={{ width: '24px' }}></div>
                </div>

                {currentItems.map((item) => (
                  <CartTableRow
                    key={item.id}
                    item={item}
                    type={activeTab === "Marketplace" ? "marketplace" : "auction"}
                    updateItemSelection={updateItemSelection}
                    removeItem={removeItem}
                    updateItemQuantity={updateItemQuantity}
                  />
                ))}
                {currentItems.length === 0 && (
                    <div className="empty-cart-message">Your {activeTab} cart is empty.</div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <AddressSection
                showNewAddressForm={showNewAddressForm}
                onAddNewAddressClick={setShowNewAddressForm}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
            />
          )}

          {step === 3 && (
            <PaymentSection />
          )}
        </div>

        {/* Price Summary */}
        <PriceSummary totals={totals} onNext={() => (step === 3 ? alert("Processing Payment...") : handleNextStep())} />
      </div>
    </div>
  );
}