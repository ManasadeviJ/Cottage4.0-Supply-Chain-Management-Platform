import BuyCard from "../../components/Card/BuyCard/BuyCard";
import Header from "../../components/Header/Header";
import "./MarketplacePage.css";

export default function MarketplacePage() {
  const products = [
    { id: 1, name: "Organic Rice", price: 1200, image: "src/images/Frame 865.png", description: "High quality organic rice." },
    { id: 2, name: "Groundnut Oil", price: 400, image: "src/images/Frame 865.png", description: "Pure cold pressed oil." },
    { id: 3, name: "Coconut Powder", price: 250, image: "src/images/Frame 865.png", description: "Natural dried coconut powder." }
  ];

  return (
    <div className="marketplace-page">
      <Header />
      <h2 className="page-title">Processed Products (Marketplace)</h2>
      <div className="card-grid">
        {products.map((p) => (
          <BuyCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
