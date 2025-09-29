import React from 'react';
// import { FaPen, FaShareAlt } from 'react-icons/fa'; // Example icons
import "./Sidebar.css"; 

const Sidebar = ({ role, userData, activeSection, setActiveSection, onEditPhoto }) => {
  
  // Define menu structure: All items are indented
  let menuMap = {
      'Manage My Account': ['My Profile', 'Address Book', 'My Payment Options'],
      // Track of placed orders added
      'My Orders': ['Order Details (Tracking)', 'My Returns', 'My Cancellations'], 
  };

  // Add Vendor Sections conditionally
  if (role === "Farmer" || role === "Cottager") {
      menuMap['Vendor Sections'] = [
          (role === "Farmer" ? "Farm Produce (Inventory)" : "Cottage Products (Inventory)"),
          'Start Auction Form', 
          'Auction/Bid Analytics', 
          'Legal & Compliance', 
          (role === "Farmer" ? "Land Ownership Proof" : "Business ID Proof"), 
      ];
  }

  const renderGroup = (groupName, items) => (
    <div key={groupName} className="menu-group">
      <p className="menu-header">{groupName}</p>
      {items.map((item) => (
        <button
          key={item}
          // All menu items get the same indentation class
          className={`${activeSection === item ? "active" : ""}`}
          onClick={() => setActiveSection(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <aside className="sidebar">
      
      {renderGroup('Manage My Account', menuMap['Manage My Account'])}
      {renderGroup('My Orders', menuMap['My Orders'])}
      
      {/* Removed My WishList based on requirement */}

      {/* Vendor Sections Group (Conditional) */}
      {menuMap['Vendor Sections'] && renderGroup('Vendor Sections', menuMap['Vendor Sections'])}

    </aside>
  );
};

export default Sidebar;