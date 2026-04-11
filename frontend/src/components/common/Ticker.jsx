import React from 'react';
import { motion } from 'framer-motion';

const Ticker = ({ items = [] }) => {
  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-y border-white/5 py-2 overflow-hidden flex whitespace-nowrap">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex gap-12 items-center px-6"
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="flex items-center gap-4 group">
            <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
              {item.label}
            </span>
            <span className="text-xs font-mono text-primary font-bold">
              {item.value}
            </span>
            {item.change && (
              <span className={`text-[10px] ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {item.change}
              </span>
            )}
            <div className="h-4 w-[1px] bg-white/10 ml-8" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ticker;
