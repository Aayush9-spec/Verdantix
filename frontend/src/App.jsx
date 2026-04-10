import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import { Spinner } from './components/common/UI';
import { WifiOff } from 'lucide-react';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Predict = lazy(() => import('./pages/Predict'));
const Optimize = lazy(() => import('./pages/Optimize'));
const Weather = lazy(() => import('./pages/Weather'));
const Chat = lazy(() => import('./pages/Chat'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Simulate = lazy(() => import('./pages/Simulate'));

function AnimatedRoutes() {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('System Back Online—Syncing data...', {
        icon: '🔄',
        style: { background: '#090c10', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Network disconnected. Entering Offline Mode.', {
        icon: <WifiOff className="text-red-500" />,
        duration: Infinity,
        style: { background: '#090c10', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Suspense fallback={<Spinner />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulate" element={<Simulate />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }
        }}
      />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
