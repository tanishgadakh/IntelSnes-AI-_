import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const predictionTrend = [
  { name: 'Mon', value: 115000 },
  { name: 'Tue', value: 122000 },
  { name: 'Wed', value: 128000 },
  { name: 'Thu', value: 142000 },
  { name: 'Fri', value: 152340 },
];

const activeUsers = [
  { name: 'Mon', value: 8420 },
  { name: 'Tue', value: 8930 },
  { name: 'Wed', value: 9100 },
  { name: 'Thu', value: 9480 },
  { name: 'Fri', value: 9820 },
];

const subscriptionData = [
  { name: 'Free', value: 26, color: '#06b6d4' },
  { name: 'Professional', value: 54, color: '#4f46e5' },
  { name: 'Enterprise', value: 20, color: '#8b5cf6' },
];

const requests = [
  { name: 'Rahul Sharma', organization: 'ABC Technologies', experience: '3 years', status: 'Pending' },
  { name: 'Priya Singh', organization: 'XYZ Pvt', experience: '5 years', status: 'Pending' },
];

const auditLogs = [
  { time: '10:30', user: 'Admin', action: 'Approved Analyst', module: 'Users', status: 'Success' },
  { time: '10:45', user: 'Analyst', action: 'Generated Report', module: 'Reports', status: 'Success' },
  { time: '11:02', user: 'Admin', action: 'Blocked IP', module: 'Security', status: 'Warning' },
];

