import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, Filter, Loader } from 'lucide-react';

export default function Shop() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(p => ({
          id: p.product_id,
          name: p.name,
          category: p.main_category || 'Uncategorized',
          price: (p.discount_price || p.actual_price || '0').replace(/₹|,/g, ''),
          description: p.sub_category || '',
          image: p.image || 'https://via.placeholder.com/300'
        }));
        setDbProducts(mapped);
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(dbProducts.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return dbProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, dbProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1 flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div>
          <h2 className="font-black uppercase tracking-widest text-xl mb-6 flex items-center gap-2">
            <Filter size={20} /> Filters
          </h2>

          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="SEARCH..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] py-3 pl-10 pr-4 outline-none focus:border-[var(--text-primary)] transition-colors uppercase text-sm tracking-widest placeholder:text-[var(--text-secondary)]"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`block w-full text-left py-2 px-4 border-l-4 transition-all uppercase text-sm font-bold tracking-widest ${category === c
                        ? 'border-[var(--text-primary)] text-[var(--text-primary)] bg-[var(--bg-secondary)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]'
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8 border-b-2 border-[var(--border-color)] pb-4">
          <h1 className="text-3xl font-black uppercase tracking-widest">{category === 'All' ? 'All Products' : category}</h1>
          <span className="text-[var(--text-secondary)] font-mono text-sm">{filteredProducts.length} RESULTS</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader className="w-12 h-12 animate-spin text-[var(--text-primary)]" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-6 py-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors font-bold uppercase tracking-widest text-sm"
                >
                  Previous
                </button>
                <span className="font-mono text-sm tracking-widest text-[var(--text-secondary)]">
                  PAGE {currentPage} OF {totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors font-bold uppercase tracking-widest text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <p className="text-[var(--text-secondary)] uppercase tracking-widest font-bold">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
