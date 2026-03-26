import { useState, useMemo } from 'react';
import { PRODUCTS } from '../data/mock';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

export default function Shop() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

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
                    className={`block w-full text-left py-2 px-4 border-l-4 transition-all uppercase text-sm font-bold tracking-widest ${
                      category === c 
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <p className="text-[var(--text-secondary)] uppercase tracking-widest font-bold">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
