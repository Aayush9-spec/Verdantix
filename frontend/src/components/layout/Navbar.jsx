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
  Menu,
  X,
  Sparkles,
  Shield,
  Activity,
  ArrowRight
} from 'lucide-react';
import { 
  SignedIn, 
  SignedOut, 
  UserButton,
  SignInButton,
  useUser
} from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { syncOfflineData } from '../../api/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check pending count
    const checkPending = () => {
      const pending = JSON.parse(localStorage.getItem('pending') || '[]');
      setPendingCount(pending.length);
    };
    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const performSync = async () => {
    if (isSyncing || !isOnline) return;
    setIsSyncing(true);
    try {
      const success = await syncOfflineData();
      if (success) {
        toast.success('Intelligence Grid Synced', {
          style: { background: '#090c10', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }
        });
        setPendingCount(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'Home' },
    { to: '/predict', icon: <Brain size={18} />, label: 'Predict' },
    { to: '/optimize', icon: <Zap size={18} />, label: 'Optimize' },
    { to: '/weather', icon: <CloudSun size={18} />, label: 'Weather' },
    { to: '/chat', icon: <MessageSquare size={18} />, label: 'Chat' },
    { to: '/dashboard', icon: <BarChart3 size={18} />, label: 'Stats' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'py-2 px-4' : 'py-6 px-8'
    }`}>
      <div className="max-w-7xl mx-auto">
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
             
             <SignedOut>
               <SignInButton mode="modal">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-6 py-2 glass-card text-white font-black text-[10px] rounded-xl border border-white/10 hover:border-primary/50 transition-all uppercase tracking-widest"
                 >
                   Sign In
                 </motion.button>
               </SignInButton>
             </SignedOut>

             <SignedIn>
                <div className="flex items-center gap-4">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "h-9 w-9 border-2 border-primary/30",
                        userButtonPopoverCard: "glass border border-white/10 shadow-2xl overflow-hidden",
                      }
                    }}
                  />
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
             </SignedIn>
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden"
            />
            
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
                 
                 <SignedOut>
                   <SignInButton mode="modal">
                     <button className="w-full py-5 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-primary/20">
                        Sign In
                     </button>
                   </SignInButton>
                 </SignedOut>

                 <SignedIn>
                   <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/10">
                        <UserButton />
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase text-gray-400">Operator</span>
                           <span className="text-sm font-black text-white truncate max-w-[150px]">{user?.firstName || 'User'}</span>
                        </div>
                     </div>
                     <button className="w-full py-5 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-primary/20">
                        Enter Protocol
                     </button>
                   </div>
                 </SignedIn>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
