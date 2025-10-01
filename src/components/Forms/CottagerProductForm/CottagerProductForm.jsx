import { useState } from "react";
import "./CottagerProductForm.css"; // Assuming a shared CSS file for form styling

export default function CottagerProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageFile: null,
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
    // TODO: Implement API call to submit the product
    console.log("Submitting Cottager Product:", formData);

    // Simulate API call delay
    setTimeout(() => {
        setLoading(false);
        alert("Product added successfully!");
        // Reset form
        setFormData({
            name: "", description: "", price: "", stock: "",
            category: "", imageFile: null,
        });
    }, 1500);
  };

  return (
    <div className="form-container">
      <h2>Add Product for Direct Sale (Cottager)</h2>
      <form onSubmit={handleSubmit} className="product-form">
        
        {/* Product Name */}
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Handmade Soap, Pickled Chillies"
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
            placeholder="Detail your artisanal product..."
          />
        </div>
        
        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Fixed Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            placeholder="e.g., 250.00"
          />
        </div>
        
        {/* Stock/Inventory */}
        <div className="form-group">
          <label htmlFor="stock">Available Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="1"
            required
            placeholder="e.g., 50 units"
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
            <option value="Preserves">Preserves & Jams</option>
            <option value="BakedGoods">Baked Goods</option>
            <option value="Crafts">Handicrafts</option>
            <option value="PersonalCare">Personal Care</option>
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

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product for Sale"}
        </button>
      </form>
    </div>
  );
}