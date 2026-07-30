import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Mon', sentiment: 72, confidence: 88 },
  { name: 'Tue', sentiment: 76, confidence: 90 },
  { name: 'Wed', sentiment: 81, confidence: 92 },
  { name: 'Thu', sentiment: 78, confidence: 89 },
  { name: 'Fri', sentiment: 85, confidence: 94 },
  { name: 'Sat', sentiment: 88, confidence: 95 },
  { name: 'Sun', sentiment: 91, confidence: 97 }
];

export default function ChartPanel() {
  return (
    <div className="chart-card wide">
      <h3>Weekly sentiment performance</h3>
      <div className="chart-area">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="sentiment" stroke="#60a5fa" fill="url(#sentiment)" />
          </AreaChart>
        </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
