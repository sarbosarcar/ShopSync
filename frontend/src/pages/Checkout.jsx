import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { ArrowLeft, Check } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-widest mb-4">Order Placed!</h1>
        <p className="text-[var(--text-secondary)] mb-8">Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <Link to="/shop">
          <Button variant="primary" className="px-8 py-4">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-black uppercase tracking-widest mb-4">Your Cart is Empty</h1>
        <p className="text-[var(--text-secondary)] mb-8">Add some items to checkout.</p>
        <Link to="/shop">
          <Button variant="primary" className="px-8 py-4">Go to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-8 hover:text-[var(--text-secondary)]">
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <h1 className="text-4xl font-black uppercase tracking-widest mb-10 pb-4 border-b-2 border-[var(--border-color)]">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {!isAuthenticated && (
            <div className="border-2 border-[var(--border-color)] p-6">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Sign In</h2>
              <p className="text-[var(--text-secondary)] mb-4">Please sign in to complete your order.</p>
              <p className="text-sm text-[var(--text-secondary)]">This is a demo - orders will be placed without authentication.</p>
            </div>
          )}

          <div className="border-2 border-[var(--border-color)] p-6">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full p-3 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus:border-[var(--text-primary)] outline-none" />
              <input type="text" placeholder="Address" className="w-full p-3 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus:border-[var(--text-primary)] outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="w-full p-3 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus:border-[var(--text-primary)] outline-none" />
                <input type="text" placeholder="ZIP Code" className="w-full p-3 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus:border-[var(--text-primary)] outline-none" />
              </div>
            </div>
          </div>

          <div className="border-2 border-[var(--border-color)] p-6">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Payment Method</h2>
            <p className="text-[var(--text-secondary)]">Demo mode - no actual payment will be processed.</p>
          </div>
        </div>

        <div className="lg:col-span-1 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 h-fit sticky top-28">
          <h2 className="text-xl font-black uppercase tracking-widest mb-6">Order Summary</h2>

          <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold uppercase tracking-wider truncate">{item.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-mono font-bold">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-[var(--border-color)] pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="uppercase tracking-wider text-sm">Subtotal</span>
              <span className="font-mono">${cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase tracking-wider text-sm">Shipping</span>
              <span className="font-mono">$0</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--border-color)]">
              <span className="uppercase tracking-widest font-black">Total</span>
              <span className="font-mono font-bold text-xl">${cartTotal}</span>
            </div>
          </div>

          <Button variant="primary" className="w-full py-4 mt-8" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}