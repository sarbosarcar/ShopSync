export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] mt-auto bg-[var(--bg-secondary)] py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-[var(--text-secondary)]">
        <div>
          <h3 className="text-[var(--text-primary)] font-bold text-xl uppercase mb-4 tracking-widest">ShopSync</h3>
          <p className="text-sm border-l-2 border-[var(--accent)] pl-3">
            Minimalist apparel, home goods, and tech accessories. Empowered by AI.
          </p>
        </div>
        <div>
          <h4 className="text-[var(--text-primary)] font-semibold mb-4 uppercase tracking-wider">Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/shop" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">Shop All</a></li>
            <li><a href="/cart" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">Cart</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[var(--text-primary)] font-semibold mb-4 uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">FAQ</a></li>
            <li><a href="#" className="hover:text-[var(--text-primary)] transition-colors uppercase tracking-widest">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
