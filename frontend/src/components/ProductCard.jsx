import { Link } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group border border-[var(--border-color)] bg-[var(--bg-primary)] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[var(--text-primary)] hover:shadow-[8px_8px_0px_var(--border-color)]">
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
          <img
            src={product.image || 'https://via.placeholder.com/300?text=ShopSync'}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=ShopSync'; e.target.onerror = null; }}
          />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">{product.category}</p>
        <h3 className="font-bold text-[var(--text-primary)] text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-[var(--text-primary)] font-mono mb-5">₹{product.price}</p>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link to={`/product/${product.id}`} className="block">
            <Button variant="outline" className="w-full text-xs py-2 flex items-center justify-center">Details</Button>
          </Link>
          <Button variant="primary" className="w-full text-xs py-2 flex items-center justify-center" onClick={() => addToCart(product)}>Add</Button>
        </div>
      </div>
    </div>
  );
}
