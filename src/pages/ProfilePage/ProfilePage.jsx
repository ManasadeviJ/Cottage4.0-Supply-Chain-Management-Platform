import React, { useState, useEffect } from "react";
import RoleSpecificForm from "../RoleSpecificForm/RoleSpecificForm";
import Sidebar from "../Sidebar/Sidebar";
import "./ProfilePage.css";

// --- MOCK DATABASE FUNCTIONS/DATA ---
const MOCK_USER_DATA_INITIAL = {
    uid: "user123",
    firstName: "Amal",
    lastName: "Clooney",
    fullName: "Amal Clooney",
    email: "johnsmith@gmail.com",
    phone: "123-456-7890",
    role: "Buyer", 
    place: "London",
    city: "London",
    companyName: "Fashion Nova",
    companyDescription: "A leading global fashion e-commerce company.",
    profilePhotoURL: "https://i.ibb.co/L5hY5M7/Amal-Clooney.jpg", 
    gender: "Female",
    addressLine1: "123 Main St",
    pincode: "SW1A 0AA",
    state: "England",
    country: "United Kingdom",
    bankName: "HSBC",
    accountHolderName: "Amal Clooney",
    accountNumber: "**********1234",
    ifscCode: "HSBC0001234",
    upiId: "amal.clooney@upi",
    // Farmer/Cottager specific
    listedCount: "5",
    upcomingProduce: "Tomatoes (next week), Wheat (next month)",
};

// Simulate different user roles
const MOCK_ROLES_DATA = {
    "Buyer": {
        ...MOCK_USER_DATA_INITIAL,
        role: "Buyer",
        companyName: "Fashion Nova",
        companyDescription: "A leading global fashion e-commerce company for trendy apparel.",
        orders: [ // Mock orders for Buyer
            {
                id: "ORD001",
                date: "2023-10-26",
                total: 1200,
                status: "Delivered",
                products: [
                    { id: "P001", name: "Organic Tomatoes", image: "https://i.ibb.co/SyzvL2s/tomatoes.jpg", quantity: 2, price: 150, deliveryStage: "Delivered", returnable: true },
                    { id: "P002", name: "Handmade Clay Pot", image: "https://i.ibb.co/BnmXy3K/clay-pot.jpg", quantity: 1, price: 900, deliveryStage: "Delivered", returnable: false },
                ],
            },
            {
                id: "ORD002",
                date: "2023-11-01",
                total: 550,
                status: "Processing",
                products: [
                    { id: "P003", name: "Fresh Wheat Grains", image: "https://i.ibb.co/Q8Q83R7/wheat.jpg", quantity: 5, price: 100, deliveryStage: "Packed", returnable: true },
                    { id: "P004", name: "Handwoven Basket", image: "https://i.ibb.co/Xz3gHkX/basket.jpg", quantity: 1, price: 50, deliveryStage: "Ready for Transporting", returnable: true },
                ],
            },
        ],
        returns: [ // Mock returns for Buyer
            {
                id: "RET001",
                orderId: "ORD001",
                productId: "P001",
                productName: "Organic Tomatoes",
                reason: "Not fresh",
                status: "Approved",
                requestDate: "2023-10-28",
            }
        ]
    },
    "Farmer": {
        ...MOCK_USER_DATA_INITIAL,
        firstName: "Rohan",
        lastName: "Patel",
        fullName: "Rohan Patel",
        email: "rohan.p@farm.com",
        role: "Farmer",
        companyName: "Green Harvest Farms",
        companyDescription: "Suppliers of fresh, organic produce directly from our fields.",
        profilePhotoURL: "https://i.ibb.co/WcWc81K/farmer-profile.jpg", 
        listedCount: "12",
        upcomingProduce: "Wheat (Oct), Rice (Nov), Vegetables (Ongoing)",
        inventory: [ // Mock inventory for Farmer
            { id: "FP001", name: "Organic Tomatoes", image: "https://i.ibb.co/SyzvL2s/tomatoes.jpg", price: 150, stock: 100, unit: "kg", addedDate: "2023-10-20" },
            { id: "FP002", name: "Fresh Wheat Grains", image: "https://i.ibb.co/Q8Q83R7/wheat.jpg", price: 100, stock: 500, unit: "kg", addedDate: "2023-09-15" },
            { id: "FP003", name: "Green Bell Peppers", image: "https://i.ibb.co/QCY1402/bell-peppers.jpg", price: 80, stock: 200, unit: "kg", addedDate: "2023-11-05" },
        ]
    },
    "Cottager": {
        ...MOCK_USER_DATA_INITIAL,
        firstName: "Priya",
        lastName: "Sharma",
        fullName: "Priya Sharma",
        email: "priya.s@cottage.com",
        role: "Cottager",
        companyName: "Priya's Handicrafts",
        companyDescription: "Handmade traditional Indian crafts and home decor items.",
        profilePhotoURL: "https://i.ibb.co/JyQd3g4/cottager-profile.jpg", 
        listedCount: "8",
        upcomingProduce: "Pottery (Next Month), Weavings (Next Quarter)",
        inventory: [ // Mock inventory for Cottager
            { id: "CP001", name: "Handmade Clay Pot", image: "https://i.ibb.co/BnmXy3K/clay-pot.jpg", price: 900, stock: 15, unit: "piece", addedDate: "2023-08-01" },
            { id: "CP002", name: "Handwoven Basket", image: "https://i.ibb.co/Xz3gHkX/basket.jpg", price: 50, stock: 30, unit: "piece", addedDate: "2023-09-01" },
            { id: "CP003", name: "Embroidered Table Runner", image: "https://i.ibb.co/QxK7x1x/table-runner.jpg", price: 350, stock: 10, unit: "piece", addedDate: "2023-10-10" },
        ]
    }
};

