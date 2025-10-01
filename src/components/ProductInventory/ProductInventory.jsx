import React from 'react';
import InventoryCard from '../../components/Card/InventoryCard/InventoryCard'; 
import './ProductInventory.css'; // Assume CSS for the grid layout

// Mock data structure, adapted to clearly show status and units
const mockInventory = [
    { 
        id: 1, name: 'Organic Red Chilli', category: 'Spices', quantity: 500, unit: 'Kg', 
        harvestDate: '2025-08-15', status: 'Ready', // Ready to be auctioned
        image: 'https://via.placeholder.com/250/d94f4f/ffffff?text=Chilli' 
    },
    { 
        id: 2, name: 'Handloom Cotton', category: 'Textiles', quantity: 200, unit: 'm', 
        harvestDate: null, status: 'In Production', // Cannot be auctioned yet
        image: 'https://via.placeholder.com/250/333/ffffff?text=Cotton' 
    },
    { 
        id: 3, name: 'Mustard Oil (Cold Pressed)', category: 'Oils', quantity: 150, unit: 'Liters', 
        harvestDate: null, status: 'Sold Out', // Already sold out
        image: 'https://via.placeholder.com/250/d94f4f/ffffff?text=Oil' 
    },
];

const ProductInventory = ({ role }) => {
    const inventoryType = role === 'Farmer' ? 'Farm Produce' : 'Cottage Products';
    
    return (
        <div className="product-inventory-container">
            <h2>{inventoryType} (Inventory)</h2>
            <p className="inventory-description">Manage your stock, check product status, and launch new auctions.</p>

            <div className="inventory-actions">
                {/* This button should eventually navigate to the 'Start Auction Form' section */}
                <button 
                    className="primary-action-btn" 
                    onClick={() => alert(`Navigating to 'Start Auction Form' to add new item.`)}
                >
                    + Add New Item
                </button>
            </div>

            <div className="product-grid">
                {mockInventory.map(product => (
                    <InventoryCard 
                        key={product.id} 
                        product={product} 
                        role={role} 
                    />
                ))}
            </div>

            {mockInventory.length === 0 && (
                <p className="empty-state">Your inventory is empty. Add a new item to get started!</p>
            )}
        </div>
    );
};

export default ProductInventory;