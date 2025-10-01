import React, { useState } from "react";
import { Menu, X, Search, User, Heart, ShoppingCart } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import "./Header.css";

export default function Header({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!user;

  return (
    <header className="header">
      
      {/* 1. Logo */}
      <div className="header-logo">
        <Link to="/" className="logo-link">
          <span className="logo-text">Cottage</span> 
        </Link>
      </div>

      {/* 2. Main Navigation Links */}
      <nav className={`nav-links-container ${mobileMenuOpen ? "open" : ""}`}>
        <button 
          className="mobile-close-btn" 
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* This button is only visible on mobile, hiding on desktop via CSS */}
          <X size={24} />
        </button>

        <ul className="nav-links">
          {/* THE CROSS BUTTON FIX: The border around Home/X in the image is likely a temporary debugging artifact or misaligned list item, 
             which the CSS below will correct by resetting its styles. */}
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/marketplace">Market Place</Link></li>
          <li><Link to="/auction">Auction</Link></li>
          
          {/* Sign Up as a text button in the main nav for desktop/tablet */}
          {!isAuthenticated && (
            <li className="signup-nav-item">
              <Link to="/register" className="btn btn-signup-nav">Sign Up</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* 3. Search Box & Utility Icons */}
      <div className="header-actions-right">
        
        {/* Search Input Box */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search products, auctions..." 
            className="search-input" 
          />
          <Search className="search-icon" size={20} />
        </div>

        {/* Utility Icons (Heart, Cart, Profile) */}
        <div className="utility-icons">
          <Link to="/wishlist" className="icon-link">
            <Heart size={24} className="icon" />
          </Link>
          
          <Link to="/cart" className="icon-link">
            <ShoppingCart size={24} className="icon" />
          </Link>
          
          <Link to="/profile" className="icon-link profile-link">
            <User size={24} className="icon" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Icon */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}