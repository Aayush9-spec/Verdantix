import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Spinner, AnimatedCounter } from '../components/common/UI';
import { 
  Brain, 
  Cloud, 
  Coins, 
  TrendingUp, 
  ShieldCheck as ShieldIcon, 
  MapPin, 
  Layers, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { apiFetch } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const Predict = () => {
  const [formData, setFormData] = useState({
    land: '',
    crop: 'rice',
    fertilizer: 'organic',
    water_source: 'irrigation',
    location: { lat: 20.59, lon: 78.96 }
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiFetch('/dashboard');
      setHistory(res.data.summary.history || []);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const steps = [
    "Establishing Neural Uplink...",
    "Analyzing Regional Weather Patterns...",
    "Computing Sequestration Potentials...",
    "Finalizing Insight Generation..."
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % steps.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/predict', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // Simulate real AI processing time for premium feel
      await new Promise(r => setTimeout(r, 1000));
      
      if (res.offline) {
        setError(res.message);
        setResult(null);
      } else {
        setResult(res.data);
        fetchHistory(); // Refresh history
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
      {/* Form Sidebar */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <Layers size={12} /> Intelligence Lab
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
            CARBON <br />
            <span className="text-primary">PREDICTOR</span>
          </h1>
          <p className="text-gray-400 font-medium leading-relaxed">
            Configure your agricultural parameters to simulate carbon sequestration potential using our grounded ML engine.
          </p>
        </div>

        <Card className="border-t-4 border-t-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Land Area (Acres)" 
              icon={<MapPin size={18} />}
              type="number" 
              required
              placeholder="e.g. 25"
              value={formData.land}
              onChange={(e) => setFormData({...formData, land: e.target.value})}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Crop Selection"
                icon={<Layers size={18} />}
                value={formData.crop}
                onChange={(e) => setFormData({...formData, crop: e.target.value})}
                options={[
                  { label: 'Rice (Paddy)', value: 'rice' },
                  { label: 'Wheat (Spring)', value: 'wheat' },
                  { label: 'Maize (Corn)', value: 'maize' },
                  { label: 'Soybean (Legume)', value: 'soybean' },
                ]}
              />
              <Select 
                label="Fertilizer Type"
                icon={<Sparkles size={18} />}
                value={formData.fertilizer}
                onChange={(e) => setFormData({...formData, fertilizer: e.target.value})}
                options={[
                  { label: 'Organic (Green)', value: 'organic' },
                  { label: 'Chemical (Std)', value: 'chemical' },
                ]}
              />
            </div>

            <Select 
              label="Water Management"
              icon={<Cloud size={18} />}
              value={formData.water_source}
              onChange={(e) => setFormData({...formData, water_source: e.target.value})}
              options={[
                { label: 'Rain-fed (Natural)', value: 'rain-fed' },
                { label: 'Irrigation (Controlled)', value: 'irrigation' },
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-white/5 border border-white/5">
              <Input 
                label="Latitude" 
                type="number" 
                step="0.01"
                value={formData.location.lat}
                onChange={(e) => setFormData({...formData, location: {...formData.location, lat: parseFloat(e.target.value)}})}
              />
              <Input 
                label="Longitude" 
                type="number" 
                step="0.01"
                value={formData.location.lon}
                onChange={(e) => setFormData({...formData, location: {...formData.location, lon: parseFloat(e.target.value)}})}
              />
            </div>

            <Button type="submit" className="w-full py-4 text-sm tracking-[0.2em] font-black uppercase" loading={loading}>
              Execute ML Logic
            </Button>
          </form>
        </Card>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-xs font-bold uppercase tracking-wider flex items-center gap-3"
          >
            <Info size={16} /> {error}
          </motion.div>
        )}
      </div>

      {/* Results Workspace */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-12 glass rounded-3xl"
            >
              <Spinner />
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-black uppercase tracking-[0.3em] text-primary mt-4"
              >
                {steps[loadingStep]}
              </motion.p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Score Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden ring-2 ring-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">CARBON EFFICIENCY</p>
                  <div className="text-7xl font-black text-white text-glow-primary">
                    {result.carbon_score.toFixed(1)}
                  </div>
                  <div className="w-full max-w-[150px] mt-6 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.carbon_score}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-primary h-full shadow-[0_0_15px_#10b981]"
                    />
                  </div>
                </div>

                <div className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden" 
                     style={{ borderTop: `4px solid ${result.grade_color}` }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">ENVIRONMENTAL GRADE</p>
                  <div className="text-8xl font-black italic select-none" style={{ color: result.grade_color }}>
                    {result.grade}
                  </div>
                  <div className="mt-4 px-4 py-1 rounded-full text-[10px] font-black tracking-widest text-white/50 border border-white/10 uppercase">
                    Protocol Verified
                  </div>
                </div>
              </div>

              {/* Economic Metrics */}
              <Card title="REVENUE INTELLIGENCE" icon={<Coins size={20} />} className="border-accent/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Projected Carbon Yield</p>
                    <p className="text-4xl font-black text-white">
                      ₹{result.estimated_value_inr.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-grow max-w-md w-full">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      <span>Market Benchmarking</span>
                      <span>{result.carbon_score.toFixed(1)}/100</span>
                    </div>
                    <div className="h-3 glass rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.carbon_score}%` }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Insights & Confidence */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <Card title="AI SEQUESTRATION INSIGHT" icon={<Brain size={20} />} className="h-full">
                    <p className="text-gray-300 font-medium leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
                      "{result.insight}"
                    </p>
                  </Card>
                </div>
                <div className="md:col-span-4">
                  <Card title="CONFIDENCE" icon={<ShieldIcon size={18} />} className="h-full flex flex-col justify-center items-center text-center">
                    <div className="relative h-24 w-24 flex items-center justify-center">
                       <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle cx="48" cy="48" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                         <motion.circle 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: result.ml_metadata.accuracy }}
                           transition={{ duration: 2 }}
                           cx="48" cy="48" r="40" fill="transparent" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
                       </svg>
                       <span className="text-xl font-black text-white">{(result.ml_metadata.accuracy * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4">Kaggle Verified</p>
                  </Card>
                </div>
              </div>

              {/* Weather Data */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-8 glass rounded-3xl border border-white/10">
                <div className="flex items-center gap-6">
                   <div className="p-4 glass rounded-2xl border border-primary/20">
                     <Cloud className={result.weather_used.rainfall > 100 ? "text-blue-400" : "text-yellow-400"} size={32} />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Weather Grounding</p>
                     <p className="text-xl font-black text-white uppercase italic">{result.weather_used.condition}</p>
                   </div>
                </div>
                <div className="flex gap-12">
                   {[
                     { l: 'Temp', v: result.weather_used.temperature, s: '°C' },
                     { l: 'Rain', v: result.weather_used.rainfall, s: 'mm' },
                     { l: 'Humidity', v: result.weather_used.humidity, s: '%' }
                   ].map(w => (
                     <div key={w.l}>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{w.l}</p>
                       <p className="text-lg font-black text-white">{w.v}{w.s}</p>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-16 glass rounded-[3rem] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="p-8 bg-white/5 rounded-[2rem] mb-6 relative">
                <Brain size={64} className="text-gray-700 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Neural Engine Offline</h3>
              <p className="text-xs font-bold text-gray-500 max-w-xs mx-auto mt-4 tracking-widest uppercase">
                Submit Agricultural Telemetry to Initialize Analysis
              </p>
              <div className="mt-8 flex gap-2">
                {[1,2,3].map(i => <div key={i} className="h-1 w-8 bg-white/5 rounded-full" />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History Table */}
      <div className="lg:col-span-12 mt-12 pb-20">
         <Card title="RECENT NEURAL TELEMETRY" icon={<Layers size={18} />}>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-white/5">
                        <th className="py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
                        <th className="py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Crop</th>
                        <th className="py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Land</th>
                        <th className="py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Score</th>
                        <th className="py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Value (INR)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {history.length > 0 ? history.slice().reverse().map((h) => (
                        <tr key={h.id} className="group hover:bg-white/5 transition-colors">
                           <td className="py-4 text-[10px] font-bold text-gray-400 font-mono">
                             {new Date(h.timestamp).toLocaleTimeString()}
                           </td>
                           <td className="py-4">
                              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                 {h.inputs.crop}
                              </span>
                           </td>
                           <td className="py-4 text-xs font-bold text-white tracking-widest">{h.inputs.land} AC</td>
                           <td className="py-4 text-xs font-bold text-primary italic">{h.results.carbon_score}</td>
                           <td className="py-4 text-xs font-bold text-white">₹{h.results.estimated_value_inr.toLocaleString()}</td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan="5" className="py-12 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                             No Telemetry Available
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default Predict;
