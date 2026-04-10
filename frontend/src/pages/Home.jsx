import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  CloudSun, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';
import { Card, Button } from '../components/common/UI';
import { apiFetch } from '../api/api';

const Star = ({ className }) => (
  <motion.svg 
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    viewBox="0 0 24 24" 
    className={className}
    fill="#00ff88"
  >
    <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" />
  </motion.svg>
);

const Home = () => {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const { scrollY } = useScroll();
  
  // Parallax: 0.5x speed
  const bgY = useTransform(scrollY, [0, 1000], [0, 500]);
  
  // Scroll Fade/Scale: opacity 1->0 and scale 1->0.96 over 400px scroll
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.96]);

  useEffect(() => {
    apiFetch('/health').then(setHealth).catch(console.error);
  }, []);

  const features = [
    { title: 'ML Prediction', icon: <Brain />, path: '/predict', desc: 'Predict carbon credits with high-accuracy Kaggle-grounded ML models.' },
    { title: 'AI Optimization', icon: <Zap />, path: '/optimize', desc: 'Find the best practices to maximize your carbon sequestration.' },
    { title: 'Weather Grid', icon: <CloudSun />, path: '/weather', desc: 'Real-time environmental data visualization and alerts.' },
    { title: 'Carbon Chat', icon: <MessageSquare />, path: '/chat', desc: 'Multilingual AI assistant for smart agricultural finance.' },
  ];

  const titleWordsLine1 = ["PRECISION"];
  const titleWordsLine2 = ["AGRI-CARBON"];

  return (
    <div className="relative z-10 space-y-24 py-16">
      {/* Hero Section Container */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden -mt-32 pt-32">
        {/* Decorative Corner Stars (Abs. positioned relative to section) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Star className="absolute top-20 left-[10%] w-8 h-8 opacity-30" />
          <Star className="absolute top-40 right-[15%] w-6 h-6 opacity-30" />
          <Star className="absolute bottom-40 left-[15%] w-6 h-6 opacity-30" />
          <Star className="absolute bottom-20 right-[10%] w-8 h-8 opacity-30" />
        </div>

        {/* Hero Content Block */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-20 text-center space-y-8 max-w-5xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl glass border border-primary/20 text-primary text-xs font-black tracking-[0.2em] uppercase"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#10b981]"
            />
            {health?.data?.status === 'running' ? 'PROTOCOL ACTIVE // SYSTEM READY' : 'ESTABLISHING CORE LINK...'}
          </motion.div>
          
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-white overflow-hidden">
              <div className="flex justify-center flex-wrap">
                {titleWordsLine1.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.15 * i + 0.4, 
                      duration: 1.2, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="flex justify-center flex-wrap mt-2">
                <span className="bg-gradient-to-r from-primary via-green-400 to-emerald-600 bg-clip-text text-transparent text-glow-primary">
                  {titleWordsLine2.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.15 * (i + titleWordsLine1.length) + 0.4, 
                        duration: 1.2, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </div>
            </h1>
            
            {/* Decorative Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-5 pointer-events-none select-none">
              <h2 className="text-[15vw] font-black italic">VERDANTIX</h2>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Empowering sustainable agriculture through advanced ML intelligence. 
            Measure, optimize, and monetize carbon sequestration with scientific precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="flex flex-wrap justify-center gap-6 pt-10"
          >
            <Button 
              onClick={() => navigate('/predict')} 
              className="px-10 py-5 text-sm uppercase tracking-widest shadow-2xl"
              icon={<ArrowRight size={18} />}
            >
              Launch Intelligence
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/dashboard')} 
              className="px-10 py-5 text-sm uppercase tracking-widest"
            >
              Analytics Dashboard
            </Button>
          </motion.div>

          {/* Floating Stat Pills */}
          <div className="flex flex-wrap justify-center gap-8 pt-10">
            {[
              { label: 'Precision', val: '99.8%', icon: <Sparkles size={14} /> },
              { label: 'Processing', val: '< 200ms', icon: <TrendingUp size={14} /> },
              { label: 'Coverage', val: 'GLOBAL', icon: <Globe size={14} /> }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 + (i * 0.1) + 0.3 }}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500"
              >
                <span className="text-primary">{stat.icon}</span>
                <span>{stat.label}:</span>
                <span className="text-white">{stat.val}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((f, i) => (
          <Card 
            key={f.title}
            title={f.title} 
            icon={f.icon} 
            delay={i * 0.1}
            className="cursor-pointer group"
            onClick={() => navigate(f.path)}
          >
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{f.desc}</p>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center text-primary text-[10px] font-black uppercase tracking-[0.2em] group-hover:opacity-100 transition-all"
            >
              Access Protocol <ArrowRight size={12} className="ml-2" />
            </motion.div>
          </Card>
        ))}
      </section>

      {/* Trust Badge Section */}
      <section className="pt-12 flex flex-col items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <p className="text-[10px] font-bold tracking-[0.4em] text-gray-500 uppercase">
          Powered by Cutting-Edge ML & Environmental Data
        </p>
        <div className="flex flex-wrap justify-center gap-12 items-center">
          <div className="flex items-center gap-2 font-black text-xl italic text-white/50">NASA DATA</div>
          <div className="flex items-center gap-2 font-black text-xl italic text-white/50">KAGGE-GND</div>
          <div className="flex items-center gap-2 font-black text-xl italic text-white/50">FAO ORG</div>
          <div className="flex items-center gap-2 font-black text-xl italic text-white/50">WMO INT</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
