import React, { useState, useEffect } from 'react';

// --- IMPORT DEDICATED VIEW COMPONENTS (Ensure these paths are correct) ---
import OrderDetailsTracking from '../../components/OrderDetailsTracking/OrderDetailsTracking'; 
import MyReturns from '../../components/MyReturns/MyReturns';
import ProductInventory from '../../components/ProductInventory/ProductInventory';

import ClientAddresses from '../../components/ClientAddresses/ClientAddresses'; 
import ClientPayments from '../../components/ClientPayments/ClientPayments';

// --- IMPORT PRODUCT FORMS ---
import AuctionStartForm from '../../components/Forms/AuctionStartForm/AuctionStartForm';
import CottagerProductForm from '../../components/Forms/CottagerProductForm/CottagerProductForm';


// Mock Functions (Keep this for file handling simulation)
const mockUploadFileAndGetURL = async (uid, file, folder, fieldName) => {
    console.log(`[MOCK] Uploading file for ${uid} to ${folder}/${fieldName}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    return `https://mock-storage.com/${uid}/${folder}/${fieldName}_${file.name}`;
};


const RoleSpecificForm = ({ role, data, section, onUpdate, uid }) => {
    const [formData, setFormData] = useState(data);
    const [fileToUpload, setFileToUpload] = useState(null); 
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        setFormData(data);
        setFileToUpload(null); // Reset file upload state on section change
    }, [data, section]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };
    
    const handleFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        let updates = { ...formData }; 

        try {
            if (fileToUpload) {
                let fieldName = fileToUpload.name;
                if (section === "My Profile") fieldName = "profilePhotoURL";
                
                const url = await mockUploadFileAndGetURL(uid, fileToUpload, "uploads", fieldName);
                updates[fieldName] = url;
            }

            // Clean up internal keys before sending to update handler
            ['role', 'uid', 'createdAt'].forEach(key => delete updates[key]);
            
            await onUpdate(updates); 
            setFileToUpload(null); 

        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };


    // ===============================================
    // 🚩 STEP 1: CONDITIONAL CONTENT ROUTING 🚩
    // Routes for dedicated components (Forms, Inventory, Tracking, etc.)
    // ===============================================
    
    // The <div className="form-view-container"> ensures these components get proper desktop padding/styling.

    // 1. Order Tracking/Returns
    if (section === "Order Details (Tracking)") {
        return <div className="form-view-container"><OrderDetailsTracking /></div>;
    }
    
    if (section === "My Returns") {
        return <div className="form-view-container"><MyReturns /></div>;
    }

    // 2. Dedicated Client Management Views (NEW)
    if (section === "My Addresses") {
        // Renders the ClientAddresses component for full CRUD Address Book management
        return <div className="form-view-container"><ClientAddresses /></div>;
    }
    
    if (section === "My Payments") {
        // Renders the ClientPayments component for full Payment Options management
        return <div className="form-view-container"><ClientPayments /></div>;
    }
    
    // 3. Inventory Grid View
    if (section.includes("Inventory") && (role === "Farmer" || role === "Cottager")) {
        return <div className="form-view-container"><ProductInventory role={role} /></div>;
    }
    
    // 4. Farmer: Start Auction Form
    if (section === "Start Auction" && role === "Farmer") {
        return <div className="form-view-container"><AuctionStartForm /></div>;
    }
    
    // 5. Cottager: Add Product Form
    if (section === "Add Product" && role === "Cottager") {
        return <div className="form-view-container"><CottagerProductForm /></div>;
    }

    // 6. Analysis Views 
    if (section === "Auction Analysis" || section === "Product Analysis") {
        let analysisTitle = role === "Farmer" ? "Auction Analysis" : "Product Analysis";
        return (
             <div className="empty-section form-view-container">
                 <h2>{analysisTitle}</h2>
                 <p>The **{analysisTitle}** dashboard is currently under construction. Check back soon!</p>
             </div>
        );
    }
    
    // ===============================================
    // STEP 2: DYNAMIC FORM RENDERING LOGIC (Only My Profile remains)
    // If it's not a special component, we proceed with the dynamic form setup.
    // NOTE: The dynamic sections for "Address Book" and "My Payment Options" were removed here.
    // ===============================================

    let title = section;
    let fields = [];

    if (section === "My Profile") {
        title = "Edit Your Profile";
        fields = [
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Email", name: "email", type: "email", disabled: true }, 
            { label: "Phone", name: "phone", type: "tel" },
            
            // Only show Company/Org fields for Farmer/Cottager roles
            ...(['Farmer', 'Cottager'].includes(role) ? [
                { label: "Company/Organization Name", name: "companyName", type: "text", fullWidth: true },
                { label: "Organization Description", name: "companyDescription", type: "textarea", fullWidth: true },
            ] : []),
            
            { label: "Country/Region", name: "country", type: "text" },
            { label: "Gender", name: "gender", type: "select", options: ["Select -- given", "Male", "Female", "Other"] },
            
            { label: "Current Profile Photo URL", name: "profilePhotoURL", type: "text", disabled: true },
            { label: "Upload New Profile Photo", name: "profilePhoto", type: "file" },
        ];
        
    } else {
        // Fallback for non-implemented sections or old dynamic sections
        return (
            <div className="empty-section form-view-container">
                <h2>{section}</h2>
                <p>The details page for **{section}** is not yet implemented.</p>
            </div>
        );
    }
    
    // Helper function to handle rendering inputs/selects/textareas
    const renderInput = (field) => {
        const commonProps = {
            name: field.name,
            onChange: field.type === "file" ? handleFileChange : handleChange,
            disabled: field.disabled || submitting,
            id: field.name 
        };
        
        const value = field.value !== undefined ? field.value : (formData[field.name] || "");

        if (field.type === "textarea") {
            return <textarea {...commonProps} value={value} rows="4" />;
        } else if (field.type === "select") {
            return (
                <select {...commonProps} value={value}>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        } else if (field.type === "file") {
            return (
                <>
                    <input type="file" accept="image/*,application/pdf" {...commonProps} />
                    {formData[field.name] && (
                        <p className="existing-file-info">
                            Existing: <a href={formData[field.name]} target="_blank" rel="noopener noreferrer">View File</a>
                        </p>
                    )}
                    {fileToUpload && fileToUpload.name && (
                        <p className="new-file-info">New File: {fileToUpload.name}</p>
                    )}
                </>
            );
        } else {
            return <input type={field.type} value={value} {...commonProps} />;
        }
    };


    // --- Render the Profile Form ---
    return (
        <form onSubmit={handleSubmit} className="form-view-container">
            <h2>{title}</h2>
            
            <div className="form-grid">
                {fields.map(field => (
                    <div key={field.name} className={`form-field ${field.fullWidth || field.type === 'textarea' ? 'full-width' : ''}`}>
                        <label htmlFor={field.name}>{field.label}</label>
                        {renderInput(field)}
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setFormData(data)} disabled={submitting}>
                    Cancel
                </button>
                <button type="submit" className="save-button" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default RoleSpecificForm;