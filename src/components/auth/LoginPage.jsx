// src/components/auth/LoginPage.jsx
import React, { useState } from 'react';
import {
  BrainSparkleLogo,
  SparklesIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '../icons/Icons';

export const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_EMAIL = 'demo@procuremind.ai';
  const DEMO_PASSWORD = 'demo123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLoginSuccess({ email, rememberMe });
      } else {
        setError('Invalid credentials. Use demo@procuremind.ai / demo123 to log in.');
        setIsLoading(false);
      }
    }, 450);
  };

  const handleUseDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleInstantDemoLogin = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({ email: DEMO_EMAIL, rememberMe: true });
    }, 350);
  };

  return (
    <div className="login-page-container">
      {/* Ambient 3D Glowing Background Effects */}
      <div className="login-ambient-orb orb-primary" />
      <div className="login-ambient-orb orb-secondary" />
      <div className="login-ambient-grid" />

      {/* Main Login Card */}
      <div className="login-card-wrapper">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-logo">
            <BrainSparkleLogo size={44} />
          </div>
          <div className="login-brand-title-row">
            <h1 className="login-brand-title">ProcureMind</h1>
            <span className="login-brand-badge">AI</span>
          </div>
          <p className="login-brand-subtitle">
            AI-Powered Procurement Intelligence
          </p>
          <div className="login-org-pill">
            <SparklesIcon size={12} />
            <span>Enterprise Gateway &bull; NovaTech Industries</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert" role="alert">
            <ShieldAlertIcon size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Enterprise Email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="name@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="btn-forgot-password"
                onClick={() => alert('Password reset: Use demo password "demo123" for this test.')}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me */}
          <div className="form-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="custom-checkbox"
              />
              <span>Remember me on this workstation</span>
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="btn-login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading-state">
                <span className="login-spinner" /> Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In to Platform</span>
                <ChevronRightIcon size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="login-demo-helper">
          <div className="demo-helper-header">
            <span className="demo-helper-title">Demo Access Credentials</span>
            <button
              type="button"
              className="btn-quick-fill"
              onClick={handleUseDemoCredentials}
            >
              Auto-Fill
            </button>
          </div>
          <div className="demo-creds-row">
            <div className="cred-badge">
              <span className="cred-key">Email:</span>
              <code className="cred-val">demo@procuremind.ai</code>
            </div>
            <div className="cred-badge">
              <span className="cred-key">Pass:</span>
              <code className="cred-val">demo123</code>
            </div>
          </div>
          <button
            type="button"
            className="btn-instant-demo"
            onClick={handleInstantDemoLogin}
          >
            <CheckCircleIcon size={14} />
            <span>1-Click Instant Demo Sign In</span>
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="login-footer-security">
          <span>End-to-End Enterprise Encryption &bull; SOC2 Type II Certified</span>
        </div>
      </div>
    </div>
  );
};
