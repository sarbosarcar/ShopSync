import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Box, Bot, Zap } from 'lucide-react';
import Button from '../components/Button';
import { PRODUCTS } from '../data/mock';

export default function Landing() {
  const showcaseProducts = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[var(--bg-primary)]">
      
      {/* Background AI Aura Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[60%] w-[600px] h-[600px] bg-[#3B82F6]/20 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] left-[40%] w-[500px] h-[500px] bg-[#8B5CF6]/20 rounded-full blur-[100px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex items-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full lg:gap-8">
          
          {/* Hero Left (55%) */}
          <div className="lg:w-[55%] flex flex-col gap-8 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-6xl lg:text-[80px] font-medium leading-[1.1] tracking-[-0.02em] font-['Space_Grotesk'] text-[var(--text-primary)]">
              Curated for you. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Instantly.</span>
            </h1>
            
            <p className="text-xl leading-relaxed text-[var(--text-secondary)] font-normal max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
              ShopSync uses intelligent curation to filter out the noise. Find high-end, minimalist essentials tailored to your aesthetic in seconds, not hours.
            </p>
            
            <div className="flex flex-col gap-3 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 fill-mode-both">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  variant="primary" 
                  onClick={() => document.querySelector('button:has(svg.lucide-search)')?.click()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 !border-transparent !bg-[var(--text-primary)] !text-[var(--bg-primary)] hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                   <Sparkles size={18} fill="currentColor" /> Start Smart Search
                </Button>
                <Link to="/shop" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full flex items-center justify-center py-4 px-8 border border-[var(--border-color)] backdrop-blur-md bg-[var(--bg-secondary)] hover:bg-[rgba(255,255,255,0.05)] whitespace-nowrap">
                    Explore Catalog <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] tracking-widest uppercase font-semibold">
                Takes 30 seconds • Powered by ShopSync AI
              </p>
            </div>
          </div>

          {/* Hero Right: 3D Staggered Dashboard Preview (45%) */}
          <div className="hidden lg:flex lg:w-[45%] relative h-[600px] items-center justify-center animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
            {/* Center Card */}
            <div className="absolute z-30 transform hover:scale-[1.02] transition-transform duration-500">
               <div className="w-64 backdrop-blur-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl shadow-black/50 p-4">
                  <div className="aspect-square overflow-hidden mb-4 border border-[var(--border-color)]">
                     <img src={showcaseProducts[0]?.image} className="w-full h-full object-cover" alt="product" />
                  </div>
                  <div className="flex justify-between items-center mb-1">
                     <h4 className="text-sm font-bold font-['Space_Grotesk']">{showcaseProducts[0]?.name}</h4>
                     <Sparkles size={14} className="text-[#3B82F6]" />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-mono">${showcaseProducts[0]?.price}</p>
               </div>
            </div>

            {/* Top Right Card */}
            <div className="absolute z-20 top-10 right-0 transform translate-x-12 translate-y-[-20%] rotate-6 opacity-60 hover:opacity-100 hover:rotate-0 hover:z-40 transition-all duration-700 hover:scale-[1.02]">
               <div className="w-48 backdrop-blur-md bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl p-3">
                  <div className="aspect-square overflow-hidden mb-3 border border-[var(--border-color)] filter grayscale contrast-125">
                     <img src={showcaseProducts[1]?.image} className="w-full h-full object-cover" alt="product" />
                  </div>
                  <h4 className="text-xs font-bold truncate">{showcaseProducts[1]?.name}</h4>
               </div>
            </div>

            {/* Bottom Left Card */}
            <div className="absolute z-10 bottom-10 left-0 transform -translate-x-16 translate-y-[20%] -rotate-6 opacity-60 hover:opacity-100 hover:rotate-0 hover:z-40 transition-all duration-700 hover:scale-[1.02]">
               <div className="w-56 backdrop-blur-md bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl p-4">
                  <div className="aspect-video overflow-hidden mb-3 border border-[var(--border-color)] filter grayscale contrast-125">
                     <img src={showcaseProducts[2]?.image} className="w-full h-full object-cover" alt="product" />
                  </div>
                  <h4 className="text-xs font-bold truncate">{showcaseProducts[2]?.name}</h4>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern High-End Feature Section */}
      <section className="relative z-10 border-t border-[var(--border-color)] bg-[var(--bg-primary)] mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
          <div className="p-12 md:p-16 space-y-6 group bg-transparent hover:bg-[var(--bg-secondary)] transition-colors duration-500">
            <Box className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[#3B82F6] transition-colors" />
            <h3 className="font-['Space_Grotesk'] font-semibold text-xl">Curated Selection</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">Experience a highly filtered catalogue of premium monochrome essentials designed for modern environments.</p>
          </div>
          <div className="p-12 md:p-16 space-y-6 group bg-transparent hover:bg-[var(--bg-secondary)] transition-colors duration-500">
            <Bot className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[#8B5CF6] transition-colors" />
            <h3 className="font-['Space_Grotesk'] font-semibold text-xl">Intelligent Assistant</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">Interact with our recommender LLM to find the perfect addition to your setup through conversational discovery.</p>
          </div>
          <div className="p-12 md:p-16 space-y-6 group bg-transparent hover:bg-[var(--bg-secondary)] transition-colors duration-500">
            <Zap className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-yellow-400 transition-colors" />
            <h3 className="font-['Space_Grotesk'] font-semibold text-xl">Fast Architecture</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">Built on headless architecture for blazing fast, reliable browsing paired with smooth scroll physics.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
