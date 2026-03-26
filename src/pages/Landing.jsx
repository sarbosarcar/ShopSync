import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Zap, Box } from 'lucide-react';
import Button from '../components/Button';

export default function Landing() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 min-h-[80vh] flex items-center justify-center px-4 overflow-hidden py-20">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-10 pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] border-4 border-[var(--text-primary)] rotate-12" />
          <div className="absolute top-[40%] right-[10%] w-[20vw] h-[20vw] border-4 border-[var(--text-primary)] -rotate-45" />
          <div className="absolute bottom-[-10%] left-[30%] w-[40vw] h-[40vw] border-4 border-[var(--text-primary)] rotate-45" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <p className="text-sm md:text-base font-bold tracking-[0.4em] uppercase text-[var(--text-secondary)]">The Future of Commerce</p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none">
              Aesthetic <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]" 
                    style={{ WebkitTextStroke: '2px var(--text-primary)'}}>
                Intelligence
              </span>
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-secondary)] font-medium">
            Explore our curated selection of high-end minimalist products, powered by a state-of-the-art AI recommender system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full flex items-center justify-center gap-3 py-5 px-10 text-lg">
                Shop Collection <ArrowRight size={20} />
              </Button>
            </Link>
            <Button 
                variant="outline" 
                onClick={() => {
                   document.querySelector('button:has(svg.lucide-search)')?.click()
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-3 py-5 px-10 text-lg"
              >
                <Bot size={20} /> Try AI Recommender
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="border-t-2 border-[var(--border-color)] bg-[var(--bg-secondary)] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[var(--border-color)]">
          <div className="p-12 md:p-16 space-y-6 group hover:bg-[var(--bg-primary)] transition-colors">
            <Box className="w-12 h-12 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
            <h3 className="font-black uppercase tracking-widest text-xl">Curated Selection</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">Experience a highly filtered catalogue of geometric, monochrome essentials designed for modern environments.</p>
          </div>
          <div className="p-12 md:p-16 space-y-6 group hover:bg-[var(--bg-primary)] transition-colors">
            <Bot className="w-12 h-12 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
            <h3 className="font-black uppercase tracking-widest text-xl">AI Assistant</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">Interact with our recommender LLM to find the perfect addition to your setup through conversational discovery.</p>
          </div>
          <div className="p-12 md:p-16 space-y-6 group hover:bg-[var(--bg-primary)] transition-colors">
            <Zap className="w-12 h-12 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
            <h3 className="font-black uppercase tracking-widest text-xl">Fast Architecture</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">Built on modern React and Vite for blazing fast, reliable browsing across all your devices.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
