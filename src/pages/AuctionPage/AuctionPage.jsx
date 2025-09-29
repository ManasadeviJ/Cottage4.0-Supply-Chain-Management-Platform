import AuctionCard from "../../components/Card/AuctionCard/AuctionCard";
import Header from "../../components/Header/Header";
import "./AuctionPage.css";

export default function AuctionPage() {
  const auctions = [
    { id: 1, name: "Wheat Lot", currentBid: 1500, endsIn: "02:15:45", image: "src/images/Frame 861.png", description: "Fresh wheat grains." },
    { id: 2, name: "Tomato Basket", currentBid: 300, endsIn: "00:45:20", image: "src/images/Frame 861.png", description: "Farm fresh tomatoes." },
    { id: 3, name: "Potato Sack", currentBid: 450, endsIn: "01:30:00", image: "src/images/Frame 861.png", description: "Organic potatoes." }
  ];

  return (
    <div className="auction-page">
      <Header />
      <h2 className="page-title">Raw Materials (Auction)</h2>
      <div className="card-grid">
        {auctions.map((a) => (
          <AuctionCard key={a.id} auction={a} />
        ))}
      </div>
    </div>
  );
}
