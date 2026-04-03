import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-[var(--border-color)] m-12 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-black uppercase tracking-widest mb-6 text-center">Your Cart is Empty</h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-sm text-center">It seems like you haven't added anything to your cart yet.</p>
        <Link to="/shop">
          <Button variant="primary" className="flex items-center gap-2 py-4 px-8 uppercase tracking-widest font-bold">
            Start Shopping <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
      <h1 className="text-4xl font-black uppercase tracking-widest mb-10 pb-4 border-b-2 border-[var(--border-color)]">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-2 border-[var(--border-color)] p-4 bg-[var(--bg-primary)] group hover:border-[var(--text-primary)] transition-colors">
              <div className="w-full sm:w-32 h-32 shrink-0 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] overflow-hidden">
                <img 
                  src={item.image || 'https://via.placeholder.com/300?text=ShopSync'} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=ShopSync'; e.target.onerror = null; }}
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <Link to={`/product/${item.id}`} className="font-bold uppercase tracking-wider hover:underline">{item.name}</Link>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-[var(--bg-secondary)] transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm font-mono text-[var(--text-secondary)] mt-1">₹{item.price}</p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-start gap-4 mt-6">
                  <div className="flex items-center border-2 border-[var(--border-color)]">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] font-mono transition-colors"
                    >-</button>
                    <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] font-mono transition-colors"
                    >+</button>
                  </div>
                  <p className="font-mono font-bold ml-auto sm:ml-4 text-lg">₹{(parseFloat(item.price) || 0) * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-8 h-fit sticky top-28">
          <h2 className="text-xl font-black uppercase tracking-widest mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
             <div className="flex justify-between text-[var(--text-secondary)]">
               <span className="uppercase tracking-wider text-sm font-bold">Subtotal</span>
               <span className="font-mono">₹{cartTotal}</span>
             </div>
             <div className="flex justify-between text-[var(--text-secondary)]">
               <span className="uppercase tracking-wider text-sm font-bold">Shipping</span>
               <span className="uppercase tracking-wider text-sm font-bold">Calculated at checkout</span>
             </div>
             <div className="border-t-2 border-[var(--border-color)] pt-4 flex justify-between">
               <span className="uppercase tracking-widest font-black">Total</span>
               <span className="font-mono font-bold text-xl">₹{cartTotal}</span>
             </div>
          </div>
          
          <Button variant="primary" className="w-full py-4 text-sm font-bold tracking-widest uppercase">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
