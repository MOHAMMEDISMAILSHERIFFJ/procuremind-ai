// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  BrainSparkleLogo,
  SparklesIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '../components/icons/Icons';
import { useAuth } from '../context/useAuth';

export default function Login({ onNavigateToRegister, onLoginSuccess }) {
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DEMO_EMAIL = 'demo@procuremind.ai';
  const DEMO_PASSWORD = 'demo123';

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!usernameOrEmail.trim() || !password) {
      setError('Please enter both username/email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = login(usernameOrEmail, password);
      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        setError(result.error || 'Invalid username or password.');
        setLoading(false);
      }
    }, 250);
  };

  const handleQuickFillDemo = () => {
    setUsernameOrEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleInstantDemoLogin = () => {
    setUsernameOrEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(DEMO_EMAIL, DEMO_PASSWORD);
      if (result.success && onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    }, 200);
  };

  return (
    <div className="login-page-container">
      {/* Background Subtle Glows */}
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
        </div>

        {/* Error Notification */}
        {error && (
          <div className="login-error-alert" role="alert">
            <ShieldAlertIcon size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username-email-input" className="form-label">
              Username or Office Email
            </label>
            <input
              id="username-email-input"
              type="text"
              className="form-input"
              placeholder="Username or email@company.com"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password-input" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="btn-forgot-password"
                onClick={() => alert('For prototype access, you can use the demo credentials or create a new account.')}
              >
                Forgot Password?
              </button>
            </div>
            <input
              id="password-input"
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
              <span>Remember Me</span>
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn-login-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-state">
                <span className="login-spinner" /> Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ChevronRightIcon size={16} />
              </>
            )}
          </button>

          {/* Create Account CTA */}
          <button
            type="button"
            className="btn-create-account"
            onClick={onNavigateToRegister}
          >
            <SparklesIcon size={15} />
            <span>Create New Account</span>
          </button>
        </form>

        {/* Demo Credentials Option */}
        <div className="login-demo-helper">
          <div className="demo-helper-header">
            <span className="demo-helper-title">Demo Credentials (Preloaded Data)</span>
            <button
              type="button"
              className="btn-quick-fill"
              onClick={handleQuickFillDemo}
            >
              Fill Demo
            </button>
          </div>
          <div className="demo-creds-row">
            <div className="cred-badge">
              <span className="cred-key">User/Email:</span>
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
            <span>1-Click Demo Sign In</span>
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="login-footer-security">
          <span>Enterprise Secure Connection &bull; Isolated Multi-Tenant Workspace</span>
        </div>
      </div>
    </div>
  );
}
