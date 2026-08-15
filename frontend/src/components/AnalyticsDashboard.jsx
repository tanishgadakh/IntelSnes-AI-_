import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import api from '../api/client';
import { SkeletonChart } from './LoadingSkeleton';
import { showToast } from './ToastNotification';
import './AnalyticsDashboard.css';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = {
          sentimentTrend: [
            { date: 'Mon', positive: 4000, neutral: 2400, negative: 1200 },
            { date: 'Tue', positive: 3000, neutral: 1398, negative: 2210 },
            { date: 'Wed', positive: 2000, neutral: 9800, negative: 2290 },
            { date: 'Thu', positive: 2780, neutral: 3908, negative: 2000 },
            { date: 'Fri', positive: 1890, neutral: 4800, negative: 2181 },
            { date: 'Sat', positive: 2390, neutral: 3800, negative: 2500 },
            { date: 'Sun', positive: 3490, neutral: 4300, negative: 2100 },
          ],
          emotionBreakdown: [
            { name: 'Joy', value: 35, color: '#FFD700' },
            { name: 'Anger', value: 20, color: '#FF6B6B' },
            { name: 'Sadness', value: 15, color: '#4ECDC4' },
            { name: 'Surprise', value: 18, color: '#95E1D3' },
            { name: 'Fear', value: 12, color: '#6C5CE7' },
          ],
          topicDistribution: [
            { topic: 'Product Quality', count: 245 },
            { topic: 'Customer Service', count: 198 },
            { topic: 'Pricing', count: 156 },
            { topic: 'Delivery', count: 132 },
            { topic: 'Features', count: 98 },
          ],
          accuracyTrend: [
            { date: 'Week 1', accuracy: 92.5 },
            { date: 'Week 2', accuracy: 93.2 },
            { date: 'Week 3', accuracy: 94.1 },
            { date: 'Week 4', accuracy: 94.8 },
          ],
        };
        setData(mockData);
      } catch (error) {
        showToast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <div className="analytics-grid"><SkeletonChart /></div>;

  if (!data) return <div className="analytics-empty">No analytics data available</div>;

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Real-Time Analytics</h2>
        <div className="time-range-selector">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              className={`time-range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-grid">
        {/* Sentiment Trend */}
        <div className="chart-container">
          <div className="chart-header">
            <TrendingUp size={20} />
            <h3>Sentiment Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.sentimentTrend}>
              <defs>
                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPositive)" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#8884d8" fillOpacity={1} fill="#8884d8" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#ffc658" fillOpacity={1} fill="url(#colorNegative)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Emotion Breakdown */}
        <div className="chart-container">
          <div className="chart-header">
            <PieChartIcon size={20} />
            <h3>Emotion Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.emotionBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.emotionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Topic Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <BarChart3 size={20} />
            <h3>Topic Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topicDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy Trend */}
        <div className="chart-container">
          <div className="chart-header">
            <Activity size={20} />
            <h3>Model Accuracy</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[90, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#82ca9d"
                dot={{ fill: '#82ca9d', r: 6 }}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="analytics-summary">
        <div className="stat-card">
          <h4>Total Predictions</h4>
          <p className="stat-value">2,485</p>
          <span className="stat-change positive">↑ 12.5% this week</span>
        </div>
        <div className="stat-card">
          <h4>Avg. Sentiment</h4>
          <p className="stat-value">68%</p>
          <span className="stat-change positive">↑ 3.2% improvement</span>
        </div>
        <div className="stat-card">
          <h4>Model Accuracy</h4>
          <p className="stat-value">94.8%</p>
          <span className="stat-change positive">↑ Best performance</span>
        </div>
        <div className="stat-card">
          <h4>User Engagement</h4>
          <p className="stat-value">3.2K</p>
          <span className="stat-change positive">↑ 28% increase</span>
        </div>
      </div>
    </div>
  );
}