function AdminPortalPage({ user, section = 'dashboard' }) {
  const [activeView, setActiveView] = useState('dashboard');
  const currentSection = useMemo(() => section || activeView, [section, activeView]);

  const renderOverview = () => (
    <div className="admin-portal-page">
      <motion.div className="admin-hero-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <div className="admin-eyebrow">Enterprise Control Center</div>
          <h2>Welcome Administrator 👋</h2>
          <p>Monitor the platform, approve analysts, control subscriptions, and keep AI services operating at enterprise scale.</p>
        </div>
        <div className="admin-hero-actions">
          <button className="button-link">Create Analyst</button>
          <button className="ghost-btn">Export Snapshot</button>
        </div>
      </motion.div>

      <div className="admin-kpi-grid">
        {[
          { label: 'Total Customers', value: '12,845', detail: '+8.2% this month' },
          { label: 'Active Analysts', value: '156', detail: 'Across 278 organizations' },
          { label: 'Pending Requests', value: '18', detail: 'Needs review' },
          { label: 'AI Predictions Today', value: '152,340', detail: 'Across all tenants' },
          { label: 'Platform Uptime', value: '99.98%', detail: 'SLA protected' },
          { label: 'Active Organizations', value: '278', detail: 'Global footprint' },
        ].map((card) => (
          <motion.div key={card.label} className="admin-kpi-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="admin-kpi-label">{card.label}</div>
            <div className="admin-kpi-value">{card.value}</div>
            <div className="admin-kpi-detail">{card.detail}</div>
          </motion.div>
        ))}
      </div>

      <div className="admin-grid two-col">
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Pending Analyst Requests</h3><span className="pill">Core approval center</span></div>
          <div className="admin-table">
            <div className="admin-table-head"><span>Name</span><span>Organization</span><span>Status</span><span>Action</span></div>
            {requests.map((request) => (
              <div key={request.name} className="admin-table-row">
                <span>{request.name}</span>
                <span>{request.organization}</span>
                <span>{request.status}</span>
                <span><button className="ghost-btn small">View</button></span>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Approval Details</h3><span className="pill success">Rahul Sharma</span></div>
          <p><strong>Experience:</strong> 3 Years</p>
          <p><strong>Education:</strong> M.Tech AI</p>
          <p><strong>Organization:</strong> ABC Technologies</p>
          <p><strong>Documents:</strong> Resume, ID Proof, Certificates</p>
          <div className="admin-actions-row">
            <button className="button-link">Approve</button>
            <button className="ghost-btn">Reject</button>
            <button className="ghost-btn">Request Info</button>
          </div>
        </div>
      </div>

      <div className="admin-grid three-col">
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>AI Service Monitoring</h3><span className="pill">Healthy</span></div>
          <div className="admin-list">
            {['RoBERTa Model', 'Emotion Model', 'Aspect Model', 'Recommendation Engine'].map((item) => <div key={item} className="admin-list-item">{item} • Online</div>)}
          </div>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Platform Analytics</h3><span className="pill">Live</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={predictionTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Security Overview</h3><span className="pill">24 alerts</span></div>
          <p>Failed login attempts: 24</p>
          <p>Blocked accounts: 6</p>
          <p>Suspicious activity: 2</p>
          <p>JWT status: Healthy</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-portal-page">
      <div className="admin-panel-card wide">
        <div className="admin-panel-header"><h3>User Management</h3><span className="pill">Customers • Analysts • Admins</span></div>
        <div className="admin-table">
          <div className="admin-table-head"><span>Name</span><span>Organization</span><span>Plan</span><span>Status</span><span>Actions</span></div>
          {['Alex Morgan', 'Neha Rao', 'Drew Chen'].map((name) => (
            <div key={name} className="admin-table-row">
              <span>{name}</span>
              <span>Northwind Labs</span>
              <span>Enterprise</span>
              <span>Active</span>
              <span><button className="ghost-btn small">Edit</button></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="admin-portal-page">
      <div className="admin-panel-card wide">
        <div className="admin-panel-header"><h3>Analyst Approval Center</h3><span className="pill">Workflow</span></div>
        <div className="admin-table">
          <div className="admin-table-head"><span>Name</span><span>Organization</span><span>Experience</span><span>Status</span><span>Action</span></div>
          {requests.map((request) => (
            <div key={request.name} className="admin-table-row">
              <span>{request.name}</span>
              <span>{request.organization}</span>
              <span>{request.experience}</span>
              <span>{request.status}</span>
              <span><button className="ghost-btn small">Review</button></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="admin-portal-page">
      <div className="admin-grid three-col">
        {[
          { name: 'Free Plan', features: ['100 predictions', 'Basic sentiment', 'Email support'], price: '$0' },
          { name: 'Professional', features: ['1000 predictions', 'Emotion detection', 'Reports', 'CSV upload'], price: '$49' },
          { name: 'Enterprise', features: ['Unlimited predictions', 'API access', 'SLA', 'Dedicated support'], price: '$199' },
        ].map((plan) => (
          <div key={plan.name} className="admin-panel-card">
            <h3>{plan.name}</h3>
            <div className="admin-kpi-value">{plan.price}</div>
            <ul>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <div className="admin-actions-row"><button className="button-link">Save</button></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="admin-portal-page">
      <div className="admin-grid two-col">
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Model Health</h3><span className="pill">RoBERTa</span></div>
          <div className="admin-list">
            {['RoBERTa Enterprise — Online', 'Emotion Model — Healthy', 'Aspect Model — Healthy', 'Recommendation Engine — Healthy'].map((item) => <div key={item} className="admin-list-item">{item}</div>)}
          </div>
          <div className="admin-actions-row"><button className="ghost-btn">Reload Model</button><button className="ghost-btn">Restart Service</button></div>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Model Performance</h3><span className="pill">Latency</span></div>
          <ResponsiveContainer width="100%" height={220}><BarChart data={[{ name: 'API', value: 98 }, { name: 'Inference', value: 112 }, { name: 'DB', value: 84 }]}><CartesianGrid stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#06b6d4" /></BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="admin-portal-page">
      <div className="admin-grid three-col">
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Daily Predictions</h3><span className="pill">Line</span></div>
          <ResponsiveContainer width="100%" height={220}><LineChart data={predictionTrend}><CartesianGrid stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line dataKey="value" stroke="#22c55e" strokeWidth={3} /></LineChart></ResponsiveContainer>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Active Users</h3><span className="pill">Bar</span></div>
          <ResponsiveContainer width="100%" height={220}><BarChart data={activeUsers}><CartesianGrid stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#4f46e5" /></BarChart></ResponsiveContainer>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Subscription Distribution</h3><span className="pill">Pie</span></div>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={subscriptionData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>{subscriptionData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
      </div>
      <div className="admin-grid two-col">
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>User Growth</h3><span className="pill">Area</span></div>
          <ResponsiveContainer width="100%" height={220}><AreaChart data={activeUsers}><CartesianGrid stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} /></AreaChart></ResponsiveContainer>
        </div>
        <div className="admin-panel-card">
          <div className="admin-panel-header"><h3>Server Load</h3><span className="pill">Gauge</span></div>
          <ResponsiveContainer width="100%" height={220}><LineChart data={[{ name: 'Load', value: 74 }]}><Line dataKey="value" stroke="#f59e0b" /></LineChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="admin-portal-page">
      <div className="admin-grid two-col">
        {['Platform Report', 'Revenue Report', 'AI Usage Report', 'Subscription Report', 'Security Report', 'Monthly Report'].map((report) => (
          <div key={report} className="admin-panel-card"><h3>{report}</h3><p>Generate and download in PDF, Excel, or CSV.</p></div>
        ))}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="admin-portal-page">
      <div className="admin-grid two-col">
        {[
          { title: 'Failed Login Attempts', value: '24' },
          { title: 'Blocked Accounts', value: '6' },
          { title: 'Suspicious Activity', value: '2' },
          { title: 'JWT Status', value: 'Healthy' },
        ].map((item) => <div key={item.title} className="admin-panel-card"><h3>{item.title}</h3><div className="admin-kpi-value">{item.value}</div></div>)}
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="admin-portal-page">
      <div className="admin-panel-card wide">
        <div className="admin-panel-header"><h3>Audit Logs</h3><span className="pill">Searchable</span></div>
        <div className="admin-table">
          <div className="admin-table-head"><span>Time</span><span>User</span><span>Action</span><span>Module</span><span>Status</span></div>
          {auditLogs.map((item) => <div key={`${item.time}-${item.action}`} className="admin-table-row"><span>{item.time}</span><span>{item.user}</span><span>{item.action}</span><span>{item.module}</span><span>{item.status}</span></div>)}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-portal-page">
      <div className="admin-grid two-col">
        {['General', 'Security', 'Authentication', 'Email', 'AI Configuration', 'Storage', 'Database', 'Backup', 'API Keys'].map((section) => <div key={section} className="admin-panel-card"><h3>{section}</h3><p>Configure enterprise-wide controls and policies.</p></div>)}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="admin-portal-page">
      <div className="admin-panel-card wide">
        <h3>My Profile</h3>
        <p><strong>Admin Name:</strong> Super Administrator</p>
        <p><strong>Role:</strong> System Admin</p>
        <p><strong>Email:</strong> admin@intelsense.ai</p>
        <p><strong>Last Login:</strong> Today</p>
        <div className="admin-actions-row"><button className="button-link">Edit Profile</button><button className="ghost-btn">Enable MFA</button></div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="admin-portal-page">
      <div className="admin-grid two-col">
        {['Admin Guide', 'Platform Documentation', 'AI Configuration Guide', 'Deployment Manual', 'Contact Technical Support'].map((item) => <div key={item} className="admin-panel-card"><h3>{item}</h3><p>Access operational manuals and support resources.</p></div>)}
      </div>
    </div>
  );

  const renderAssistant = () => (
    <div className="admin-portal-page">
      <div className="admin-panel-card wide">
        <div className="admin-panel-header"><h3>IntelSense Admin Copilot</h3><span className="pill">Always available</span></div>
        <div className="admin-chat-card">
          <p>Why did prediction volume drop today?</p>
          <div className="admin-chat-response">Prediction requests are down by 14% compared to yesterday. The largest decrease came from Organization ABC due to reduced customer activity. No AI service issues were detected.</div>
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'users':
        return renderUsers();
      case 'requests':
        return renderRequests();
      case 'plans':
        return renderPlans();
      case 'ai':
        return renderAI();
      case 'analytics':
        return renderAnalytics();
      case 'reports':
        return renderReports();
      case 'security':
        return renderSecurity();
      case 'logs':
        return renderLogs();
      case 'settings':
        return renderSettings();
      case 'profile':
        return renderProfile();
      case 'help':
        return renderHelp();
      case 'assistant':
        return renderAssistant();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="admin-topbar-search">
          <span>🔍</span>
          <input placeholder="Search users, analysts, reports, AI logs, audit records" />
        </div>
        <div className="admin-topbar-actions">
          <button className="ghost-btn">🔔</button>
          <button className="ghost-btn">🌙</button>
          <button className="ghost-btn">🌐</button>
          <button className="button-link">{user?.username || 'Super Admin'}</button>
        </div>
      </div>
      {renderCurrentSection()}
      <button className="floating-copilot admin-float">✦</button>
    </div>
  );
}

export default AdminPortalPage;
