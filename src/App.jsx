import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Ensure this path is correct

// Import all existing page components
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import HomePage from "./pages/HomePage/HomePage";
import AuctionPage from "./pages/AuctionPage/AuctionPage";
import MarketplacePage from "./pages/MarketplacePage/MarketplacePage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage/AuctionDetailsPage";
import MarketplaceDetailsPage from "./pages/MarketplaceDetailsPage/MarketplaceDetailsPage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

// --- Import the new Wishlist Page component ---
import WishlistPage from "./pages/WishlistPage/WishlistPage"; 

import Header from "./components/Header/Header";

// --- Protected Route ---
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    // Navigate to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- Layout with Header ---
const Layout = ({ children }) => {
  return (
    <>
     <Header />
      <div>{children}</div>
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading Application...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes (No Header) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/signup" element={<RegistrationPage />} />

        {/* Main Routes (With Header) */}
        <Route
          path="/home"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/auction"
          element={
            <Layout>
              <AuctionPage />
            </Layout>
          }
        />
        <Route
          path="/marketplace"
          element={
            <Layout>
              <MarketplacePage />
            </Layout>
          }
        />
        <Route
          path="/auction/:id"
          element={
            <Layout>
              <AuctionDetailsPage />
            </Layout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <Layout>
              <MarketplaceDetailsPage />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <CheckoutPage />
            </Layout>
          }
        />

        {/* Protected Routes (with Header) */}
        {/* --- New Wishlist Route Added Here --- */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute user={user}>
              <Layout>
                <WishlistPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;