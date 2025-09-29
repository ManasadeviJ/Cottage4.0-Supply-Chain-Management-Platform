import { useParams, useNavigate } from "react-router-dom"; 
import { useEffect, useState } from "react";
import BuyCard from "../../components/Card/BuyCard/BuyCard";
import riceImage from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png";
import riceImage2 from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png"; 
import riceImage3 from "../../images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png";

import './MarketplaceDetailsPage.css';
import { FaStar, FaRegStar } from 'react-icons/fa'; 
import { LuPackage } from 'react-icons/lu'; 

const relatedProductsData = [
    { id: 'rel1', name: 'Organic Rice - 5kg', price: 650, image: 'path/to/img9.png' },
    { id: 'rel2', name: 'Spicy Masala Mix', price: 150, image: 'path/to/img10.png' },
    { id: 'rel3', name: 'Almond Oil (1L)', price: 900, image: 'path/to/img11.png' },
    { id: 'rel4', name: 'Local Honey Jar', price: 320, image: 'path/to/img12.png' },
];

export default function MarketplaceDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); 
    const [mainImage, setMainImage] = useState(null); // state for main image

    useEffect(() => {
        // Example mock product with multiple images
        const mockProduct = {
            id,
            name: "Organic Rice",
            producer: "COTTAGE FOODS INC.",
            producerId: "p123",
            price: 1200,
            images: [riceImage, riceImage2, riceImage3], // multiple images
            description: "High-quality, naturally grown organic rice, sourced directly from local farmers. 10kg bag.",
            stock: 50, 
            unit: "kg",
        };
        setProduct(mockProduct);
        setMainImage(mockProduct.images[0]); // default main image
    }, [id]);

    if (!product) return <p>Loading...</p>;

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    const handleAddToCart = () => {
        console.log(`Added ${quantity} of ${product.name} to cart.`);
        alert(`${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        console.log(`Buying ${quantity} of ${product.name} immediately.`);
        navigate(`/checkout?productId=${product.id}&qty=${quantity}`);
    };

    const handleProducerClick = () => {
        navigate(`/producer/${product.producerId}`);
    };

    return (
        <div className="marketplace-details-page">
            
            <div className="product-purchase-section">
                <h1 className="section-title">Marketplace Products</h1>
                
                {/* Image Section with thumbnails */}
                <div className="product-images">
                    <img 
                        src={mainImage} 
                        alt={product.name} 
                        className="product-details-img" 
                    />
                    <div className="thumbnail-container">
                        {product.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`Thumbnail ${index}`} 
                                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Details and Purchase Section */}
                <div className="product-details">
                    <h2 className="product-name">{product.name}</h2>
                    <button className="producer-link" onClick={handleProducerClick}>
                        {product.producer}
                    </button>
                    
                    <div className="price-row">
                        <p className="current-price">Price: ₹{product.price.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="rating-and-actions">
                        <span className="stock-indicator">
                            <LuPackage /> Stock: {product.stock}
                        </span>
                        <div className="rating-stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
                        </div>
                        <span className="review-count">(36 Reviews)</span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="purchase-box">
                        <p>Quantity ({product.unit}):</p>
                        <div className="quantity-input-container">
                            <div className="quantity-input">
                                <button onClick={() => handleQuantityChange(-1)}>-</button>
                                <input 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value) || 1)} 
                                    min="1"
                                />
                                <button onClick={() => handleQuantityChange(1)}>+</button>
                            </div>

                            <button className="buy-now-button" onClick={handleBuyNow}>
                                BUY NOW
                            </button>
                            
                            <button className="add-to-cart-button" onClick={handleAddToCart}>
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <h2 className="section-title">Related Marketplace Items</h2>
            <div className="product-grid">
                {relatedProductsData.map(item => (
                    <BuyCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
}
