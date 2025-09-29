import { ShoppingCart } from "lucide-react";
import "./FloatingCart.css";

export default function FloatingCart() {
  return (
    <div className="floating-cart">
      <ShoppingCart className="cart-icon" />
      <span className="cart-badge">3</span>
    </div>
  );
}
