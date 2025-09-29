import React, { useState, useEffect } from 'react';

// Mock Functions (assuming these are globally available or imported)
const mockUploadFileAndGetURL = async (uid, file, folder, fieldName) => {
    console.log(`[MOCK] Uploading file for ${uid} to ${folder}/${fieldName}...`);
    await new Promise(resolve => setTimeout(resolve, 1200)); 
    return `https://mock-storage.com/${uid}/${folder}/${fieldName}_${file.name}`;
};


// --- Form Component ---
const RoleSpecificForm = ({ role, data, section, onUpdate, uid }) => {
  const [formData, setFormData] = useState(data);
  const [fileToUpload, setFileToUpload] = useState(null); 
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
      setFormData(data);
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
          let folder = "uploads"; 
          let fieldName = fileToUpload.name;
          
          // Map upload folder/field name based on section
          if (section === "My Profile") fieldName = "profilePhotoURL";
          else if (section.includes("Produce")) fieldName = "fieldPhotosURL";
          // ... other upload mapping logic ...
          
          const url = await mockUploadFileAndGetURL(uid, fileToUpload, folder, fieldName);
          updates[fieldName] = url;
      }

      // Cleanup non-persistent keys
      ['role', 'uid', 'createdAt'].forEach(key => delete updates[key]);
      
      await onUpdate(updates); 
      setFileToUpload(null); 

    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };


  // --- Conditional Rendering Logic ---
  let title = section;
  let fields = [];

  if (section === "My Profile") {
    title = "Edit Your Profile";
    fields = [
        { label: "First Name", name: "firstName", type: "text" },
        { label: "Last Name", name: "lastName", type: "text" },
        { label: "Email", name: "email", type: "email", disabled: true }, 
        { label: "Phone", name: "phone", type: "tel" },
        // Company/Org and Description
        { label: "Company/Organization Name", name: "companyName", type: "text", fullWidth: true },
        { label: "Organization Description", name: "companyDescription", type: "textarea", fullWidth: true },
        { label: "Country/Region", name: "country", type: "text" },
        { label: "Gender", name: "gender", type: "select", options: ["Select -- given", "Male", "Female", "Other"] },
        
        // Image Upload
        { label: "Current Profile Photo URL", name: "profilePhotoURL", type: "text", disabled: true },
        { label: "Upload New Profile Photo", name: "profilePhoto", type: "file" },
    ];
    
  } else if (section === "Address Book") {
    title = "Delivery & Billing Address";
    // Construct saved address for display
    const savedAddress = `${data.addressLine1 || ''}, ${data.city || ''}, ${data.state || ''}, ${data.pincode || ''}`.trim();
    fields = [
        { label: "Saved Delivery Address", name: "savedAddress", type: "textarea", disabled: true, fullWidth: true, value: savedAddress || "No saved address found." },
        { label: "Address Line 1", name: "addressLine1", type: "text" },
        { label: "City", name: "city", type: "text" },
        { label: "State", name: "state", type: "text" },
        { label: "Pincode", name: "pincode", type: "text" },
    ];
    
  } else if (section === "My Payment Options") {
    title = "Detailed Bank & Payment Details";
    fields = [
        { label: "Bank Name", name: "bankName", type: "text" },
        { label: "Account Holder Name", name: "accountHolderName", type: "text" },
        { label: "Account Number", name: "accountNumber", type: "text" },
        { label: "IFSC Code", name: "ifscCode", type: "text" },
        { label: "UPI ID (Optional)", name: "upiId", type: "text" },
    ];
    
  } else if (section.includes("Inventory") && (role === "Farmer" || role === "Cottager")) {
    title = section.includes("Farmer") ? "Farm Produce Inventory" : "Cottage Products Inventory";
    fields = [
      { label: "Number of Products Listed (Total)", name: "listedCount", type: "text", disabled: true },
      { label: "Upcoming Produce Schedule", name: "upcomingProduce", type: "textarea", fullWidth: true, disabled: true },
      { label: "Products Listed on Platform", name: "productList", type: "textarea", fullWidth: true, disabled: true, 
        value: "This section auto-displays products added via 'Start Auction Form'." 
      },
    ];

  } else if (section === "Start Auction Form" && (role === "Farmer" || role === "Cottager")) {
    title = "List Product for Auction";
    fields = [
        { label: "Product Name", name: "productName", type: "text" },
        { label: "Category", name: "category", type: "text" },
        { label: "Quantity (Kgs/Units)", name: "quantity", type: "text" },
        { label: "Base Price (Min Bid ₹)", name: "basePrice", type: "text" },
        
        { label: "Auction Start Time", name: "startTime", type: "datetime-local" },
        { label: "Auction End Time", name: "endTime", type: "datetime-local" },
        
        // Farmer-Specific Details
        ...(role === "Farmer" ? [
            { label: "Variety/Breed Type", name: "variety", type: "text" },
            { label: "Harvest Date", name: "harvestDate", type: "date" },
            { label: "Fertilizer/Pesticide Used", name: "fertilizer", type: "text", fullWidth: true },
            { label: "Soil Type", name: "soilType", type: "text" },
            { label: "Certifications (e.g., Organic)", name: "certifications", type: "text" },
        ] : []),
        
        { label: "Seller/Company Name", name: "sellerCompanyName", type: "text", defaultValue: data.companyName || "" }, 
        
        { label: "Product Description", name: "productDescription", type: "textarea", fullWidth: true },
        { label: "Upload Product Image(s)", name: "productImages", type: "file", fullWidth: true },
    ];
    
  }
  // ... (Other sections like Auction/Bid Analytics, Legal & Compliance would be separate components)

  
  if (fields.length === 0) {
      return (
          <div className="empty-section">
              <h2>{section}</h2>
              <p>This section is not implemented or not available for your role ({role}).</p>
          </div>
      );
  }

  // Helper function to handle rendering inputs/selects/textareas
  const renderInput = (field) => {
    const commonProps = {
      name: field.name,
      onChange: field.type === "file" ? handleFileChange : handleChange,
      disabled: field.disabled || submitting,
    };
    
    // Determine the value source: controlled (formData) or static (field.value)
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
          <input type="file" id={field.name} accept="image/*,application/pdf" {...commonProps} />
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


  // --- Render the Form ---
  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      
      <div className="form-grid">
        {fields.map(field => (
          <div key={field.name} className={`form-field ${field.fullWidth || field.type === 'textarea' ? 'full-width' : ''}`}>
            <label>{field.label}</label>
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