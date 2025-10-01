import React, { useState, useEffect } from 'react';
// Assuming the CSS file is also renamed or moved
import './ProfileAddressForm.css'; // Keep the import if CSS is shared

// This component is now responsible only for handling form inputs and submission
const AddressForm = ({ initialData, onSubmit, onCancel, submitting }) => {
    // Initialize form state with data passed down (for editing) or empty strings (for adding)
    const [formData, setFormData] = useState({
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '', 
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
        country: initialData.country || 'India',
        // Preserve ID for editing logic in the parent component
        id: initialData.id || null, 
    });

    // Sync state if initialData changes (e.g., if you switch between editing different addresses)
    useEffect(() => {
        setFormData({
            addressLine1: initialData.addressLine1 || '',
            addressLine2: initialData.addressLine2 || '', 
            city: initialData.city || '',
            state: initialData.state || '',
            pincode: initialData.pincode || '',
            country: initialData.country || 'India',
            id: initialData.id || null,
        });
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.addressLine1 || !formData.city || !formData.pincode) {
            alert('Please fill in required fields (Address Line 1, City, Pincode).');
            return;
        }

        // Call the parent's update function (which handles API/mock logic)
        onSubmit(formData); 
    };

    const isEditing = !!initialData.id;

    return (
        <div className="address-section new-address-form">
            <h4>{isEditing ? "Edit Saved Address" : "Add New Address"}</h4>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Address Line 1 *" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required disabled={submitting} />
                <input type="text" placeholder="Address Line 2 (Optional)" name="addressLine2" value={formData.addressLine2} onChange={handleChange} disabled={submitting} />
                <input type="text" placeholder="City *" name="city" value={formData.city} onChange={handleChange} required disabled={submitting} />
                <input type="text" placeholder="State / Province" name="state" value={formData.state} onChange={handleChange} disabled={submitting} />
                <input type="text" placeholder="Pincode *" name="pincode" value={formData.pincode} onChange={handleChange} required disabled={submitting} />
                <input type="text" placeholder="Country" name="country" value={formData.country} onChange={handleChange} readOnly disabled={submitting} />
                
                <div className="address-form-buttons">
                    <button type="submit" className="save-address-btn primary-btn" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Address"}
                    </button>
                    <button type="button" className="cancel-address-btn secondary-btn" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;