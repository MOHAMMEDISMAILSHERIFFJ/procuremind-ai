// src/App.jsx
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KpiCards } from './components/dashboard/KpiCards';
import ProcureMindScene from './components/3d/ProcureMindScene';
import ProcureMindBackground3D from './components/3d/ProcureMindBackground3D';
import { AiInsights } from './components/dashboard/AiInsights';
import { SpendingChart } from './components/dashboard/SpendingChart';
import { RecentProcurement } from './components/dashboard/RecentProcurement';
import { PriorityActions } from './components/dashboard/PriorityActions';
import { ProductMessage } from './components/dashboard/ProductMessage';
import { ProcureMindAgentBar } from './components/dashboard/ProcureMindAgentBar';
import { ProcureMindAgentPanel } from './components/dashboard/ProcureMindAgentPanel';
import { LoadDemoData } from './components/dashboard/LoadDemoData';
import {
  ProcurementModule,
  AiAnalysisModule,
  VendorsModule,
  SubscriptionsModule,
  DecisionsModule,
} from './components/modules/ModuleViews';
import { SettingsIcon, HelpIcon } from './components/icons/Icons';
import './styles/dashboard.css';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard layout — shows only when authenticated
// ─────────────────────────────────────────────────────────────────────────────

function DashboardView({ onNavigateToTab }) {
  const { userData } = useAuth();
  const [demoLoaded, setDemoLoaded] = useState(false);

  // Only show "Load Demo Data" panel when the account has zero procurement data
  const hasNoData =
    !userData ||
    ((!userData.procurements || userData.procurements.length === 0) &&
      (!userData.vendors || userData.vendors.length === 0));

  return (
    <main className="dashboard-content" id="main-content">
      {/* KPI Cards — live from user data */}
      <KpiCards onNavigateToTab={onNavigateToTab} />

      {/* ── Empty State / Demo Data Offer ─────────────────────────────── */}
      {hasNoData && !demoLoaded && (
        <LoadDemoData onDataLoaded={() => setDemoLoaded(true)} />
      )}

      {/* ── Autonomous AI Procurement Agent Input Bar ──────────────────── */}
      <ProcureMindAgentBar />

      {/* ── Autonomous Agent Activity & Recommendation Panel ────────────── */}
      <ProcureMindAgentPanel onNavigateToDecisions={() => onNavigateToTab && onNavigateToTab('decisions')} />

      {/* 3D Intelligence Core — live from user data and agent state */}
      <ProcureMindScene />

      {/* AI Insights — live from user data */}
      <AiInsights onNavigateToAnalysis={(ins) => onNavigateToTab && onNavigateToTab('ai-analysis', { insightId: ins?.id })} />

      {/* Spending Overview & Priority Actions */}
      <div className="dashboard-mid-grid">
        <SpendingChart />
        <PriorityActions onNavigateToTab={onNavigateToTab} />
      </div>

      {/* Recent Procurement Requisitions */}
      <RecentProcurement onNavigateToProcurement={() => onNavigateToTab && onNavigateToTab('procurement')} />

      {/* Product Message */}
      <ProductMessage />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings view — shows logged-in user profile details
// ─────────────────────────────────────────────────────────────────────────────

function SettingsView() {
  const { currentUser } = useAuth();
  return (
    <main className="dashboard-content">
      <div className="card" style={{ padding: '36px' }}>
        <div className="card-header-main" style={{ marginBottom: '16px' }}>
          <div className="card-header-icon chart-icon-wrapper">
            <SettingsIcon size={22} />
          </div>
          <div>
            <h3 className="card-title">Enterprise Account Settings</h3>
            <p className="card-subtitle">{currentUser?.companyName} Workspace</p>
          </div>
        </div>
        <div className="settings-profile-grid">
          <div className="settings-field">
            <span className="settings-label">Full Name</span>
            <span className="settings-value">{currentUser?.fullName}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Username</span>
            <span className="settings-value">@{currentUser?.username}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Work Email</span>
            <span className="settings-value">{currentUser?.email}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Company / Entity</span>
            <span className="settings-value">{currentUser?.companyName}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Designation / Role</span>
            <span className="settings-value">{currentUser?.jobRole}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Department</span>
            <span className="settings-value">{currentUser?.department}</span>
          </div>
          <div className="settings-field" style={{ gridColumn: '1 / -1' }}>
            <span className="settings-label">Company Description</span>
            <span className="settings-value">{currentUser?.companyDescription || '—'}</span>
          </div>
          <div className="settings-field" style={{ gridColumn: '1 / -1' }}>
            <span className="settings-label">Procurement Scope</span>
            <span className="settings-value">{currentUser?.procurementTypes || currentUser?.workDescription || '—'}</span>
          </div>
        </div>

        {/* API Configuration Info for Future Real AI */}
        <div style={{ marginTop: 24, padding: '16px 20px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: 13.5, color: '#0F172A', fontWeight: 700 }}>
            ProcureMind AI Integration Endpoint
          </h4>
          <p style={{ margin: '0 0 10px', fontSize: 12.5, color: '#64748B' }}>
            When connecting your team&rsquo;s custom AI model, configure environment variables in <code>.env</code>:
          </p>
          <pre style={{ margin: 0, padding: '10px 14px', background: '#0F172A', color: '#60A5FA', borderRadius: 6, fontSize: 12, overflowX: 'auto' }}>
            VITE_AI_API_ENDPOINT=https://your-model-api.com/v1{'\n'}
            VITE_AI_API_KEY=your-secret-api-key
          </pre>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Help view — shows getting started tips
// ─────────────────────────────────────────────────────────────────────────────

function HelpView() {
  const { currentUser } = useAuth();
  return (
    <main className="dashboard-content">
      <div className="card" style={{ padding: '36px' }}>
        <div className="card-header-main" style={{ marginBottom: '16px' }}>
          <div className="card-header-icon priority-icon-wrapper">
            <HelpIcon size={22} />
          </div>
          <div>
            <h3 className="card-title">ProcureMind Help & Support</h3>
            <p className="card-subtitle">Autonomous AI Procurement Intelligence Platform</p>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.8 }}>
          <strong>Autonomous Procurement Workflow:</strong>
          <ol style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Ask ProcureMind on the dashboard: e.g. <em>&ldquo;50 laptops for engineering&rdquo;</em>.</li>
            <li>The agent automatically structures requirements, checks vendor history, and calculates rate card benchmarks.</li>
            <li>If price anomalies or savings opportunities are detected, a Decision record is automatically created for executive review.</li>
            <li>Dashboard metrics, risk alerts, and savings counters update in real time.</li>
          </ol>
          <br />
          <strong>Demo Data:</strong>
          <br />
          Use the &ldquo;Load Demo Procurement Data&rdquo; panel on the dashboard to explore the platform
          with realistic NovaTech Industries data.
          <br /><br />
          <strong>Support:</strong>
          <br />
          For {currentUser?.companyName} workspace issues, contact{' '}
          <a href="mailto:support@procuremind.ai" style={{ color: '#2563EB' }}>
            support@procuremind.ai
          </a>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main App Shell — routes between auth views and dashboard
// ─────────────────────────────────────────────────────────────────────────────

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInsightId, setSelectedInsightId] = useState(null);

  const handleNavigate = (tab, context = {}) => {
    setActiveTab(tab);
    if (context.insightId) {
      setSelectedInsightId(context.insightId);
    }
  };

  // ── Not authenticated → show Login or Register ───────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="app-viewport-container">
        <ProcureMindBackground3D />
        <div className="app-foreground-layer">
          {authView === 'register' ? (
            <Register
              onNavigateToLogin={() => setAuthView('login')}
              onRegistrationSuccess={() => {
                setAuthView('login');
                setActiveTab('dashboard');
              }}
            />
          ) : (
            <Login
              onNavigateToRegister={() => setAuthView('register')}
              onLoginSuccess={() => setActiveTab('dashboard')}
            />
          )}
        </div>
      </div>
    );
  }

  // ── Authenticated → show dashboard shell with sidebar ────────────────────
  const renderView = () => {
    switch (activeTab) {
      case 'procurement':    return <ProcurementModule onNavigateToTab={handleNavigate} />;
      case 'ai-analysis':   return <AiAnalysisModule initialInsightId={selectedInsightId} onClearInitialInsight={() => setSelectedInsightId(null)} onNavigateToTab={handleNavigate} />;
      case 'vendors':       return <VendorsModule onNavigateToTab={handleNavigate} />;
      case 'subscriptions': return <SubscriptionsModule onNavigateToTab={handleNavigate} />;
      case 'decisions':     return <DecisionsModule onNavigateToTab={handleNavigate} />;
      case 'settings':      return <SettingsView />;
      case 'help':          return <HelpView />;
      case 'dashboard':
      default:              return <DashboardView onNavigateToTab={handleNavigate} />;
    }
  };

  return (
    <div className="app-viewport-container">
      <ProcureMindBackground3D />
      <div className="app-layout app-foreground-layer">
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => handleNavigate(tab)} />
        <div className="main-wrapper">
          <Header onNavigateToTab={handleNavigate} />
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}