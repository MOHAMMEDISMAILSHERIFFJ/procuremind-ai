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
import { AiInsights } from './components/dashboard/AiInsights';
import { SpendingChart } from './components/dashboard/SpendingChart';
import { RecentProcurement } from './components/dashboard/RecentProcurement';
import { PriorityActions } from './components/dashboard/PriorityActions';
import { ProductMessage } from './components/dashboard/ProductMessage';
import { AiActivityFeed } from './components/dashboard/AiActivityFeed';
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

function DashboardView() {
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
      <KpiCards />

      {/* ── Empty State / Demo Data Offer ─────────────────────────────── */}
      {hasNoData && !demoLoaded && (
        <LoadDemoData onDataLoaded={() => setDemoLoaded(true)} />
      )}

      {/* 3D Intelligence Core — live from user data */}
      <ProcureMindScene />

      {/* AI Insights — live from user data */}
      <AiInsights />

      {/* Spending Overview & Priority Actions */}
      <div className="dashboard-mid-grid">
        <SpendingChart />
        <PriorityActions />
      </div>

      {/* Recent Procurement Requisitions */}
      <RecentProcurement />

      {/* AI Activity Timeline Feed */}
      <AiActivityFeed />

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
            <span className="settings-label">Office Email</span>
            <span className="settings-value">{currentUser?.email}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Organisation</span>
            <span className="settings-value">{currentUser?.companyName}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Job Role</span>
            <span className="settings-value">{currentUser?.jobRole}</span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Department</span>
            <span className="settings-value">{currentUser?.department}</span>
          </div>
          <div className="settings-field settings-field-full">
            <span className="settings-label">Procurement Scope</span>
            <span className="settings-value">
              {currentUser?.procurementTypes || 'General Enterprise Procurement'}
            </span>
          </div>
          <div className="settings-field settings-field-full">
            <span className="settings-label">Company Profile</span>
            <span className="settings-value">
              {currentUser?.companyDescription || 'Enterprise Organisation'}
            </span>
          </div>
          <div className="settings-field settings-field-full">
            <span className="settings-label">AI Engine Status</span>
            <span className="settings-value" style={{ color: '#10B981', fontWeight: 700 }}>
              ● Active — Multi-Tenant Isolated Sandbox (Prototype v1.0)
            </span>
          </div>
          <div className="settings-field settings-field-full">
            <span className="settings-label">Account Created</span>
            <span className="settings-value">
              {currentUser?.accountCreatedAt
                ? new Date(currentUser.accountCreatedAt).toLocaleString('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Future AI API Configuration */}
      <div className="card" style={{ padding: '24px', marginTop: 16 }}>
        <div className="card-header-main" style={{ marginBottom: 12 }}>
          <h3 className="card-title" style={{ fontSize: 14 }}>
            Future AI API Configuration
          </h3>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          When integrating the AI model, set the following environment variables
          in <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: 3 }}>.env</code>:
          <br />
          <code style={{ display: 'block', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '10px 14px', marginTop: 8, fontSize: 12, color: '#1E3A8A' }}>
            VITE_AI_API_ENDPOINT=https://your-model-endpoint.com/api<br />
            VITE_AI_API_KEY=your-secret-key-here
          </code>
          Then update <code>src/services/aiService.js</code> to use{' '}
          <code>import.meta.env.VITE_AI_API_ENDPOINT</code> in each function.
          Never commit <code>.env</code> to GitHub — it is already in <code>.gitignore</code>.
        </p>
      </div>
    </main>
  );
}

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
            <p className="card-subtitle">AI Procurement Intelligence Platform</p>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.8 }}>
          <strong>Getting Started:</strong>
          <ol style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Create your account and set up your company profile.</li>
            <li>Add vendors via the Vendors module.</li>
            <li>Log procurement requisitions in the Procurement module.</li>
            <li>Add SaaS subscriptions in the Subscriptions module.</li>
            <li>The dashboard KPIs and AI insights update automatically.</li>
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

  // ── Not authenticated → show Login or Register ───────────────────────────
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register
          onNavigateToLogin={() => setAuthView('login')}
          onRegistrationSuccess={() => {
            setAuthView('login');
            setActiveTab('dashboard');
          }}
        />
      );
    }
    return (
      <Login
        onNavigateToRegister={() => setAuthView('register')}
        onLoginSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  // ── Authenticated → show dashboard shell with sidebar ────────────────────
  const renderView = () => {
    switch (activeTab) {
      case 'procurement':    return <ProcurementModule />;
      case 'ai-analysis':   return <AiAnalysisModule />;
      case 'vendors':       return <VendorsModule />;
      case 'subscriptions': return <SubscriptionsModule />;
      case 'decisions':     return <DecisionsModule />;
      case 'settings':      return <SettingsView />;
      case 'help':          return <HelpView />;
      case 'dashboard':
      default:              return <DashboardView />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="main-wrapper">
        <Header />
        {renderView()}
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