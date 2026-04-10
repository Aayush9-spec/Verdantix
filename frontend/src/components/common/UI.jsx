import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Card = ({ children, title, subtitle, icon, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`glass-card p-6 relative overflow-hidden group ${className}`}
  >
    {/* Animated background reflection */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    
    {(title || icon) && (
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          {title && <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-3 bg-white/5 rounded-2xl text-primary border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>
    )}
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

export const Spinner = () => (
  <div className="flex flex-col justify-center items-center py-8 gap-3">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full"
    />
    <p className="text-sm font-medium text-primary/60 animate-pulse font-mono">AI THINKING...</p>
  </div>
);

export const Input = ({ label, icon, ...props }) => (
  <div className="space-y-2 group">
    {label && (
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">{icon}</div>}
      <input
        {...props}
        className={`w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 ${icon ? 'pl-11' : ''} text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-300 placeholder:text-gray-600 font-medium`}
      />
    </div>
  </div>
);

export const Select = ({ label, options, icon, ...props }) => (
  <div className="space-y-2 group">
    {label && (
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">{icon}</div>}
      <select
        {...props}
        className={`w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 ${icon ? 'pl-11' : ''} text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-300 font-medium appearance-none cursor-pointer`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#090c10] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export const Button = ({ children, variant = 'primary', className = '', loading, icon, ...props }) => {
  const variants = {
    primary: 'bg-primary text-black bg-glow-primary',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
    outline: 'border-2 border-primary/50 text-primary hover:bg-primary/10',
    ghost: 'hover:bg-white/5 text-gray-400 hover:text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      className={`relative overflow-hidden px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${variants[variant]} ${className}`}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full"
          />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            {children}
            {icon && icon}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
export const AnimatedCounter = ({ value, duration = 2, decimals = 1, prefix = '', suffix = '' }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = totalMiliseconds / (end * Math.pow(10, decimals));
    
    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += 1 / Math.pow(10, decimals);
      if (currentCount >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentCount);
      }
    }, incrementTime || 10);

    return () => clearInterval(timer);
  }, [value, duration, decimals]);

  return (
    <span>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};
