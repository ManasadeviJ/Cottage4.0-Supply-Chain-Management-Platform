import React, { useState, useEffect } from 'react';
import './ClientPayments.css';

// --- MOCK API FUNCTIONS & DATA ---
const MOCK_PAYMENTS_DATA = {
    bankAccount: { 
        bankName: "HSBC",
        accountHolderName: "Amal Clooney",
        accountNumber: "**********1234",
        ifscCode: "HSBC0001234",
        isPrimary: true,
        type: "Bank" 
    },
    upi: {
        upiId: "amal.clooney@upi",
        isPrimary: false,
        type: "UPI"
    },
};

const mockFetchPayments = async (uid) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Return a deep copy to prevent direct state mutation issues with mock
    return Object.keys(MOCK_PAYMENTS_DATA).map(key => ({ ...MOCK_PAYMENTS_DATA[key] }));
};

const mockUpdatePayment = async (paymentId, updates) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would be an API call, but here we update the mock data source
    if (paymentId === 'Bank') {
        Object.assign(MOCK_PAYMENTS_DATA.bankAccount, updates);
    } else if (paymentId === 'UPI') {
        Object.assign(MOCK_PAYMENTS_DATA.upi, updates);
    }
    return true; // Simulate success
};

// --- PAYMENT CARD COMPONENT ---
const PaymentCard = ({ payment, onEdit }) => {
    let title, details;

    if (payment.type === 'Bank') {
        title = `${payment.bankName} Account`;
        details = (
            <>
                <p>A/C Holder: **{payment.accountHolderName}**</p>
                <p>A/C No: {payment.accountNumber}</p>
                <p>IFSC: {payment.ifscCode}</p>
            </>
        );
    } else if (payment.type === 'UPI') {
        title = 'UPI ID';
        details = (
            <p>ID: **{payment.upiId}**</p>
        );
    } else {
        return null;
    }

    return (
        <div className={`payment-card ${payment.isPrimary ? 'primary-payment' : ''}`}>
            <div className="payment-card-header">
                <h4>{title}</h4>
                {payment.isPrimary && <span className="badge primary-badge">PRIMARY</span>}
            </div>
            <div className="payment-card-details">
                {details}
            </div>
            <div className="payment-card-actions">
                <button 
                    className="edit-btn" 
                    onClick={() => onEdit(payment)}
                >
                    Edit
                </button>
                <button className="delete-btn">Remove</button>
            </div>
        </div>
    );
};

// --- PAYMENT FORM COMPONENT ---
const PaymentForm = ({ initialData, onSubmit, onCancel, submitting }) => {
    
    const isBank = initialData?.type === 'Bank';
    const [formData, setFormData] = useState({
        ...initialData,
        bankName: initialData.bankName || '',
        accountHolderName: initialData.accountHolderName || '',
        accountNumber: initialData.accountNumber || '',
        ifscCode: initialData.ifscCode || '',
        upiId: initialData.upiId || '',
        isPrimary: initialData.isPrimary || false,
    });
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation logic
        if (isBank) {
            if (!formData.bankName || !formData.accountNumber || !formData.accountHolderName) {
                alert('Please fill in required fields for the Bank Account (Name, A/C No., Holder).');
                return;
            }
        } else { // UPI validation
             if (!formData.upiId) {
                alert('Please fill in the UPI ID.');
                return;
            }
        }

        // Call parent's submit handler
        onSubmit(formData); 
    };

    return (
        <div className="address-section new-payment-form">
            <h4>{isBank ? "Edit Bank Account Details" : "Edit UPI ID"}</h4>
            <form onSubmit={handleSubmit}>
                {isBank && (
                    <>
                        <input type="text" placeholder="Bank Name *" name="bankName" value={formData.bankName} onChange={handleChange} required disabled={submitting} />
                        <input type="text" placeholder="Account Holder Name *" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} required disabled={submitting} />
                        <input type="text" placeholder="Account Number *" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required disabled={submitting} />
                        <input type="text" placeholder="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} disabled={submitting} />
                    </>
                )}
                {!isBank && (
                    <input type="text" placeholder="UPI ID *" name="upiId" value={formData.upiId} onChange={handleChange} required disabled={submitting} />
                )}
                
                <label className="checkbox-label">
                    <input type="checkbox" name="isPrimary" checked={formData.isPrimary} onChange={handleChange} disabled={submitting} />
                    Set as Primary Payment Method
                </label>
                
                <div className="payment-form-buttons">
                    <button type="submit" className="save-payment-btn primary-btn" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Details"}
                    </button>
                    <button type="button" className="cancel-payment-btn secondary-btn" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- MAIN ClientPayments COMPONENT ---
