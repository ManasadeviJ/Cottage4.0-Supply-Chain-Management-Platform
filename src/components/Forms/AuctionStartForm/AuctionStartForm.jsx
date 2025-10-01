import { useState } from "react";
import './AuctionStartForm.css'; 

export default function AuctionStartForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingBid: "",
    quantity: "",
    category: "",
    imageFile: null,
    auctionEndTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call to submit the auction
    console.log("Submitting Auction:", formData);
    
    // Simulate API call delay
    setTimeout(() => {
        setLoading(false);
        alert("Auction started successfully!");
        // Reset form
        setFormData({
            name: "", description: "", startingBid: "", quantity: "",
            category: "", imageFile: null, auctionEndTime: "",
        });
    }, 1500);
  };

  return (
    <div className="form-container">
      <h2>Start a New Produce Auction (Farmer)</h2>
      <form onSubmit={handleSubmit} className="product-form">
        
        {/* Product Name */}
        <div className="form-group">
          <label htmlFor="name">Produce Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Organic Tomatoes"
          />
        </div>

        {/* Product Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Tell buyers about your fresh produce..."
          />
        </div>
        
        {/* Quantity */}
        <div className="form-group">
          <label htmlFor="quantity">Quantity (e.g., kg, dozen)</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            placeholder="e.g., 50 kg"
          />
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            <option value="Dairy">Dairy</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="imageFile">Product Image</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        
        {/* --- Auction Details --- */}
        <div className="form-section-header">Auction Details</div>

        {/* Starting Bid */}
        <div className="form-group">
          <label htmlFor="startingBid">Starting Bid (₹)</label>
          <input
            type="number"
            id="startingBid"
            name="startingBid"
            value={formData.startingBid}
            onChange={handleChange}
            min="0"
            step="1"
            required
            placeholder="Minimum starting bid amount"
          />
        </div>

        {/* Auction End Time */}
        <div className="form-group">
          <label htmlFor="auctionEndTime">Auction End Date & Time</label>
          <input
            type="datetime-local"
            id="auctionEndTime"
            name="auctionEndTime"
            value={formData.auctionEndTime}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Starting Auction..." : "Start Auction"}
        </button>
      </form>
    </div>
  );
}