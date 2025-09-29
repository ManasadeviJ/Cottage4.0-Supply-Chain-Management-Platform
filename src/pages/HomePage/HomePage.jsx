
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyCard from "../../components/Card/BuyCard/BuyCard";
import AuctionCard from "../../components/Card/AuctionCard/AuctionCard";
import QuickView from "../../components/Card/QuickView/QuickView";
import "./HomePage.css";

export default function HomePage() {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Dummy data
  const products = [
    { id: 1, name: "Organic Rice", price: 1200, image: "src/images/Frame 865.png", description: "High quality organic rice." },
    { id: 2, name: "Groundnut Oil", price: 400, image: "/assets/oil.jpg", description: "Pure cold pressed oil." }
  ];

  const auctions = [
    { id: 1, name: "Wheat Lot", currentBid: 1500, endsIn: "02:15:45", image: "src/images/Frame 861.png", description: "Fresh wheat grains." },
    { id: 2, name: "Tomato Basket", currentBid: 300, endsIn: "00:45:20", image: "src/images/Frame 861.png", description: "Farm fresh tomatoes." },
    { id: 2, name: "Tomato Basket", currentBid: 300, endsIn: "00:45:20", image: "src/images/Frame 861.png", description: "Farm fresh tomatoes." },
    { id: 2, name: "Tomato Basket", currentBid: 300, endsIn: "00:45:20", image: "src/images/Frame 861.png", description: "Farm fresh tomatoes." },
    { id: 2, name: "Tomato Basket", currentBid: 300, endsIn: "00:45:20", image: "src/images/Frame 861.png", description: "Farm fresh tomatoes." }


  ];
  return (
    <div className="home-container">


      <main className="home-main">
        {/* Carousel/Banner */}
        <section className="carousel-section">
          <img src="src/images/Frame 865.png" alt="Farm Banner" className="carousel-img" />
        </section>

        {/* Auction & Market Cards Section */}
        <section className="cards-section">
          <div className="info-card" onClick={() => navigate("/auction")}>
            <div className="info-content">
              <h2>Auction Place</h2>
              <p>Live Auction products are listed here</p>
              <button>View All</button>
            </div>
            <img src="src/images/agricultural-expertise-sustainable-farming-fields_818261-51988 1.png" alt="Auction Place" />
          </div>

          <div className="info-card" onClick={() => navigate("/marketplace")}>
            <div className="info-content">
              <h2>Market Place</h2>
              <p>Processed products from the cottagers are listed here</p>
              <button>View All</button>
            </div>
            <img src="src/images/Frame 861.png" alt="Market Place" />
          </div>
        </section>

        {/* Auction Products */}
        <section className="home-section">
          <h2 className="section-title">Auction Products</h2>
          <div className="card-grid">
            {auctions.map((a) => (
              // Removed the extra <div> wrapper here
              <AuctionCard
                key={a.id}
                auction={a}
              />
            ))}
          </div>
        </section>

        {/* Marketplace Products */}
        <section className="home-section">
          <h2 className="section-title">Marketplace Products</h2>
          <div className="card-grid">
            {products.map((p) => (
              // Removed the extra <div> wrapper here
              <BuyCard
                key={p.id}
                product={p}
                onQuickView={(prod) => {
                  setSelectedProduct(prod);
                  setQuickViewOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Floating cart + QuickView */}
      <QuickView open={quickViewOpen} setOpen={setQuickViewOpen} product={selectedProduct} />
    </div>
  );
}