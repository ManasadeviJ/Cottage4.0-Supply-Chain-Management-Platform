import React, { useState, useEffect } from 'react';
// Assuming your AddressForm is now located here:
import AddressForm from  '../../components/Forms/ProfileAddressForm/AddressForm';
// If you kept the original path, change the import to:
// import AddressForm from '../Forms/ProfileAddressForm/ProfileAddressForm';

// --- MOCK DATA & API FUNCTIONS ---
const MOCK_ADDRESSES = [
    { id: 'addr_1', name: 'Home Address', fullName: 'John Doe', line1: '123 Mock St', line2: 'Near the Park', city: 'Test City', state: 'TS', pincode: '111111', country: 'India', isDefault: true },
    { id: 'addr_2', name: 'Work Address', fullName: 'John Doe', line1: '456 Fake Ave', line2: '', city: 'Data Town', state: 'DT', pincode: '222222', country: 'India', isDefault: false },
];

const mockFetchAddresses = () => new Promise(resolve => setTimeout(() => resolve(MOCK_ADDRESSES), 500));
const mockSaveAddress = (address) => new Promise(resolve => {
    // Simulate API delay and assign a new ID if none exists
    const newId = address.id || `addr_${Date.now()}`; 
    setTimeout(() => resolve({ ...address, id: newId, fullName: address.fullName || 'User Name' }), 1000);
});
const mockDeleteAddress = (id) => new Promise(resolve => setTimeout(() => resolve(id), 500));
// ------------------------------------

const ClientAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null); // The address object being edited
    const [showForm, setShowForm] = useState(false);

    // 1. Initial Data Fetch (Mock)
    useEffect(() => {
        setLoading(true);
        mockFetchAddresses().then(data => {
            setAddresses(data);
            setLoading(false);
        });
    }, []);

    // 2. Handle Form Submission (Save/Update)
    const handleFormSubmit = async (addressData) => {
        setSubmitting(true);
        try {
            const savedAddress = await mockSaveAddress(addressData);
            
            // Update local state based on whether it was a new address or an edit
            setAddresses(prev => {
                if (addressData.id) {
                    // Edit: replace the existing address
                    return prev.map(a => a.id === savedAddress.id ? savedAddress : a);
                } else {
                    // Add: append the new address
                    return [...prev, savedAddress];
                }
            });
            
            setShowForm(false);
            setEditingAddress(null);

        } catch (error) {
            console.error("Mock save error:", error);
            alert("Failed to save address. Check console for details.");
        } finally {
            setSubmitting(false);
        }
    };

    // 3. Handle Deletion
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        // Optimistic UI update (optional, but good practice)
        const originalAddresses = addresses;
        setAddresses(prev => prev.filter(a => a.id !== id));
        
        try {
            await mockDeleteAddress(id);
        } catch (error) {
            console.error("Mock delete error:", error);
            alert("Failed to delete address.");
            setAddresses(originalAddresses); // Revert on error
        }
    };

    // 4. Handle Edit/Add UI flow
    const handleAddClick = () => {
        setEditingAddress({}); // Empty object means "Add New"
        setShowForm(true);
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);
    };


    if (loading) {
        return <div className="form-view-container">Loading address book...</div>;
    }
    
    // RENDER: Address Form (When adding or editing)
    if (showForm) {
        return (
            <div className="form-view-container">
                <AddressForm 
                    initialData={editingAddress} 
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    submitting={submitting}
                />
            </div>
        );
    }

    // RENDER: Address List View
    return (
        <div className="form-view-container client-addresses-list">
            <h2>My Addresses</h2>
            
            <button className="add-button primary-btn" onClick={handleAddClick}>
                + Add New Address
            </button>

            {addresses.length === 0 && <p className="empty-state">You have no saved addresses. Click "Add New Address" to begin.</p>}

            <div className="address-grid">
                {addresses.map(address => (
                    <div key={address.id} className={`address-card ${address.isDefault ? 'default-address' : ''}`}>
                        
                        <div className="address-header">
                            <h4>{address.name} {address.isDefault && <span className="default-tag">(Default)</span>}</h4>
                        </div>
                        
                        <p><strong>{address.fullName}</strong></p>
                        <p>{address.line1}{address.line2 && `, ${address.line2}`}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p>{address.country}</p>
                        
                        <div className="address-actions">
                            <button className="edit-button secondary-btn" onClick={() => handleEditClick(address)}>Edit</button>
                            <button className="delete-button danger-btn" onClick={() => handleDelete(address.id)} disabled={address.isDefault}>Delete</button>
                            {/* In a real app, this would trigger a mock API call to set the default */}
                            {!address.isDefault && <button className="set-default-button simple-btn">Set as Default</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientAddresses;