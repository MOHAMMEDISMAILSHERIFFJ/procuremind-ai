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

// Eye icon inline (avoid extra import)
const EyeIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

export default function Login({ onNavigateToRegister, onLoginSuccess }) {
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const DEMO_EMAIL = 'demo@procuremind.ai';
  const DEMO_PASSWORD = 'demo123';

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!usernameOrEmail.trim()) {
      setError('Please enter your username or email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    // Short async delay so the loading spinner is visible
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
    }, 350);
  };

  const handleQuickFillDemo = () => {
    setUsernameOrEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const handleInstantDemoLogin = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(DEMO_EMAIL, DEMO_PASSWORD);
      if (result.success && onLoginSuccess) {
        onLoginSuccess(result.user);
      } else {
        setError('Demo login failed. Please refresh and try again.');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="login-page-container">
      {/* Background Ambient Glows */}
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
        <form className="login-form" onSubmit={handleLogin} noValidate>
          {/* Username / Email */}
          <div className="form-group">
            <label htmlFor="login-identifier" className="form-label">
              Username or Office Email
            </label>
            <input
              id="login-identifier"
              type="text"
              className="form-input"
              placeholder="Username or email@company.com"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                if (error) setError('');
              }}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password with Show/Hide Toggle */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <button
                type="button"
                className="btn-forgot-password"
                onClick={() =>
                  alert(
                    'This is a prototype. Use the demo credentials or create a new account.'
                  )
                }
              >
                Forgot Password?
              </button>
            </div>
            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input password-field-with-toggle"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
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
                <span className="login-spinner" />
                Authenticating...
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
            disabled={loading}
          >
            <SparklesIcon size={15} />
            <span>Create New Account</span>
          </button>
        </form>

        {/* Demo Credentials Panel */}
        <div className="login-demo-helper">
          <div className="demo-helper-header">
            <span className="demo-helper-title">
              Demo Account (NovaTech Industries)
            </span>
            <button
              type="button"
              className="btn-quick-fill"
              onClick={handleQuickFillDemo}
              disabled={loading}
            >
              Fill Credentials
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
            disabled={loading}
          >
            <CheckCircleIcon size={14} />
            <span>1-Click Demo Sign In</span>
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer-security">
          <span>
            Enterprise Isolated Workspace &bull; Prototype v1.0 &bull; No API keys stored
          </span>
        </div>
      </div>
    </div>
  );
}
