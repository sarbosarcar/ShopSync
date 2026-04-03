import { useState, useRef, useEffect } from 'react';
import { Search, X, Bot, User, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Button from './Button';
import { AI_RESPONSES, PRODUCTS } from '../data/mock';

export default function ChatUI({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI shopping assistant. What are you looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (text) => {
    const userMsg = typeof text === 'string' ? text : input;
    if (!userMsg.trim()) return;

    const history = messages
      .filter(m => m.text)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recommend/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history })
      });

      if (!res.ok) throw new Error("API Network request failed");

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: data.reply, products: data.products }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: "Sorry, the recommender service is unavailable." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)] transition-all duration-300">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--text-secondary)_0%,_transparent_40%)] animate-[spin_60s_linear_infinite]" />
      </div>

      <div className="relative z-10 flex items-center justify-between p-4 border-b-2 border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[var(--text-primary)] flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)]">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold uppercase tracking-widest text-lg leading-none">AI Assistant</h2>
            <p className="text-xs text-[var(--text-secondary)] tracking-wider">ONLINE</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 border border-transparent hover:border-[var(--text-primary)] transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div data-lenis-prevent="true" className="relative z-10 flex-1 min-h-0 overflow-y-auto p-4 md:p-8 space-y-6 container max-w-4xl mx-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 flex items-center justify-center shrink-0 border-2 ${msg.role === 'user' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-primary)]'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
<div className={`max-w-[90%] md:max-w-[70%] space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
  <div className={`inline-block p-3 px-4 rounded-lg text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)] border border-[var(--border-color)]'}`}>
    {msg.role === 'user' ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
  </div>

{/* Product Recommendations */}
{msg.products && msg.products.length > 0 && (
  <div className={`flex flex-wrap gap-4 mt-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    {msg.products.slice(0, 4).map(product => (
      <div key={product.product_id} className="w-44 sm:w-52 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] group hover:border-[var(--text-primary)] transition-colors text-left overflow-hidden">
        <div className="aspect-square relative overflow-hidden bg-[var(--bg-secondary)] border-b-2 border-[var(--border-color)]">
<img
              src={product.image || 'https://via.placeholder.com/300?text=ShopSync'}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=ShopSync'; e.target.onerror = null; }}
            />
        </div>
        <div className="p-3 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider line-clamp-2 leading-tight">{product.name}</h4>
          <p className="text-sm font-bold text-[var(--text-primary)]">{product.discount_price || product.actual_price || 'N/A'}</p>
          <Link to={`/product/${product.product_id}`} onClick={onClose} className="block w-full">
            <button className="w-full text-xs uppercase font-bold tracking-widest border border-[var(--border-color)] py-1.5 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--text-primary)] transition-all flex items-center justify-center gap-1">
              View <ArrowRight size={12} />
            </button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 border-2 bg-[var(--bg-secondary)] border-[var(--border-color)]">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
            <div className="inline-block p-4 border-2 bg-[var(--bg-primary)] border-[var(--border-color)] animate-pulse">
              Processing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative z-10 p-4 border-t-2 border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="container max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {['Recommend gadgets', 'Show fashion items', 'Minimalist furniture'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="text-xs uppercase font-bold tracking-wider border border-[var(--border-color)] px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] focus-within:border-[var(--text-primary)] transition-colors p-1"
          >
            <Search className="w-6 h-6 mx-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI for recommendations..."
              className="flex-1 bg-transparent p-3 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] font-medium"
            />
            <Button type="submit" variant="primary" className="py-3 px-8 text-sm disabled:opacity-50" disabled={isTyping || !input.trim()}>
              SEND
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
