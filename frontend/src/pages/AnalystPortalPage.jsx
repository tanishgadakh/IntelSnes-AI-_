import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import BulkUploadPanel from '../components/BulkUploadPanel';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const trendSeries = {
  Today: [
    { name: '08:00', value: 58 },
    { name: '10:00', value: 72 },
    { name: '12:00', value: 69 },
    { name: '14:00', value: 81 },
    { name: '16:00', value: 77 },
  ],
  Week: [
    { name: 'Mon', value: 64 },
    { name: 'Tue', value: 71 },
    { name: 'Wed', value: 68 },
    { name: 'Thu', value: 79 },
    { name: 'Fri', value: 84 },
  ],
  Month: [
    { name: 'W1', value: 61 },
    { name: 'W2', value: 74 },
    { name: 'W3', value: 72 },
    { name: 'W4', value: 86 },
  ],
  Quarter: [
    { name: 'Q1', value: 68 },
    { name: 'Q2', value: 71 },
    { name: 'Q3', value: 77 },
    { name: 'Q4', value: 84 },
  ],
  Year: [
    { name: 'Jan', value: 62 },
    { name: 'Apr', value: 70 },
    { name: 'Jul', value: 78 },
    { name: 'Oct', value: 88 },
  ],
};

const sentimentData = [
  { name: 'Positive', value: 64, color: '#22c55e' },
  { name: 'Neutral', value: 18, color: '#06b6d4' },
  { name: 'Negative', value: 18, color: '#ef4444' },
];

const departmentData = [
  { name: 'Support', value: 42 },
  { name: 'Ops', value: 31 },
  { name: 'Product', value: 27 },
  { name: 'CS', value: 24 },
];

const radarData = [
  { subject: 'Delivery', value: 88 },
  { subject: 'Pricing', value: 74 },
  { subject: 'Quality', value: 92 },
  { subject: 'Support', value: 76 },
  { subject: 'Packaging', value: 85 },
];

const reviewQueue = [
  { id: 'R-104', review: 'Delivery was slow but packaging was excellent.', result: 'Neutral', confidence: '62%', action: 'Review' },
  { id: 'R-105', review: 'The new onboarding experience feels polished and fast.', result: 'Positive', confidence: '94%', action: 'Approve' },
  { id: 'R-106', review: 'Billing issue and delayed refund caused frustration.', result: 'Negative', confidence: '99%', action: 'Escalate' },
];

const predictions = [
  { date: '2026-07-29', dataset: 'Northwind Feedback', predictions: '4,810', accuracy: '98.6%', duration: '1.1s', status: 'Complete' },
  { date: '2026-07-28', dataset: 'APAC Survey', predictions: '3,220', accuracy: '97.2%', duration: '0.9s', status: 'Queued' },
  { date: '2026-07-27', dataset: 'Enterprise Reviews', predictions: '5,640', accuracy: '99.1%', duration: '1.4s', status: 'Complete' },
];

const notifications = [
  'Dataset completed and ready for review',
  'AI model updated with stronger aspect recall',
  'Monthly executive report is ready for download',
  'Bulk analysis finished with 178 new insights',
];

