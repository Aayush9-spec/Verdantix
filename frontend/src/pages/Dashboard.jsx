import React, { useState, useEffect } from 'react';
import { Card, Spinner, AnimatedCounter } from '../components/common/UI';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Sprout, 
  Globe, 
  Sparkles,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { apiFetch } from '../api/api';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const trendData = [
    { name: 'JAN', credits: 45 },
    { name: 'FEB', credits: 52 },
    { name: 'MAR', credits: 48 },
    { name: 'APR', credits: 61 },
    { name: 'MAY', credits: 55 },
    { name: 'JUN', credits: 67 },
    { name: 'JUL', credits: 72 },
    { name: 'AUG', credits: 68 },
    { name: 'SEP', credits: 82 },
    { name: 'OCT', credits: 91 },
    { name: 'NOV', credits: 88 },
    { name: 'DEC', credits: 95 },
  ];

  const distributionData = [
    { name: 'Rice', value: 400, color: '#10b981' },
    { name: 'Wheat', value: 300, color: '#3b82f6' },
    { name: 'Maize', value: 200, color: '#f59e0b' },
    { name: 'Other', value: 100, color: '#6366f1' },
  ];

  if (loading) return <Spinner />;

  return (
    <div className="relative z-10 space-y-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 glass rounded-[2rem] border border-primary/20 bg-primary/5 text-primary">
            <BarChart3 size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
              CARBON <span className="text-primary tracking-tighter">ANALYTICS</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
              Neural Network Telemetry // Real-Time Sequestration Data
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="px-6 py-2 glass rounded-2xl border border-white/5 text-center">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Rank</p>
             <p className="text-xl font-black text-white italic">#1,402</p>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem 
          title="Total Sequestration" 
          value={data?.summary?.total_credits || 1240.5} 
          unit="CO2e" 
          icon={<Globe className="text-blue-400" />} 
          trend="+12.4% PERFORMANCE"
          delay={0}
        />
        <StatItem 
          title="Efficiency Index" 
          value={data?.summary?.avg_score || 84.2} 
          unit="/ 100" 
          icon={<TrendingUp className="text-primary" />} 
          trend="TOP 5% REGIONAL"
          delay={0.1}
        />
        <StatItem 
          title="Telemetry Plots" 
          value={12} 
          unit="ACTIVE" 
          icon={<Target className="text-accent" />} 
          trend="MONITORING ACTIVE"
          delay={0.2}
        />
        <StatItem 
          title="Market Liquidity" 
          value={"₹4.2k"} 
          unit="INR/AC" 
          icon={<Sparkles className="text-purple-400" />} 
          trend="PRICE SURGE +4%"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Trend Chart */}
        <div className="lg:col-span-8">
          <Card 
            title="CREDIT ACCUMULATION TELEMETRY" 
            subtitle="12-Month Sequestration performance mapping" 
            icon={<TrendingUp size={18} />}
            className="h-full"
          >
            <div className="h-[350px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#090c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="credits" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorCredits)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Secondary Charts Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="CROP ALPHA DIST." icon={<Sprout size={18} />} className="h-full">
            <div className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#090c10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                 {distributionData.map(d => (
                   <div key={d.name} className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{d.name}</span>
                   </div>
                 ))}
              </div>
            </div>
          </Card>

          <Card title="REGIONAL BENCHMARK" icon={<Globe size={18} />}>
            <div className="space-y-6 pt-4">
              <BenchmarkRow label="Soil Intelligence" value={82} avg={65} />
              <BenchmarkRow label="Bio-Sequestration" value={91} avg={72} />
              <BenchmarkRow label="Optimization Index" value={76} avg={58} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ title, value, unit, icon, trend, delay }) => (
  <Card className="relative overflow-hidden group border-b-4 border-b-transparent hover:border-b-primary" delay={delay}>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-white">
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </span>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{unit}</span>
        </div>
      </div>
      <div className="p-3 glass rounded-2xl border border-white/5 text-primary group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
    </div>
    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
      <span className="text-[10px] text-primary font-black tracking-widest uppercase italic">{trend}</span>
      <ArrowUpRight size={14} className="text-gray-700" />
    </div>
    {/* Animated Corner Reflection */}
    <div className="absolute -top-12 -right-12 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
  </Card>
);

const BenchmarkRow = ({ label, value, avg }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
      <span className="text-xs font-black text-primary italic underline underline-offset-4">{value}%</span>
    </div>
    <div className="relative h-2 w-full glass rounded-full overflow-hidden p-0.5 border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute top-0.5 left-0.5 h-[calc(100%-4px)] bg-gradient-to-r from-emerald-600 to-primary rounded-full z-10 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
      />
      <div className="absolute top-0.5 left-0.5 h-[calc(100%-4px)] bg-white/10 rounded-full" style={{ width: `${avg}%` }} />
    </div>
  </div>
);

export default Dashboard;
