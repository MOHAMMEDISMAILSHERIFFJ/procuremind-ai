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
import {
  ProcurementModule,
  AiAnalysisModule,
  VendorsModule,
  SubscriptionsModule,
  DecisionsModule,
} from './components/modules/ModuleViews';
import { SettingsIcon, HelpIcon } from './components/icons/Icons';
import './styles/dashboard.css';

function AppContent() {
  const { isAuthenticated, currentUser } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard');

  // If not logged in -> toggle between Login and Register views
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register
          onNavigateToLogin={() => setAuthView('login')}
          onRegistrationSuccess={() => setActiveTab('dashboard')}
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

  // Render the selected module based on active sidebar tab
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'procurement':
        return <ProcurementModule />;
      case 'ai-analysis':
        return <AiAnalysisModule />;
      case 'vendors':
        return <VendorsModule />;
      case 'subscriptions':
        return <SubscriptionsModule />;
      case 'decisions':
        return <DecisionsModule />;
      case 'settings':
        return (
          <main className="dashboard-content">
            <div className="card" style={{ padding: '36px' }}>
              <div className="card-header-main" style={{ marginBottom: '16px' }}>
                <div className="card-header-icon chart-icon-wrapper">
                  <SettingsIcon size={22} />
                </div>
                <div>
                  <h3 className="card-title">Enterprise System Settings</h3>
                  <p className="card-subtitle">{currentUser?.companyName} Workspace</p>
                </div>
              </div>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.8 }}>
                <strong>Organization:</strong> {currentUser?.companyName}<br />
                <strong>Account Owner:</strong> {currentUser?.fullName} ({currentUser?.email})<br />
                <strong>Job Role:</strong> {currentUser?.jobRole} &bull; {currentUser?.department}<br />
                <strong>Procurement Scope:</strong> {currentUser?.procurementTypes || 'Enterprise Scope'}<br />
                <strong>Company Profile:</strong> {currentUser?.companyDescription || 'Advanced Technologies'}<br />
                <strong>AI Heuristics Engine:</strong> Active Multi-Tenant Isolated Sandbox
              </p>
            </div>
          </main>
        );
      case 'help':
        return (
          <main className="dashboard-content">
            <div className="card" style={{ padding: '36px' }}>
              <div className="card-header-main" style={{ marginBottom: '16px' }}>
                <div className="card-header-icon priority-icon-wrapper">
                  <HelpIcon size={22} />
                </div>
                <div>
                  <h3 className="card-title">ProcureMind SLA Help & Support</h3>
                  <p className="card-subtitle">AI Procurement Engineer Support</p>
                </div>
              </div>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                Need assistance configuring custom rate cards or connecting ERP transaction streams for {currentUser?.companyName}? Reach out at support@procuremind.ai
              </p>
            </div>
          </main>
        );
      case 'dashboard':
      default:
        return (
          <main className="dashboard-content" id="main-content">
            {/* KPI Cards (bound to user data) */}
            <KpiCards />

            {/* 3D Visualization (bound to user data) */}
            <ProcureMindScene />

            {/* AI Insights (bound to user data) */}
            <AiInsights />

            {/* Spending Overview & Priority Actions */}
            <div className="dashboard-mid-grid">
              <SpendingChart />
              <PriorityActions />
            </div>

            {/* Recent Procurement Requisitions */}
            <RecentProcurement />

            {/* Product Message */}
            <ProductMessage />
          </main>
        );
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Viewport */}
      <div className="main-wrapper">
        {/* Header with User Info & Logout */}
        <Header />

        {/* Dynamic View */}
        {renderCurrentView()}
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