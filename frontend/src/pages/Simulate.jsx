import React, { useState } from 'react';
import { Card, Input, Select, Button, AnimatedCounter } from '../components/common/UI';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Play, 
  Sparkles, 
  FlaskConical, 
  ArrowRight,
  Calculator,
  Save,
  Trash
} from 'lucide-react';
import { apiFetch } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const Simulate = () => {
  const [scenarios, setScenarios] = useState([
    { id: 1, land: '10', crop: 'rice', fertilizer: 'chemical', water_source: 'rain-fed' }
  ]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const addScenario = () => {
    setScenarios([...scenarios, { 
      id: Date.now(), 
      land: '10', 
      crop: 'wheat', 
      fertilizer: 'organic', 
      water_source: 'irrigation' 
    }]);
  };

  const removeScenario = (id) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const updateScenario = (id, field, value) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/simulate', {
        method: 'POST',
        body: JSON.stringify({ scenarios })
      });
      // Neural delay for premium feel
      await new Promise(r => setTimeout(r, 1500));
      setResults(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 space-y-12 py-8">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
          >
            <FlaskConical size={12} /> Simulation Protocol
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
            Comparison <span className="text-primary italic">Lab</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Execute multi-scalar configurations // Neural Sequestration Analysis
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={addScenario}
             className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:text-white transition-all shadow-xl"
           >
             <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Add Scenario
           </button>
           <button 
             onClick={runSimulation}
             disabled={loading}
             className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all"
           >
             {loading ? <span className="animate-spin"><FlaskConical size={14} /></span> : <><Play size={14} /> Run Neural Engine</>}
           </button>
        </div>
      </div>

      {/* Scenarios Table */}
      <Card className="p-0 border-white/10 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-3xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Magnitude (Ac)</th>
                <th className="px-8 py-6">Crop Domain</th>
                <th className="px-8 py-6">Input Matrix</th>
                <th className="px-8 py-6">Hydration</th>
                <th className="px-8 py-6 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {scenarios.map((s, index) => (
                  <motion.tr 
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                    className="group hover:bg-primary/[0.03] transition-colors"
                  >
                    <td className="px-8 py-6">
                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-gray-500">
                         {index + 1}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative group/input">
                        <input 
                          type="number" 
                          value={s.land}
                          onChange={(e) => updateScenario(s.id, 'land', e.target.value)}
                          className="bg-white/5 border-2 border-transparent group-hover/input:border-white/10 focus:border-primary/40 focus:bg-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold w-full transition-all outline-none"
                        />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <select 
                        value={s.crop}
                        onChange={(e) => updateScenario(s.id, 'crop', e.target.value)}
                        className="bg-white/5 border-2 border-transparent hover:border-white/10 focus:border-primary/40 rounded-xl px-4 py-3 text-white text-sm font-bold w-full outline-none appearance-none transition-all cursor-pointer"
                       >
                         <option value="rice" className="bg-[#0b1016]">Rice (Paddy)</option>
                         <option value="wheat" className="bg-[#0b1016]">Wheat</option>
                         <option value="maize" className="bg-[#0b1016]">Maize</option>
                         <option value="soybean" className="bg-[#0b1016]">Soybean</option>
                       </select>
                    </td>
                    <td className="px-8 py-6">
                       <select 
                        value={s.fertilizer}
                        onChange={(e) => updateScenario(s.id, 'fertilizer', e.target.value)}
                        className="bg-white/5 border-2 border-transparent hover:border-white/10 focus:border-primary/40 rounded-xl px-4 py-3 text-white text-sm font-bold w-full outline-none appearance-none transition-all cursor-pointer"
                       >
                         <option value="organic" className="bg-[#0b1016]">Organic (G-4)</option>
                         <option value="chemical" className="bg-[#0b1016]">Synthesis-X</option>
                       </select>
                    </td>
                    <td className="px-8 py-6">
                       <select 
                        value={s.water_source}
                        onChange={(e) => updateScenario(s.id, 'water_source', e.target.value)}
                        className="bg-white/5 border-2 border-transparent hover:border-white/10 focus:border-primary/40 rounded-xl px-4 py-3 text-white text-sm font-bold w-full outline-none appearance-none transition-all cursor-pointer"
                       >
                         <option value="irrigation" className="bg-[#0b1016]">Controlled</option>
                         <option value="rain-fed" className="bg-[#0b1016]">Atmos-Dependent</option>
                       </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => removeScenario(s.id)}
                        className="p-3 text-gray-700 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Decommission Scenario"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Matrix Output Results</p>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((res) => (
                <motion.div
                  key={res.scenario_id}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <Card className="p-8 border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all overflow-hidden">
                    {/* Glowing background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Scenario #{res.scenario_id}</span>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          res.grade === 'A' ? 'bg-primary/20 text-primary' :
                          res.grade === 'B' ? 'bg-amber-400/20 text-amber-400' :
                          'bg-red-400/20 text-red-400'
                        }`}>
                          Grade {res.grade}
                        </div>
                      </div>

                      <div className="flex items-end gap-1">
                        <span className="text-6xl font-black text-white tracking-tighter leading-none">
                          <AnimatedCounter value={res.score} decimals={1} />
                        </span>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Index</span>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-wider">
                          <span>Sequestration</span>
                          <span className="text-primary">{res.score}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${res.score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" 
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Simulate;