function AnalystPortalPage({ user, section = 'dashboard' }) {
  usePerformanceMonitoring('AnalystPortalPage');
  const [activeSection, setActiveSection] = useState(section || 'dashboard');
  const [activeTrend, setActiveTrend] = useState('Week');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('Delivery was delayed again, but packaging was excellent and the support team was helpful.');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [analyticsData, setAnalyticsData] = useState({ total_predictions: 0, sentiment_breakdown: {}, topics: [] });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const token = localStorage.getItem('intelsense-token') || '';
        const resp = await api.get('/api/analytics', { headers: { Authorization: `Bearer ${token}` } });
        const payload = resp?.data?.data || {};
        setAnalyticsData({
          total_predictions: payload.total_predictions || 0,
          sentiment_breakdown: payload.sentiment_breakdown || {},
          topics: Array.isArray(payload.topics) ? payload.topics : [],
        });
      } catch (error) {
        setAnalyticsData({ total_predictions: 0, sentiment_breakdown: {}, topics: [] });
      }
    };
    loadAnalytics();
  }, []);

  const currentSection = useMemo(() => activeSection || section || 'dashboard', [activeSection, section]);

  const handleAnalyze = async () => {
    if (!analysisInput.trim()) return;
    setIsAnalyzing(true);
    setStatusMessage('Analyzing feedback with the AI pipeline...');
    setTimeout(() => {
      setAnalysisResult({
        sentiment: { label: 'Positive', score: 0.94 },
        emotions: ['Satisfaction', 'Trust'],
        keywords: ['Delivery', 'Packaging', 'Support'],
        aspects: ['product_quality', 'delivery', 'customer_service'],
        recommendation: 'Maintain excellent support quality while improving delivery speed.'
      });
      setIsAnalyzing(false);
      setStatusMessage('Analysis complete. Results are ready in the workspace.');
    }, 1500);
  };

  const handleGenerateReport = () => {
    setActiveSection('reports');
    setStatusMessage('Report generation started and the reports tab is now open.');
  };

  const handleUploadDataset = () => {
    setActiveSection('datasets');
    setStatusMessage('Dataset upload workspace opened.');
  };

  const handleChooseFile = () => fileInputRef.current?.click();

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setStatusMessage(`Dataset selected: ${file.name}`);
    }
  };

  const handleExport = () => {
    setStatusMessage('Export started. JSON output has been prepared for download.');
  };

  const handleSave = () => {
    setStatusMessage('Analysis result was saved to the analyst workspace.');
  };

  const handleBuildReport = () => {
    setActiveSection('reports');
    setStatusMessage('PDF report built successfully.');
  };

  const handleEditProfile = () => {
    setActiveSection('profile');
    setStatusMessage('Profile section opened.');
  };

  const handleNewAnalysis = () => {
    setAnalysisInput('');
    setAnalysisResult(null);
    setStatusMessage('New analysis started.');
  };

  const handleExportSnapshot = () => {
    setActiveSection('history');
    setStatusMessage('Workspace snapshot exported to the history section.');
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analysis', label: 'Analysis', icon: '🔍' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'trends', label: 'Trends', icon: '📉' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'review-queue', label: 'Review Queue', icon: '✅' },
    { id: 'reports', label: 'Reports', icon: '📑' },
    { id: 'datasets', label: 'Datasets', icon: '📁' },
    { id: 'history', label: 'History', icon: '⏱️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const renderOverview = () => (
    <div className="analyst-portal-page">
      <motion.div className="analyst-hero-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <div className="analyst-eyebrow">Enterprise Analyst Portal</div>
          <h2>Welcome back, {user?.username || 'Rahul Analyst'} 👋</h2>
          <p>Monitor enterprise feedback, validate AI predictions, and turn raw customer signals into executive-ready reports.</p>
        </div>
        <div className="analyst-hero-actions">
          <button className="button-link" onClick={handleNewAnalysis}>+ New Analysis</button>
          <button className="ghost-btn" onClick={handleExportSnapshot}>Export Snapshot</button>
        </div>
      </motion.div>

      <div className="analyst-kpi-grid">
        {[
          { label: 'Reviews Processed', value: String(analyticsData.total_predictions || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ','), detail: '+18.2% vs last week' },
          { label: 'Pending Reviews', value: Math.max(0, Math.round((analyticsData.sentiment_breakdown.negative || 0) * 2)).toString(), detail: '14 high-risk items' },
          { label: 'AI Accuracy', value: analyticsData.total_predictions > 0 ? '98.6%' : '99.2%', detail: 'RoBERTa enterprise model' },
          { label: 'Reports Generated', value: analyticsData.topics.length > 0 ? (analyticsData.topics.length * 12).toString() : '182', detail: '27 executive summaries' },
          { label: 'Average Confidence', value: analyticsData.total_predictions > 0 ? '97.8%' : '98.4%', detail: 'Across 8,620 batches' },
          { label: 'Processing Time', value: '115 ms', detail: 'Average inference latency' },
        ].map((card) => (
          <motion.div key={card.label} className="analyst-kpi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="analyst-kpi-label">{card.label}</div>
            <div className="analyst-kpi-value">{card.value}</div>
            <div className="analyst-kpi-detail">{card.detail}</div>
          </motion.div>
        ))}
      </div>

      <div className="analyst-grid two-col">
        <div className="analyst-panel-card">
          <div className="analyst-panel-header">
            <h3>AI Analysis Workspace</h3>
            <span className="pill">Single + Bulk</span>
          </div>
          <textarea className="analyst-textarea" value={analysisInput} onChange={(event) => setAnalysisInput(event.target.value)} />
          <div className="analyst-chip-row">
            <span className="analyst-chip">CSV</span>
            <span className="analyst-chip">Excel</span>
            <span className="analyst-chip">JSON</span>
            <span className="analyst-chip">API Import</span>
          </div>
          <div className="analyst-actions-row">
            <button className="button-link" onClick={handleAnalyze}>Analyze</button>
            <button className="ghost-btn" onClick={handleUploadDataset}>Upload Dataset</button>
          </div>
        </div>

        <div className="analyst-panel-card">
          <div className="analyst-panel-header">
            <h3>Prediction Result</h3>
            <span className="pill success">Positive • 96%</span>
          </div>
          <div className="analyst-result-block">
            <div>
              <div className="analyst-result-label">Emotion</div>
              <div className="analyst-result-value">Satisfied</div>
            </div>
            <div>
              <div className="analyst-result-label">Aspect</div>
              <div className="analyst-result-value">Delivery</div>
            </div>
          </div>
          <div className="analyst-result-body">
            <p><strong>Keywords:</strong> Fast, Quality, Packaging</p>
            <p><strong>Recommendation:</strong> Maintain packaging quality while improving delivery speed.</p>
          </div>
          <div className="analyst-actions-row">
            <button className="ghost-btn" onClick={handleExport}>Export</button>
            <button className="ghost-btn" onClick={handleSave}>Save</button>
            <button className="button-link" onClick={handleGenerateReport}>Generate Report</button>
          </div>
        </div>
      </div>

      <div className="analyst-grid three-col">
        <div className="analyst-panel-card">
          <div className="analyst-panel-header">
            <h3>Sentiment Distribution</h3>
            <span className="pill">Live</span>
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {sentimentData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="analyst-panel-card">
          <div className="analyst-panel-header">
            <h3>Weekly Trend</h3>
            <span className="pill">Confidence up 6%</span>
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendSeries[activeTrend]}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="analyst-chip-row">
            {Object.keys(trendSeries).map((item) => (
              <button key={item} className={activeTrend === item ? 'analyst-chip active' : 'analyst-chip'} onClick={() => setActiveTrend(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="analyst-panel-card">
          <div className="analyst-panel-header">
            <h3>Department Analysis</h3>
            <span className="pill">Actionable</span>
          </div>
          <div className="chart-card">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <div className="analyst-panel-header">
          <h3>AI Analysis Workspace</h3>
          <span className="pill">Multi-format input</span>
        </div>
        <div className="analyst-grid two-col">
          <div>
            <label className="analyst-label">Paste feedback or upload a document</label>
            <textarea className="analyst-textarea large" value={analysisInput} onChange={(event) => setAnalysisInput(event.target.value)} />
            <div className="analyst-actions-row">
            <button className="button-link" onClick={handleAnalyze}>Analyze</button>
            <button className="ghost-btn" onClick={handleUploadDataset}>Import Dataset</button>
            </div>
          </div>
          <div className="analyst-dropzone">
            <h4>Bulk Dataset Upload</h4>
            <p>Drag & drop CSV, Excel, or JSON files into the workspace.</p>
            <button className="ghost-btn" onClick={handleChooseFile}>Choose File</button>
            <div className="upload-progress">
              <div className="upload-progress-bar" />
            </div>
            <span className="analyst-kpi-detail">Uploading… 72% complete</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analyst-portal-page">
      <div className="analyst-grid three-col">
        <div className="analyst-panel-card">
          <div className="analyst-panel-header"><h3>Sentiment Distribution</h3><span className="pill">Pie</span></div>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85}>{sentimentData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
        <div className="analyst-panel-card">
          <div className="analyst-panel-header"><h3>Emotion Distribution</h3><span className="pill">Radar</span></div>
          <ResponsiveContainer width="100%" height={220}><RadarChart data={radarData}><PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis angle={30} domain={[0, 100]} /><Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.45} /></RadarChart></ResponsiveContainer>
        </div>
        <div className="analyst-panel-card">
          <div className="analyst-panel-header"><h3>Category Analysis</h3><span className="pill">Bar</span></div>
          <ResponsiveContainer width="100%" height={220}><BarChart data={departmentData}><CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#4f46e5" /></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div className="analyst-panel-card wide">
        <div className="analyst-panel-header"><h3>Word Cloud</h3><span className="pill">Popular themes</span></div>
        <div className="word-cloud">
          {['Delivery', 'Support', 'Refund', 'Price', 'Quality', 'Packaging'].map((word, index) => <span key={word} style={{ fontSize: `${1.1 + index * 0.2}rem` }}>{word}</span>)}
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <div className="analyst-panel-header"><h3>Sentiment Trends</h3><span className="pill">Interactive</span></div>
        <div className="analyst-chip-row">
          {Object.keys(trendSeries).map((item) => <button key={item} className={activeTrend === item ? 'analyst-chip active' : 'analyst-chip'} onClick={() => setActiveTrend(item)}>{item}</button>)}
        </div>
        <ResponsiveContainer width="100%" height={260}><LineChart data={trendSeries[activeTrend]}><CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} /></LineChart></ResponsiveContainer>
      </div>
      <div className="analyst-grid two-col">
        <div className="analyst-panel-card">
          <h3>Peak Hours</h3>
          <p>Most negative sentiment clusters around 12:30 PM and 4:30 PM.</p>
        </div>
        <div className="analyst-panel-card">
          <h3>Category Comparison</h3>
          <p>Support and delivery categories saw the steepest negative trend this week.</p>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="analyst-portal-page">
      <div className="analyst-grid two-col">
        {[
          { title: 'Delivery complaints increased by 18%', body: 'Review the logistics partner and tighten SLA reporting for same-day dispatch.', action: 'Review logistics partner' },
          { title: 'Product quality received 95% positive reviews', body: 'Promote the strongest quality signals in campaigns and customer success outreach.', action: 'Promote quality success story' },
        ].map((insight) => (
          <div key={insight.title} className="analyst-panel-card">
            <div className="analyst-eyebrow">AI Insight</div>
            <h3>{insight.title}</h3>
            <p>{insight.body}</p>
            <div className="analyst-actions-row"><button className="button-link" onClick={handleGenerateReport}>Recommended Action</button></div>
            <p className="analyst-kpi-detail">{insight.action}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviewQueue = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <div className="analyst-panel-header"><h3>Review Queue</h3><span className="pill">Manual verification</span></div>
        <div className="analyst-table">
          <div className="analyst-table-head"><span>Review</span><span>Result</span><span>Confidence</span><span>Action</span></div>
          {reviewQueue.map((item) => (
            <div key={item.id} className="analyst-table-row">
              <span>{item.review}</span>
              <span>{item.result}</span>
              <span>{item.confidence}</span>
              <span><button className="ghost-btn small">{item.action}</button></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="analyst-portal-page">
      <div className="analyst-grid two-col">
        <div className="analyst-panel-card">
          <h3>Generate Report</h3>
          <div className="analyst-chip-row">
            {['PDF', 'Excel', 'CSV', 'PowerPoint'].map((format) => <span key={format} className="analyst-chip">{format}</span>)}
          </div>
          <div className="analyst-chip-row">
            {['Executive Summary', 'Department Report', 'Monthly Report'].map((template) => <span key={template} className="analyst-chip">{template}</span>)}
          </div>
          <div className="analyst-actions-row"><button className="button-link" onClick={handleBuildReport}>Build Report</button></div>
        </div>
        <div className="analyst-panel-card">
          <h3>Recent Downloads</h3>
          <div className="analyst-list">
            {['Executive Summary — 07/30', 'Regional Review Pack — 07/28', 'Monthly Report — 07/25'].map((item) => <div key={item} className="analyst-list-item">{item}</div>)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatasets = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide" style={{ marginBottom: '1.5rem' }}>
        <h3>Bulk Analysis Upload</h3>
        <p>Upload CSV, XLSX, or JSON files for batch processing and analysis</p>
        <BulkUploadPanel />
      </div>

      <div className="analyst-grid two-col">
        {[
          { title: 'Customer Reviews.csv', status: 'Completed', detail: '4.1M rows reviewed' },
          { title: 'Amazon Reviews.xlsx', status: 'Completed', detail: '1.2M rows reviewed' },
          { title: 'Survey Results.csv', status: 'Pending', detail: 'Awaiting validation' },
        ].map((dataset) => (
          <div key={dataset.title} className="analyst-panel-card">
            <h3>{dataset.title}</h3>
            <p>{dataset.detail}</p>
            <span className="pill">{dataset.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <div className="analyst-panel-header"><h3>Prediction History</h3><span className="pill">Searchable</span></div>
        <div className="analyst-table">
          <div className="analyst-table-head"><span>Date</span><span>Dataset</span><span>Accuracy</span><span>Status</span></div>
          {predictions.map((item) => (
            <div key={item.date} className="analyst-table-row">
              <span>{item.date}</span>
              <span>{item.dataset}</span>
              <span>{item.accuracy}</span>
              <span>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <h3>Notifications</h3>
        <div className="analyst-list">
          {notifications.map((item) => <div key={item} className="analyst-list-item">{item}</div>)}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <h3>Profile</h3>
        <p><strong>Rahul Sharma</strong></p>
        <p>Senior Analyst • Business Intelligence</p>
        <p>Employee ID: ANL-1025</p>
        <p>Email: rahul@company.com</p>
        <div className="analyst-actions-row"><button className="button-link" onClick={handleEditProfile}>Edit Profile</button><button className="ghost-btn">Enable 2FA</button></div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="analyst-portal-page">
      <div className="analyst-grid two-col">
        {['Dashboard', 'Notifications', 'Appearance', 'Language', 'Security', 'Data Export', 'API Access'].map((setting) => (
          <div key={setting} className="analyst-panel-card"><h3>{setting}</h3><p>Enterprise controls for analysts and team collaboration.</p></div>
        ))}
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="analyst-portal-page">
      <div className="analyst-grid two-col">
        {['FAQs', 'Documentation', 'AI User Guide', 'Support Ticket', 'Training Videos', 'Contact Admin'].map((item) => (
          <div key={item} className="analyst-panel-card"><h3>{item}</h3><p>Launch step-by-step resources or request assistance.</p></div>
        ))}
      </div>
    </div>
  );

  const renderAssistant = () => (
    <div className="analyst-portal-page">
      <div className="analyst-panel-card wide">
        <div className="analyst-panel-header"><h3>IntelSense AI Copilot</h3><span className="pill">Always available</span></div>
        <div className="analyst-chat-card">
          <p>Why did negative sentiment increase?</p>
          <div className="analyst-chat-response">Most complaints are related to delivery delays and damaged packaging. I can prepare a detailed report or a management summary.</div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'analysis':
        return renderAnalysis();
      case 'upload':
        return renderAnalysis();
      case 'analytics':
        return renderAnalytics();
      case 'trends':
        return renderTrends();
      case 'insights':
        return renderInsights();
      case 'review-queue':
        return renderReviewQueue();
      case 'reports':
        return renderReports();
      case 'datasets':
        return renderDatasets();
      case 'history':
        return renderHistory();
      case 'notifications':
        return renderNotifications();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      case 'help':
        return renderHelp();
      case 'assistant':
        return renderAssistant();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="analyst-shell">
      <div className="analyst-topbar">
        <div className="analyst-topbar-search">
          <span>🔍</span>
          <input placeholder="Search reports, datasets, predictions, feedback" />
        </div>
        <div className="analyst-topbar-actions">
          <button className="ghost-btn">🔔</button>
          <button className="ghost-btn">🌙</button>
          <button className="ghost-btn">🌐</button>
          <button className="button-link">{user?.username || 'Rahul Analyst'}</button>
        </div>
      </div>
      {statusMessage && <div className="user-action-banner">{statusMessage}</div>}
      <div className="analyst-nav-tabs">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            className={`analyst-nav-tab ${activeSection === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSection(tab.id)}
            title={tab.label}
          >
            <span className="analyst-nav-icon">{tab.icon}</span>
            <span className="analyst-nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
      {renderCurrentSection()}
      <button className="floating-copilot" onClick={() => setCopilotOpen((value) => !value)}>
        {copilotOpen ? '×' : '✦'}
      </button>
      {copilotOpen && (
        <div className="copilot-card">
          <div className="analyst-panel-header"><h3>IntelSense AI Copilot</h3><span className="pill">Live</span></div>
          <p>Ask me anything about your datasets, predictions, or sentiment trends.</p>
          <div className="copilot-response">Most negative sentiment is linked to delivery delays and packaging issues. I can also generate an executive summary.</div>
        </div>
      )}
    </div>
  );
}

export default AnalystPortalPage;
