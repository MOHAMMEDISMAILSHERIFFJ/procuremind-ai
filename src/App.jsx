// src/App.jsx
import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
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

const AUTH_STORAGE_KEY = 'procuremind_auth_session';

function App() {
  // Check initial auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed && parsed.authenticated === true;
      }
    } catch {
      // fallback
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/login';
  });

  // Keep route in sync with URL
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL without reload
  const navigateTo = (path) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // fallback
    }
  };

  const handleLoginSuccess = ({ email, rememberMe }) => {
    const authData = {
      authenticated: true,
      email,
      timestamp: new Date().toISOString(),
    };
    if (rememberMe) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      } catch {
        // storage ignored
      }
    }
    setIsAuthenticated(true);
    navigateTo('/dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // storage ignored
    }
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    navigateTo('/login');
  };

  // If unauthenticated or current path is /login, render Login Page
  if (!isAuthenticated || currentPath === '/login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render the selected module based on active tab
  const renderActiveModule = () => {
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
                  <p className="card-subtitle">NovaTech Industries &bull; Fiscal Year 2026-27</p>
                </div>
              </div>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                AI Model: Neural Decision Heuristics v2.4 (Active)<br />
                Currency: Indian Rupee (₹)<br />
                Entity Identifier: NT-IND-8820
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
                  <h3 className="card-title">ProcureMind Intelligence Support</h3>
                  <p className="card-subtitle">Enterprise SLA Helpdesk</p>
                </div>
              </div>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                For urgent procurement variance reviews or contract benchmarks, reach out to your designated AI procurement engineer.
              </p>
            </div>
          </main>
        );
      case 'dashboard':
      default:
        return (
          <main className="dashboard-content" id="main-content">
            {/* 3. KPI Cards */}
            <KpiCards />

            {/* 3D Visual Environment: AI Procurement Intelligence Neural Core */}
            <ProcureMindScene />

            {/* 4. AI Insights */}
            <AiInsights />

            {/* 5. Spending Overview & 7. Priority Actions */}
            <div className="dashboard-mid-grid">
              <SpendingChart />
              <PriorityActions />
            </div>

            {/* 6. Recent Procurement Table */}
            <RecentProcurement />

            {/* 8. Product Message */}
            <ProductMessage />
          </main>
        );
    }
  };

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Viewport */}
      <div className="main-wrapper">
        {/* 2. Top Header with User Profile & Logout */}
        <Header onLogout={handleLogout} />

        {/* Dynamic Section View */}
        {renderActiveModule()}
      </div>
    </div>
  );
}

export default App;