const ClientPayments = ({ setError, setSuccess }) => {
    const uid = "user123";
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    // Destructure setError and setSuccess for stable dependencies
    const stableSetError = setError;
    const stableSetSuccess = setSuccess;
    
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true);
                const data = await mockFetchPayments(uid);
                setPayments(data);
                // **FIXED:** Conditional call to setError
                if (stableSetError) stableSetError("");
            } catch (err) {
                // **FIXED:** Conditional call to setError
                if (stableSetError) stableSetError("Failed to load payment options.");
            } finally {
                setLoading(false);
            }
        };
        // Removed stableSetError from dependency array if not provided, but keeps uid, which is stable
        fetchPayments();
    }, [uid, stableSetError]); // Using stable versions in dependencies

    const handleEditClick = (payment) => {
        setEditingPayment(payment);
        setShowForm(true);
        // **FIXED:** Conditional calls
        if (stableSetError) stableSetError("");
        if (stableSetSuccess) stableSetSuccess("");
    };

    const handleAddClick = (type) => {
        setEditingPayment({ type, isPrimary: false }); 
        setShowForm(true);
        // **FIXED:** Conditional calls
        if (stableSetError) stableSetError("");
        if (stableSetSuccess) stableSetSuccess("");
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingPayment(null);
        // **FIXED:** Conditional calls
        if (stableSetError) stableSetError("");
        if (stableSetSuccess) stableSetSuccess("");
    };

    // **FIXED: Added defensive checks for setError/setSuccess to prevent Uncaught TypeError**
    const handleFormSubmit = async (updates) => {
        const id = updates.type; 
        let updateSuccess = false;
        try {
            setSubmitting(true);
            // **FIXED:** Conditional calls
            if (stableSetSuccess) stableSetSuccess("");
            if (stableSetError) stableSetError("");
            
            const success = await mockUpdatePayment(id, updates); 

            if (success) {
                setPayments(prevPayments => 
                    prevPayments.map(p => p.type === id ? { ...p, ...updates } : p)
                );
                // **FIXED:** Conditional call
                if (stableSetSuccess) stableSetSuccess(`Payment option (${id}) updated successfully!`);
                updateSuccess = true;
            } else {
                 // **FIXED:** Conditional call
                if (stableSetError) stableSetError("Failed to update payment option.");
            }
        } catch (err) {
            // **FIXED:** Conditional call
            if (stableSetError) stableSetError("Error submitting payment update.");
        } finally {
            setSubmitting(false);
            
            if (updateSuccess) {
                handleCancel();
            }
        }
    };
    
    if (loading) return <div className="payment-loading">Loading payment options...</div>;

    // RENDER: Payment Form (Edit/Add Mode)
    if (showForm) {
        return (
            <PaymentForm 
                initialData={editingPayment} 
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                submitting={submitting}
            />
        );
    }
    
    // RENDER: Payment List View
    return (
        <div className="form-view-container client-payments-list">
            <div className="payment-header-row">
                <h2>My Payments</h2>
                <button 
                    className="add-button primary-btn" 
                    onClick={() => handleAddClick('Bank')} 
                >
                    + Add New Account
                </button>
            </div>
            
            {payments.length === 0 && (
                <p className="empty-state">You have no saved payment options. Add a bank account or UPI ID to facilitate faster transactions.</p>
            )}
            
            <div className="payments-grid">
                {payments.map(payment => (
                    <PaymentCard 
                        key={payment.type} 
                        payment={payment} 
                        onEdit={handleEditClick}
                    />
                ))}
            </div>
            
        </div>
    );
};

export default ClientPayments;