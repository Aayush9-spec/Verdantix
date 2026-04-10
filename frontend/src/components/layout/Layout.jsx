import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col pt-32 pb-12 overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Premium Global Background Architecture */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Immersive Photo Layer with Subtle Zoom */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600')` }}
        />

        {/* Global Darkening Overlay for Scientific Contrast */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Global Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.04] contrast-125 brightness-110" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
        
        {/* Global Coordinate Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Subtle Ambient Orbs for Depth */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 80, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
        />
      </div>

      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Subtle Premium Footer */}
      <footer className="relative z-10 pt-20 text-center pb-8">
        <div className="flex flex-col items-center gap-4">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           <p className="text-[10px] font-black tracking-[0.5em] text-gray-700 uppercase">
             Verdantix Carbon Intelligence // v4.2 Deployment
           </p>
           <div className="flex gap-8 text-[8px] font-black text-gray-800 uppercase tracking-widest">
              <span>Scientific Grounding</span>
              <span>•</span>
              <span>Neural Calculation</span>
              <span>•</span>
              <span>Kaggle Verified</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
