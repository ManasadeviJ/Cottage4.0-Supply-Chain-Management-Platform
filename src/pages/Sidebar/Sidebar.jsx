import React from 'react';
import './Sidebar.css'; 

// NOTE: We use window.innerWidth check here, but the ProfilePage also controls rendering based on its isMobile state for consistency.
const isMobileDevice = () => window.innerWidth < 992;

const Sidebar = ({ role, activeSection, setActiveSection }) => {
  
  // Full desktop menu map (used for both desktop and defining mobile sub-menus in ProfilePage)
  const fullDesktopMenuMap = {
      // FIX APPLIED HERE: CHANGED 'Address Book' TO 'My Addresses'
      'Manage My Account': ['My Profile', 'My Addresses', 'My Payments'],
      'My Orders': ['Order Details (Tracking)', 'My Returns', 'My Cancellations'], 
  };

  if (role === "Farmer" || role === "Cottager") {
      fullDesktopMenuMap['Vendor Sections'] = [
          // Inventory
          (role === "Farmer" ? "Farm Produce (Inventory)" : "Cottage Products (Inventory)"),
          
          // FIX: Conditional Form Link Text and Key
          (role === "Farmer" ? "Start Auction" : "Add Product"),
          
          // FIX: Conditional Analysis Link Text and Key
          (role === "Farmer" ? "Auction Analysis" : "Product Analysis"), 
          
          // Legal
          'Legal & Compliance', 
          (role === "Farmer" ? "Land Ownership Proof" : "Business ID Proof"), 
      ];
  }


  // --- 1. Desktop Sidebar Renderer ---
  // This renders the full structure for desktop view
  const renderDesktopSidebar = () => (
    <aside className="sidebar">
      {Object.entries(fullDesktopMenuMap).map(([groupName, items]) => (
        <div key={groupName} className="menu-group">
            <p className="menu-header">
                {groupName}
            </p>
            <div className={`sub-menu-items`}>
                {items.map((item) => (
                    <button
                        key={item}
                        className={`${activeSection === item ? "active" : ""}`}
                        onClick={() => setActiveSection(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
      ))}
    </aside>
  );
  
  // --- 2. Mobile Navigation List Renderer (Top-Level only) ---
  // This renders the top-level categories that lead to sub-menus (handled by ProfilePage)
  const renderMobileNavigation = () => {
    // Only the items that open a new sub-list or a direct form view
    const topLevelItems = [
        // === FIX APPLIED HERE ===
        // We must list the group name 'Manage My Account' to trigger the sub-menu in ProfilePage.jsx
        { name: "Manage My Account", target: "Manage My Account" }, // <--- CORRECTED
        { name: "My Orders", target: "My Orders" },
        // FIX: Removed 'My WishList'
    ];
    
    if (role === "Farmer" || role === "Cottager") {
        topLevelItems.push({ name: "Vendor Sections", target: "Vendor Sections" });
    }
    
    return (
        <div className="mobile-nav-group-wrapper">
            <div className="mobile-nav-group">
                {topLevelItems.map((item) => (
                    // This sends the target key to ProfilePage.jsx
                     <button
                        key={item.name}
                        // Passing the group name ('Manage My Account') to ProfilePage's handleMobileNavClick
                        onClick={() => setActiveSection(item.target)} 
                     >
                        {item.name}
                     </button>
                ))}
            </div>
        </div>
    );
  }

  // The isMobile check should ideally rely on the prop passed from ProfilePage, 
  // but since it's not, we rely on the local check.
  return isMobileDevice() ? renderMobileNavigation() : renderDesktopSidebar();
};

export default Sidebar;