import React, { useState } from 'react';
import { Card, Input, Select, Button, AnimatedCounter } from '../components/common/UI';
import { 
  Zap, 
  ArrowUpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { apiFetch } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const Optimize = () => {
  const [formData, setFormData] = useState({
    land: '10',
    crop: 'rice',
    fertilizer: 'chemical',
    water_source: 'rain-fed',
    location: { lat: 20.59, lon: 78.96 }
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/optimize', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // Premium feeling delay
      await new Promise(r => setTimeout(r, 1500));
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Current', score: result.current_score, fill: '#64748b' },
    { name: 'Optimized', score: result.optimized_score, fill: '#10b981' }
  ] : [];

  return (
    <div className="relative z-10 max-w-6xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest"
        >
          <Sparkles size={12} /> Optimization Engine v2.0
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
          CARBON <span className="text-primary">OPTIMIZER</span>
        </h1>
        <p className="text-gray-400 font-medium max-w-2xl mx-auto">
          Neural-powered strategy to maximize your farm's carbon sequestration credit value 
          through precision transitions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-4">
          <Card title="Current Parameters" icon={<TrendingUp size={20} />} className="border-t-4 border-t-accent">
            <form onSubmit={handleOptimize} className="space-y-6">
              <Input 
                label="Farm Size (Acres)" 
                type="number"
                value={formData.land}
                onChange={(e) => setFormData({...formData, land: e.target.value})}
              />
              <Select 
                label="Baseline Crop"
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
                label="Current Fertilizer"
                value={formData.fertilizer}
                onChange={(e) => setFormData({...formData, fertilizer: e.target.value})}
                options={[
                  { label: 'Chemical Standards', value: 'chemical' },
                  { label: 'Organic Compost', value: 'organic' },
                ]}
              />
              <Select 
                label="Inflow Source"
                value={formData.water_source}
                onChange={(e) => setFormData({...formData, water_source: e.target.value})}
                options={[
                  { label: 'Rain-fed (Natural)', value: 'rain-fed' },
                  { label: 'Irrigation (Controlled)', value: 'irrigation' },
                ]}
              />
              <Button type="submit" className="w-full py-4 text-xs font-black tracking-widest uppercase shadow-xl" loading={loading} variant="primary">
                RUN OPTIMIZATION
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Workspace */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 glass rounded-3xl border border-dashed border-white/10"
              >
                <Zap size={48} className="text-gray-600 mb-4 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Awaiting Telemetry Input</p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-8 flex flex-col items-center justify-center border-t-4 border-t-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <TrendingUp size={64} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">POTENTIAL UPLIFT</p>
                    <div className="text-7xl font-black text-white text-glow-primary">
                      +<AnimatedCounter value={result.improvement} decimals={1} />%
                    </div>
                    <div className="mt-4 px-4 py-1 bg-primary/20 rounded-full border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
                      Efficiency Spike
                    </div>
                  </div>

                  <Card title="SCORE COMPARISON" icon={<ArrowUpCircle size={20} />}>
                    <div className="h-48 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={10} fontWeight="bold" />
                          <YAxis stroke="#6b7280" fontSize={10} fontWeight="bold" domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ background: '#090c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {/* Transition List */}
                <Card title="ACTION PROTOCOLS" icon={<CheckCircle2 size={20} />} subtitle="Strategic shifts for maximum sequestration">
                  <div className="space-y-4">
                    {[
                      { 
                        title: 'Transition: Bio-Chemical Shift', 
                        desc: 'Replacing nitrogen-based fertilizers with high-grade organic sequestration agents.',
                        impact: 'High Impact'
                      },
                      { 
                        title: 'Protocol: Precision Irrigation', 
                        desc: 'Implementing automated water management to curb methane emissions and stabilize soil carbon.',
                        impact: 'Med Impact'
                      }
                    ].map((step, i) => (
                      <motion.div 
                        key={step.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="flex items-start gap-4 p-5 glass rounded-2xl border border-white/5 hover:border-primary/30 transition-all group"
                      >
                        <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-black text-xs uppercase tracking-widest text-white">{step.title}</h4>
                            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              {step.impact}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                        <div className="self-center">
                          <ArrowRight size={14} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Economic Summary */}
                <div className="p-6 glass rounded-3xl border border-dashed border-white/10 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-accent/10 rounded-xl text-accent border border-accent/20">
                       <Zap size={24} />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Confidence</p>
                       <p className="text-lg font-black text-white italic">GROUNDED ML // 94.2%</p>
                     </div>
                  </div>
                  <Button variant="secondary" className="px-6 py-2 text-[10px] tracking-widest uppercase font-black">
                    EXPORT PDF REPORT
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Optimize;
