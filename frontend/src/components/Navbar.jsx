import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Sun, Moon, Menu, X, User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ChatUI from './ChatUI';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, login, logout, isAuthenticated } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
    setIsLoginOpen(false);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[var(--bg-primary)] border-b-2 border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center">
              <Link to="/" className="font-black text-2xl tracking-widest uppercase">
                SHOP<span className="text-[var(--text-secondary)] font-light">SYNC</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/shop" className="text-sm font-bold uppercase tracking-widest hover:text-[var(--text-secondary)] transition-colors">Shop</Link>
              
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex items-center space-x-3 border-2 border-[var(--border-color)] px-4 py-2 hover:border-[var(--text-primary)] transition-all group bg-[var(--bg-secondary)]"
              >
                <Search className="w-4 h-4 text-[var(--text-primary)] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Ask AI Recommender...</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
              <button onClick={toggleTheme} className="p-2 border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all" aria-label="Toggle theme">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
{isAuthenticated ? (
              <button onClick={logout} className="p-2 border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all" aria-label="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="p-2 border-2 border-[var(--border-color)] hover:border-[var(--text-primary)] transition-all" aria-label="Login">
                <User className="w-5 h-5" />
              </button>
            )}
            <Link to="/cart" className="relative p-2 border-2 border-transparent hover:border-[var(--text-primary)] transition-all">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-bold w-5 h-5 flex items-center justify-center -translate-y-1/2 translate-x-1/2 border-2 border-[var(--bg-primary)]">
                  {cartCount}
                </span>
              )}
            </Link>

              <button className="md:hidden p-2 border-2 border-[var(--border-color)]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-4 space-y-4">
            <Link to="/shop" className="block text-sm font-bold uppercase tracking-widest p-4 border-2 border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
            <button 
                onClick={() => { setIsChatOpen(true); setIsMobileMenuOpen(false); }}
                className="flex w-full items-center justify-center space-x-2 border-2 border-[var(--border-color)] px-4 py-4 bg-[var(--bg-secondary)] hover:border-[var(--text-primary)] transition-colors"
              >
                <Search className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">AI Recommender</span>
            </button>
          </div>
        )}
      </nav>

<ChatUI isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

  {isLoginOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsLoginOpen(false)}>
      <div className="bg-[var(--bg-primary)] border-2 border-[var(--border-color)] p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold uppercase tracking-widest">Login</h2>
          <button onClick={() => setIsLoginOpen(false)} className="p-2 hover:bg-[var(--bg-secondary)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus:border-[var(--text-primary)] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus:border-[var(--text-primary)] outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold uppercase tracking-widest hover:opacity-90">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )}
  </>
  );
}
