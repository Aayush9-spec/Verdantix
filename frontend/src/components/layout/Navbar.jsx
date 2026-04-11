import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Brain, 
  Zap, 
  CloudSun, 
  MessageSquare, 
  BarChart3, 
  Layers,
  Menu,
  X,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react';

const Navbar = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      performSync();
    };
    const handleOffline = () => setIsOnline(false);
    const updatePending = () => {
      const pending = JSON.parse(localStorage.getItem('pending') || '[]');
      setPendingCount(pending.length);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const interval = setInterval(updatePending, 2000);

    updatePending();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const performSync = async () => {
    const { syncOfflineData } = await import('../../api/api');
    setIsSyncing(true);
    await syncOfflineData();
    setIsSyncing(false);
  };

  useEffect(() => {
    // Close menu on route change
    setIsOpen(false);
  }, [location.pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'Home' },
    { to: '/predict', icon: <Brain size={18} />, label: 'Predict' },
    { to: '/optimize', icon: <Zap size={18} />, label: 'Optimize' },
    { to: '/weather', icon: <CloudSun size={18} />, label: 'Weather' },
    { to: '/chat', icon: <MessageSquare size={18} />, label: 'Chat' },
    { to: '/dashboard', icon: <BarChart3 size={18} />, label: 'Stats' },
    { to: '/simulate', icon: <Layers size={18} />, label: 'Simulate' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'py-2 px-0' : 'py-6 px-0'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <motion.div 
          layout
          className={`glass-nav rounded-[2rem] border border-white/10 px-6 h-16 flex items-center justify-between transition-all duration-500 shadow-2xl relative z-[110]`}
        >
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <motion.div 
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-primary/20 rounded-xl border border-primary/20 relative z-10"
              >
                <Brain className="text-primary" size={20} />
              </motion.div>
              <div className="absolute inset-0 bg-primary/50 blur-xl opacity-20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-none">
                VERDANTIX
              </span>
              <div className="flex items-center gap-1.5 overflow-hidden">
                 <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                 <span className="text-[8px] font-black text-gray-500 tracking-[0.2em] uppercase">Neural Hub Active</span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  relative px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                       {React.cloneElement(item.icon, { size: 14 })}
                       {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
             <div className="h-4 w-px bg-white/10 mx-2" />
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={isOnline ? performSync : null}
               className={`group flex items-center gap-2 px-6 py-2 rounded-xl transition-all uppercase tracking-widest font-black text-[10px] shadow-2xl ${
                 !isOnline 
                 ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                 : isSyncing 
                 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                 : 'bg-primary text-black'
               }`}
             >
               <Activity size={12} className={isSyncing ? "animate-spin" : "group-hover:animate-pulse"} />
               {!isOnline ? 'OFFLINE MODE' : isSyncing ? 'SYNCING...' : 'LIVE SYNCED'}
               {pendingCount > 0 && (
                 <span className="ml-1 bg-white/20 px-1.5 rounded-full text-[8px]">{pendingCount}</span>
               )}
             </motion.button>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-400 hover:text-primary transition-all relative z-[120]"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Premium Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0a0f14] border-l border-white/10 z-[105] lg:hidden p-10 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-12">
                <div className="flex flex-col gap-2">
                   <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 w-fit">
                      <Brain size={32} className="text-primary" />
                   </div>
                   <h2 className="text-3xl font-black text-white tracking-widest uppercase italic">Verdantix</h2>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Neural Agri-Carbon Lab</p>
                </div>

                <div className="space-y-4">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => `
                          flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all
                          ${isActive 
                            ? 'bg-primary/20 text-primary border border-primary/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                           {item.icon}
                           {item.label}
                        </div>
                        <ArrowRight size={16} className={`${location.pathname === item.to ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-white/10 space-y-6">
                 <div className="flex items-center gap-4 text-gray-500">
                    <Shield size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Encrypted Link</span>
                 </div>
                 <button className="w-full py-5 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-primary/20">
                    Enter Protocol
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ArrowRight = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default Navbar;