let CURRENT_MOCK_USER_DATA = { ...MOCK_ROLES_DATA["Buyer"] }; // Mutable current user data

const mockFetchUserData = async (uid) => {
    console.log(`[MOCK] Fetching user data for ${uid}...`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    return { ...CURRENT_MOCK_USER_DATA, uid };
};

const mockUpdateProfile = async (uid, updates) => {
    console.log(`[MOCK] Updating profile for ${uid} with:`, updates);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    Object.assign(CURRENT_MOCK_USER_DATA, updates);
    return true; // Indicate success
};

const mockSubmitReturnRequest = async (returnDetails) => {
    console.log("[MOCK] Submitting return request:", returnDetails);
    await new Promise(resolve => setTimeout(resolve, 700));
    const newReturn = {
        ...returnDetails,
        id: `RET${Date.now()}`,
        status: "Pending",
        requestDate: new Date().toISOString().split('T')[0],
    };
    CURRENT_MOCK_USER_DATA.returns = [...(CURRENT_MOCK_USER_DATA.returns || []), newReturn];
    return { success: true, newReturn };
};
// --- END MOCK FUNCTIONS ---

// Helper function to check if the section should display a form/dedicated view
const isFormViewActive = (section) => {
    const formSections = [
        // Updated keys for dedicated views
        'My Profile', 'My Addresses', 'My Payments', 'Order Details (Tracking)',
        'My Returns', 'My Cancellations', 'Farm Produce (Inventory)', 'Cottage Products (Inventory)',
        'Start Auction', 'Add Product', 'Auction Analysis', 'Product Analysis',
        'Legal & Compliance', 'Land Ownership Proof', 'Business ID Proof'
    ];
    return formSections.includes(section);
};


// --- Main Profile Component ---
function ProfilePage() {
    const uid = MOCK_USER_DATA_INITIAL.uid; // Using mock UID

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userData, setUserData] = useState(null);

    const [activeSection, setActiveSection] = useState("My Profile");
    // mobileScreen: 'MAIN_LIST', 'SUB_PROFILE_LIST', 'SUB_ORDERS_LIST', 'SUB_VENDOR_LIST', 'BACK_TRANSITION' or null (for showing form/details)
    const [mobileScreen, setMobileScreen] = useState('MAIN_LIST');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992); // Initial check

    // Debounced resize handler for responsiveness
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                // Ensure we fetch the current global mock data for the selected role
                const data = await mockFetchUserData(uid);
                setUserData(data);
                setError("");
            } catch (err) {
                setError("Failed to load user data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [uid, CURRENT_MOCK_USER_DATA.role]); // Depend on role to refetch if role changes


    const handleUpdateProfile = async (updates) => {
        try {
            setSuccess("");
            setError("");
            const success = await mockUpdateProfile(uid, updates);
            if (success) {
                setUserData(prev => ({ ...prev, ...updates })); // Update local state
                setSuccess("Profile updated successfully!");
            } else {
                setError("Failed to update profile.");
            }
        } catch (err) {
            setError("Error updating profile.");
            console.error(err);
        }
    };

    const handleSubmitReturnRequest = async (returnDetails) => {
        try {
            setSuccess("");
            setError("");
            const { success: apiSuccess, newReturn } = await mockSubmitReturnRequest(returnDetails);
            if (apiSuccess) {
                setUserData(prev => ({
                    ...prev,
                    returns: [...(prev.returns || []), newReturn]
                }));
                setSuccess("Return request submitted successfully!");
            } else {
                setError("Failed to submit return request.");
            }
        } catch (err) {
            setError("Error submitting return request.");
            console.error(err);
        }
    };

    // Define quick tabs (top-action-buttons) - FIXING keys to match RoleSpecificForm
    const topActions = [];
    if (userData?.role === "Farmer") {
        topActions.push(
            { name: "My Profile", section: "My Profile" },
            { name: "Start Auction", section: "Start Auction" },
            { name: "Auction Analysis", section: "Auction Analysis" },
            { name: "Farm Inventory", section: "Farm Produce (Inventory)" }
        );
    } else if (userData?.role === "Cottager") {
        topActions.push(
            { name: "My Profile", section: "My Profile" },
            { name: "Add Product", section: "Add Product" }, 
            { name: "Product Analysis", section: "Product Analysis" }, 
            { name: "Product Inventory", section: "Cottage Products (Inventory)" }
        );
    } else { // Buyer
        // FIX: Using the correct section names for the dedicated views
        topActions.push(
            { name: "My Profile", section: "My Profile" },
            { name: "Orders Tracking", section: "Order Details (Tracking)" },
            { name: "My Payments", section: "My Payments" }, // UPDATED KEY
        );
    }

    const profileImageSrc = userData?.profilePhotoURL || "https://via.placeholder.com/100/d94f4f/ffffff?text=U";

    // --- Mobile Navigation Handlers ---
    // This handler is used by Sidebar for mobile (MAIN_LIST)
    const handleMobileNavClick = (sectionName) => {
        if (sectionName === "Manage My Account") { // The main group name
            setMobileScreen("SUB_PROFILE_LIST");
        } else if (sectionName === "My Orders") { // The main group name
            setMobileScreen("SUB_ORDERS_LIST");
        } else if (sectionName === "Vendor Sections") { // The main group name
            setMobileScreen("SUB_VENDOR_LIST");
        } else {
            // If it's a direct form view from main list (e.g., My Payment Options for Buyer)
            handleMobileSubMenuClick(sectionName);
        }
        setActiveSection(sectionName); // Keep active section updated for highlighting
    };

    // This handler is used by sub-menu lists AND top-action-buttons on mobile
    const handleMobileSubMenuClick = (sectionName) => {
        setMobileScreen(null); // Indicates that a form/detail view should now be shown
        setActiveSection(sectionName);
    };

    const handleMobileBackClick = () => {
        setSuccess(""); // Clear messages on navigation
        setError("");

        // Special handling for the "white screen" transition
        if (mobileScreen === null) {
            setMobileScreen('BACK_TRANSITION'); // Initiate white screen transition
            setTimeout(() => {
                // Determine where to go back after transition
                const previousSectionGroup = Object.entries(fullMobileMenuMap).find(([key, value]) =>
                    value.includes(activeSection)
                );
                if (previousSectionGroup) {
                    // Navigate back to the sub-list menu (e.g., SUB_PROFILE_LIST)
                    const menuKey = `SUB_${previousSectionGroup[0].replace(/\s/g, '_').toUpperCase()}`;
                    setMobileScreen(menuKey);
                } else {
                    setMobileScreen('MAIN_LIST'); // Fallback to main list
                }
                setActiveSection(null); // Clear active section when going back to a menu
            }, 300); // Duration of the "white screen" effect
        } else { // If in a sub-list, go back to main list
            setMobileScreen('BACK_TRANSITION'); // Initiate white screen transition
            setTimeout(() => {
                setMobileScreen('MAIN_LIST');
                setActiveSection(null); // Clear active section when going back to a menu
            }, 300);
        }
    };

    // Map for mobile sub-menus (matching Sidebar's internal logic)
    // FIX: This map is correct and defines all three items for Manage My Account.
    const fullMobileMenuMap = {
        'Manage My Account': ['My Profile', 'My Addresses', 'My Payments'], // CORRECT
        'My Orders': ['Order Details (Tracking)', 'My Returns', 'My Cancellations'],
    };

    if (userData?.role === "Farmer" || userData?.role === "Cottager") {
        fullMobileMenuMap['Vendor Sections'] = [
            (userData.role === "Farmer" ? "Farm Produce (Inventory)" : "Cottage Products (Inventory)"),
            (userData.role === "Farmer" ? "Start Auction" : "Add Product"),
            (userData.role === "Farmer" ? "Auction Analysis" : "Product Analysis"),
            'Legal & Compliance',
            (userData.role === "Farmer" ? "Land Ownership Proof" : "Business ID Proof"),
        ];
    }


    // --- Mobile Screen Renderer ---
    const getMobileScreenContent = () => {
        if (!userData || !isMobile) return null;

        // Handle the white screen transition
        if (mobileScreen === 'BACK_TRANSITION') {
            return <div className="mobile-transition-screen"></div>; 
        }

        // If mobileScreen is null, it means we're displaying a form/detail, so no menu content here
        if (mobileScreen === null) return null;

        // 1. Main Top-Level List (Renders Sidebar)
        if (mobileScreen === 'MAIN_LIST') {
            return (
                <Sidebar
                    role={userData.role}
                    activeSection={activeSection}
                    setActiveSection={handleMobileNavClick} // Use main mobile handler
                />
            );
        }

        // 2. Sub-menu screens (Should show all items from the map)
        let title = "";
        let items = [];
        let mapKey = null;

        if (mobileScreen === 'SUB_PROFILE_LIST') {
            title = "Manage My Account";
            mapKey = 'Manage My Account';
        } else if (mobileScreen === 'SUB_ORDERS_LIST') {
            title = "My Orders";
            mapKey = 'My Orders';
        } else if (mobileScreen === 'SUB_VENDOR_LIST') {
            title = "Vendor Sections";
            mapKey = 'Vendor Sections';
        }
        
        // **CRITICAL FIX LOCATION:** Ensure items is assigned from the map
        items = fullMobileMenuMap[mapKey] || [];


        return (
            <div className="mobile-sub-menu-screen">
                <h3>{title}</h3>
                <div className="mobile-nav-group-buttons-wrapper">
                    {items.map(item => (
                        <button key={item} onClick={() => handleMobileSubMenuClick(item)} className="mobile-nav-group-button">
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const mobileContent = getMobileScreenContent();

    // Determine if the RoleSpecificForm should be shown
    const showForm = !isMobile ? isFormViewActive(activeSection) : (mobileScreen === null && isFormViewActive(activeSection));


    if (loading) return <div className="profile-container">Loading Profile...</div>;
    if (!userData) return null;

    // Function to switch roles for demo
    const switchRole = (newRole) => {
        CURRENT_MOCK_USER_DATA = { ...MOCK_ROLES_DATA[newRole] };
        setUserData(CURRENT_MOCK_USER_DATA); // Update current user data state
        setActiveSection("My Profile"); // Reset to profile view
        setMobileScreen('MAIN_LIST'); // Reset mobile view
        setSuccess("");
        setError("");
        setLoading(true); // Trigger re-fetch effect
    };


    return (
        <>
            <div className="top-header-wrapper">
                {isMobile && mobileScreen !== 'MAIN_LIST' && mobileScreen !== 'BACK_TRANSITION' && (
                    <button className="back-button" onClick={handleMobileBackClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                )}
                <p className="top-header-accent">Home / Profile</p>
                {/* For smaller devices, show the Myntra-like top right icons */}
                {isMobile && (
                    <div className="top-right-icons">
                        <span className="icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2v-2h20v2zm0-4H2v-2h20v2zm0-4H2V7h20v2z" /></svg>
                        </span>
                        <span className="icon-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" /></svg>
                        </span>
                    </div>
                )}
            </div>

            <div className="profile-page-wrapper">

                {/* Role Switcher (for demo purposes) */}
                <div className="role-switcher">
                    <span>Switch Role: </span>
                    <button onClick={() => switchRole('Buyer')} className={userData.role === 'Buyer' ? 'active-role' : ''}>Buyer</button>
                    <button onClick={() => switchRole('Farmer')} className={userData.role === 'Farmer' ? 'active-role' : ''}>Farmer</button>
                    <button onClick={() => switchRole('Cottager')} className={userData.role === 'Cottager' ? 'active-role' : ''}>Cottager</button>
                </div>

                {/* SIDEBAR (Desktop Only) */}
                {!isMobile && (
                    <Sidebar
                        role={userData.role}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection} // Use direct setter for desktop
                    />
                )}

                {/* MAIN CONTENT AREA */}
                <main className="content-area">

                    {/* Always show Profile Summary Header */}
                    <div className="profile-summary-header">
                        <div className="profile-image-container">
                            <img src={profileImageSrc} alt="Profile" className="profile-image" />
                        </div>
                        <div className="profile-details">
                            <h2>{userData.fullName}</h2>
                            <div className="meta">
                                <span>{userData.role}</span> &bull; <span>{userData.place || userData.city}</span>
                            </div>
                            <p>
                                <strong>{userData.companyName || "N/A"}</strong>
                            </p>
                            <p className="description-text">
                                {userData.companyDescription || `No description provided for this ${userData.role} organization.`}
                            </p>
                            <button className="share-btn-top" onClick={() => alert(`Sharing profile for ${userData.fullName}`)} title="Share Profile">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                            </button>
                        </div>
                    </div>

                    {/* Display section title on desktop when not showing profile summary content (e.g. for Address book) */}
                    {!isMobile && activeSection !== "My Profile" && (
                        <h2 className="section-title">{activeSection}</h2>
                    )}


                    {/* 2. Top Action Buttons (Mobile Only) */}
                    {isMobile && mobileScreen === 'MAIN_LIST' && (
                        <div className="top-action-buttons-wrapper"> {/* New wrapper for background */}
                            <div className="top-action-buttons">
                                {topActions.map(action => (
                                    <button
                                        key={action.name}
                                        className={`action-btn ${activeSection === action.section ? 'active' : ''}`}
                                        onClick={() => handleMobileSubMenuClick(action.section)} // Direct to form view
                                    >
                                        {action.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. Mobile Navigation List, Sub-Menu, or Form View */}

                    {isMobile && mobileContent} {/* Renders the main/sub-menus or transition screen on mobile */}

                    {/* Messages */}
                    {error && <p className="message error-message">{error}</p>}
                    {success && <p className="message success-message">{success}</p>}


                    {showForm && (
                        <div className="form-view-container">
                            <RoleSpecificForm
                                role={userData.role}
                                data={userData}
                                section={activeSection}
                                onUpdate={handleUpdateProfile}
                                onSubmitReturn={handleSubmitReturnRequest} 
                                uid={uid}
                                setError={setError} 
                                setSuccess={setSuccess}
                            />
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default ProfilePage;