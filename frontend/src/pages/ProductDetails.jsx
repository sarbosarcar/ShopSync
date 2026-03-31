import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <h2 className="text-2xl font-black uppercase tracking-widest text-[var(--text-secondary)]">Loading...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-black uppercase tracking-widest mb-4">Product Not Found</h2>
        <Link to="/shop">
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full flex flex-col">
      <Link to="/shop" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 self-start transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-square bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">{product.main_category}</p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-mono">{product.discount_price}</p>
          </div>

          <div className="w-16 h-1 bg-[var(--text-primary)]" />

          {/* <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {product.description}
          </p> */}

          <div className="pt-8">
            <Button
              variant="primary"
              className="w-full md:w-auto py-4 px-12 text-lg uppercase tracking-widest font-black"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
