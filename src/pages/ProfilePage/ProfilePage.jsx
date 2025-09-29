import React, { useState, useEffect } from "react";
import RoleSpecificForm from "../RoleSpecificForm/RoleSpecificForm"; 
import Sidebar from "../Sidebar/Sidebar"; 
import "./ProfilePage.css";

// --- MOCK DATABASE FUNCTIONS/DATA (Updated with new detailed fields) ---
const MOCK_USER_DATA = {
  uid: "mock-uid-12345",
  email: "ramesh.farmer@example.com",
  role: "Farmer", // <-- Change this to test other roles
  
  // Profile Details
  fullName: "Ramesh Sharma", 
  firstName: "Ramesh",
  lastName: "Sharma",
  phone: "9876543210",
  gender: "Male",
  companyName: "Ramesh Farm Enterprises", 
  companyDescription: "Growing and auctioning high-quality organic wheat and mustard seeds since 2010.", // New field
  place: "Chennai", // New field for location
  
  // Address Details
  addressLine1: "Village Khetpur, Near Water Pump",
  city: "Agra",
  state: "Uttar Pradesh",
  pincode: "282001",
  country: "India",
  
  // Farmer Specific Details
  aadhaar: "1234-5678-9012",
  landholdingSize: "5",
  produceCategories: "Grains, Oilseeds",
  fieldPhotosURL: "https://via.placeholder.com/120/d94f4f/ffffff?text=F", // Mock photo
  listedCount: "12",
  
  // Detailed Bank Details
  bankName: "State Bank of India",
  accountHolderName: "Ramesh Sharma",
  accountNumber: "987654321012345",
  ifscCode: "SBIN0001234",
  upiId: "ramesh.s@sbi",
  
  // Compliance & Status
  consentGiven: "Yes",
  approved: "Approved",
  profilePhotoURL: "https://via.placeholder.com/120/d94f4f/ffffff?text=RS", 
  createdAt: new Date().toISOString(),
};

const mockFetchUserData = async (uid) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_USER_DATA;
};

const mockUpdateProfile = async (uid, updates) => {
  // ... (Update logic remains the same) ...
  Object.assign(MOCK_USER_DATA, updates); 
  if (updates.firstName || updates.lastName) {
      MOCK_USER_DATA.fullName = `${MOCK_USER_DATA.firstName} ${MOCK_USER_DATA.lastName}`.trim();
  }
  return true; 
};
// --- END MOCK FUNCTIONS ---


// --- Main Profile Component ---
function ProfilePage() {
  const uid = MOCK_USER_DATA.uid;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("My Profile");
  const [previewImage, setPreviewImage] = useState(null); // State for image preview

  useEffect(() => {
    const fetchUserData = async () => {
      // ... (fetching logic remains the same) ...
      try {
        const data = await mockFetchUserData(uid);
        if (data) {
          setUserData(data);
        } else {
          setError("User data not found.");
        }
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [uid]);


  const handleUpdateProfile = async (updates) => {
    // ... (update logic remains the same) ...
    try {
      await mockUpdateProfile(uid, {
          ...updates,
          lastUpdated: new Date().toISOString() 
      }); 
      
      setUserData(prevData => ({ 
          ...prevData, 
          ...updates,
          fullName: updates.firstName && updates.lastName ? 
                    `${updates.firstName} ${updates.lastName}`.trim() : prevData.fullName
      }));
      
      setSuccess("Profile updated successfully!");
      
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    }
  };
  
  // Handler for the profile image click/preview
  const handleImageClick = () => {
      setPreviewImage(userData.profilePhotoURL || MOCK_USER_DATA.profilePhotoURL);
      // In a real app, this would open a modal with the image and upload options
      alert(`Image Preview: ${userData.profilePhotoURL}. Click to change/upload.`);
      setActiveSection("My Profile");
  };

  if (loading) return <div className="profile-container">Loading Profile...</div>;
  if (error && !userData) return <div className="profile-container error-message">{error}</div>;
  if (!userData) return null; 

  // --- Profile Header Data for Display ---
  const profileImageSrc = userData.profilePhotoURL || "https://via.placeholder.com/120/d94f4f/ffffff?text=U";


  return (
    <>
      <div className="top-header-wrapper">
          <p className="top-header-accent">Home / Profile</p>
      </div>
      
      <div className="profile-page-wrapper">
        
        {/* Sidebar component */}
        <Sidebar 
          role={userData.role} 
          userData={userData} 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onEditPhoto={handleImageClick}
        />
        
        <main className="content-area">
          
          {/* --- NEW: Profile Header (Top of Content Area) --- */}
          <div className="profile-summary-header">
              <div className="profile-image-container" onClick={handleImageClick}>
                  <img 
                      src={profileImageSrc} 
                      alt="Profile" 
                      className="profile-image" 
                  />
                  {/* No pen button needed on the image, the click handler manages change/preview */}
              </div>
              <div className="profile-details">
                  <h2>{userData.fullName}</h2>
                  <div className="meta">
                      <span>{userData.role}</span>
                      <span>{userData.place || userData.city}</span>
                      <button 
                          className="share-btn-top" 
                          onClick={() => alert(`Sharing profile for ${userData.fullName}`)}
                      >
                          Share Profile
                      </button>
                  </div>
                  <p>
                      <strong>{userData.companyName || "N/A"}</strong>
                  </p>
                  <p>
                      {userData.companyDescription || `No description provided for this ${userData.role} organization.`}
                  </p>
              </div>
          </div>
          {/* --- END Profile Header --- */}


          {success && <p className="form-message success">{success}</p>}
          {error && <p className="form-message error">{error}</p>}

          <RoleSpecificForm 
            role={userData.role} 
            data={userData} 
            section={activeSection}
            onUpdate={handleUpdateProfile}
            uid={uid}
          />
        </main>
      </div>
    </>
  );
}

export default ProfilePage;