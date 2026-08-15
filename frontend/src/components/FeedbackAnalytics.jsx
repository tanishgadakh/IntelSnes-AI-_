import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { MessageCircle, TrendingUp, Target } from 'lucide-react';
import api from '../api/client';
import { SkeletonChart } from './LoadingSkeleton';
import { showToast } from './ToastNotification';
import './FeedbackAnalytics.css';

export default function FeedbackAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData = {
          feedbackTrend: [
            { week: 'Week 1', positive: 320, neutral: 130, negative: 80 },
            { week: 'Week 2', positive: 290, neutral: 200, negative: 60 },
            { week: 'Week 3', positive: 410, neutral: 150, negative: 90 },
            { week: 'Week 4', positive: 500, neutral: 120, negative: 70 },
          ],
          sentimentDistribution: [
            { name: 'Product Quality', positive: 85, neutral: 50, negative: 15 },
            { name: 'Customer Service', positive: 70, neutral: 60, negative: 20 },
            { name: 'Delivery Speed', positive: 60, neutral: 80, negative: 30 },
            { name: 'Pricing', positive: 45, neutral: 70, negative: 50 },
            { name: 'Features', positive: 75, neutral: 55, negative: 25 },
          ],
          feedbackQuality: [
            { metric: 'Relevance', value: 92 },
            { metric: 'Clarity', value: 88 },
            { metric: 'Completeness', value: 85 },
            { metric: 'Usefulness', value: 90 },
            { metric: 'Timeliness', value: 87 },
          ],
          engagementMetrics: [
            { category: 'Responses', value: 450, avgScore: 4.2 },
            { category: 'Mentions', value: 320, avgScore: 3.8 },
            { category: 'Shares', value: 180, avgScore: 4.5 },
            { category: 'Comments', value: 210, avgScore: 3.9 },
          ],
        };
        setData(mockData);
      } catch (error) {
        showToast.error('Failed to load feedback analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackData();
  }, []);

  if (loading) return <SkeletonChart />;
  if (!data) return <div className="feedback-empty">No feedback data available</div>;

  return (
    <div className="feedback-analytics">
      <h2>Feedback Analytics</h2>

      <div className="feedback-grid">
        {/* Feedback Trend */}
        <div className="chart-container">
          <div className="chart-header">
            <TrendingUp size={20} />
            <h3>Feedback Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.feedbackTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" stackId="a" fill="#4ade80" />
              <Bar dataKey="neutral" stackId="a" fill="#facc15" />
              <Bar dataKey="negative" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment by Category */}
        <div className="chart-container">
          <div className="chart-header">
            <MessageCircle size={20} />
            <h3>Sentiment by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.sentimentDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="positive" fill="#4ade80" />
              <Bar dataKey="neutral" fill="#facc15" />
              <Bar dataKey="negative" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Quality Radar */}
        <div className="chart-container">
          <div className="chart-header">
            <Target size={20} />
            <h3>Quality Metrics</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.feedbackQuality}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Metrics */}
        <div className="chart-container">
          <div className="chart-header">
            <TrendingUp size={20} />
            <h3>Engagement Metrics</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="value" name="Count" />
              <YAxis type="number" dataKey="avgScore" name="Avg Score" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Engagement" data={data.engagementMetrics} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="feedback-summary">
        <div className="summary-card">
          <h4>Total Feedback</h4>
          <p className="summary-value">2,145</p>
          <span className="summary-stat">↑ 23% from last month</span>
        </div>
        <div className="summary-card">
          <h4>Avg. Sentiment Score</h4>
          <p className="summary-value">7.8/10</p>
          <span className="summary-stat">↑ Improving trend</span>
        </div>
        <div className="summary-card">
          <h4>Response Rate</h4>
          <p className="summary-value">84%</p>
          <span className="summary-stat">Excellent engagement</span>
        </div>
        <div className="summary-card">
          <h4>Top Topic</h4>
          <p className="summary-value">Quality</p>
          <span className="summary-stat">342 mentions</span>
        </div>
      </div>

      {/* Top Feedback */}
      <div className="top-feedback">
        <h3>Recent Feedback Highlights</h3>
        <div className="feedback-list">
          <div className="feedback-item positive">
            <div className="feedback-header">
              <span className="feedback-badge positive">Positive</span>
              <span className="feedback-date">2 hours ago</span>
            </div>
            <p className="feedback-text">"Excellent product quality and fast shipping. Highly satisfied!"</p>
            <div className="feedback-footer">
              <span className="emotion-badge">joy</span>
              <span className="emotion-badge">satisfaction</span>
            </div>
          </div>

          <div className="feedback-item neutral">
            <div className="feedback-header">
              <span className="feedback-badge neutral">Neutral</span>
              <span className="feedback-date">4 hours ago</span>
            </div>
            <p className="feedback-text">"Product is okay, but could use better instructions."</p>
            <div className="feedback-footer">
              <span className="emotion-badge">mild-feedback</span>
            </div>
          </div>

          <div className="feedback-item negative">
            <div className="feedback-header">
              <span className="feedback-badge negative">Negative</span>
              <span className="feedback-date">6 hours ago</span>
            </div>
            <p className="feedback-text">"Packaging was damaged and customer service was unhelpful."</p>
            <div className="feedback-footer">
              <span className="emotion-badge">frustration</span>
              <span className="emotion-badge">disappointment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
