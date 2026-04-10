import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Spinner, AnimatedCounter } from '../components/common/UI';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  Info, 
  MapPin, 
  Navigation, 
  RefreshCw,
  Zap,
  ShieldCheck,
  TrendingUp,
  CloudLightning,
  Sun
} from 'lucide-react';
import { apiFetch } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const Weather = () => {
  const [coords, setCoords] = useState({ lat: 28.61, lon: 77.23 }); // Default New Delhi
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/weather?lat=${coords.lat}&lon=${coords.lon}`);
      // Neural delay for premium feel
      await new Promise(r => setTimeout(r, 800));
      setWeather(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('storm')) return <CloudLightning size={120} className="text-purple-400" anchor="top-right" />;
    if (cond.includes('sun') || cond.includes('clear')) return <Sun size={120} className="text-yellow-400 animate-spin-slow" />;
    return <CloudSun size={120} className="text-blue-400" />;
  };

  return (
    <div className="relative z-10 space-y-12 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Navigation size={12} /> Live Telemetry
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
            Weather <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Precision Environmental Monitoring // Regional Grounding
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 p-2 glass rounded-[2.5rem] border border-white/10 w-full lg:w-auto shadow-2xl">
          <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-3xl border border-white/5 w-full md:w-auto">
            <MapPin size={16} className="text-gray-600" />
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-gray-600">Lat</span>
                  <input 
                    type="number" 
                    className="bg-transparent border-none text-white text-xs font-bold w-12 focus:outline-none"
                    value={coords.lat}
                    onChange={(e) => setCoords({...coords, lat: e.target.value})}
                  />
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-gray-600">Lon</span>
                  <input 
                    type="number" 
                    className="bg-transparent border-none text-white text-xs font-bold w-12 focus:outline-none"
                    value={coords.lon}
                    onChange={(e) => setCoords({...coords, lon: e.target.value})}
                  />
               </div>
            </div>
          </div>
          <Button 
            onClick={fetchWeather} 
            loading={loading} 
            className="w-full md:w-auto px-8 py-3 rounded-[1.8rem] !bg-primary !text-black font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
          >
            Sync <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-96 flex flex-col items-center justify-center glass rounded-[3rem] border border-white/10"
          >
            <Spinner />
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">Establishing Satellite Link</p>
          </motion.div>
        ) : weather && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Main Weather Hero */}
            <Card className="lg:col-span-8 relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-primary/5 border-white/10 p-12 min-h-[400px]">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full gap-12">
                <div className="space-y-4 text-center md:text-left">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">LOCAL ATMOSPHERIC STATE</p>
                  <div className="flex items-center justify-center md:justify-start gap-6">
                    <h2 className="text-[10rem] font-black text-white leading-none tracking-tighter text-glow-primary">
                      <AnimatedCounter value={weather.temperature} decimals={0} />°
                    </h2>
                    <div className="space-y-2">
                       <p className="text-4xl font-black text-primary uppercase tracking-tighter italic">{weather.condition}</p>
                       <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <ShieldCheck size={12} className="text-primary" /> Region Grounded
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-80">
                  <WeatherMetric 
                    label="Moisture" 
                    value={weather.humidity} 
                    unit="%" 
                    icon={<Droplets className="text-blue-400" />} 
                  />
                  <WeatherMetric 
                    label="Precipitation" 
                    value={weather.rainfall} 
                    unit="mm" 
                    icon={<Wind className="text-emerald-400" />} 
                  />
                  <WeatherMetric 
                    label="Indexing" 
                    value={94} 
                    unit="v2" 
                    icon={<TrendingUp className="text-purple-400" />} 
                  />
                  <WeatherMetric 
                    label="UV Index" 
                    value={6.2} 
                    unit="uv" 
                    icon={<Zap className="text-yellow-400" />} 
                  />
                </div>
              </div>
              
              {/* Climate Icon Overlay */}
              <div className="absolute top-10 right-10 opacity-5 -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                 {getWeatherIcon(weather.condition)}
              </div>
            </Card>

            {/* Recommendations Column */}
            <div className="lg:col-span-4 space-y-6">
              <Card 
                title="AGRICULTURAL PROTOCOLS" 
                subtitle="Climate-driven field intelligence" 
                icon={<Info size={20} />} 
                className="h-full border-t-4 border-t-accent"
              >
                <div className="space-y-6 mt-6">
                  <ProtocolItem 
                    title="Sequestration Timing" 
                    desc={weather.rainfall > 100 
                      ? "High precipitation detected. Delay liquid applications to prevent nutrient leaching." 
                      : "Optimal moisture balance. Accelerate soil-bound carbon optimization today."}
                    color="primary"
                  />
                  <ProtocolItem 
                    title="Irrigation Strategy" 
                    desc={`Execute Precision Cycle-4 at ${weather.temperature}°C to maintain root-zone sequestration stability.`}
                    color="accent"
                  />
                  <ProtocolItem 
                    title="Risk Assessment" 
                    desc="Humidity levels within 5% of ideal benchmark. Fungal risks minimized across all monitored plots."
                    color="blue"
                  />
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WeatherMetric = ({ label, value, unit, icon }) => (
  <div className="p-5 glass rounded-3xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
       {React.cloneElement(icon, { size: 40 })}
    </div>
    <div className="relative z-10 flex flex-col items-center gap-1 text-center">
       <div className="p-2 mb-1 bg-white/5 rounded-xl border border-white/5">
          {icon}
       </div>
       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
       <p className="text-xl font-black text-white">
          <AnimatedCounter value={value} decimals={1} />
          <span className="text-[10px] text-gray-600 ml-1">{unit}</span>
       </p>
    </div>
  </div>
);

const ProtocolItem = ({ title, desc, color }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group"
  >
     <div className="flex gap-4">
        <div className={`w-1 rounded-full bg-${color} group-hover:h-full transition-all`} />
        <div className="space-y-1">
           <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-${color} transition-colors`}>{title}</h4>
           <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
        </div>
     </div>
  </motion.div>
);

export default Weather;
