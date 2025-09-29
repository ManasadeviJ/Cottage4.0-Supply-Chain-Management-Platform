// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { Button } from "../../ui/Button"; // relative path

import "./QuickView.css";

export default function QuickView({ open, setOpen, product }) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="quickview-dialog">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="quickview-content">
          <img src={product.image} alt={product.name} className="quickview-img" />
          <div>
            <p className="quickview-price">₹{product.price || product.currentBid}</p>
            <p className="quickview-desc">{product.description}</p>
            <div className="quickview-actions">
              {product.price ? <Button>Buy Now</Button> : <Button>Place Bid</Button>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
