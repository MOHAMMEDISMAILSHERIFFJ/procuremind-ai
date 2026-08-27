// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  BrainSparkleLogo,
  SparklesIcon,
  ShieldAlertIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '../components/icons/Icons';
import { useAuth } from '../context/useAuth';

// Inline eye icon to avoid extra import
const EyeIcon = ({ open }) => (
  <svg
    width="15"
    height="15"
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

export default function Register({ onNavigateToLogin, onRegistrationSuccess }) {
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: Company
    companyName: '',
    jobRole: '',
    department: '',
    companyDescription: '',

    // Step 3: Work Context
    companyWork: '',
    procurementTypes: '',
    workDescription: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Full Name is required.';
    if (!formData.username.trim()) return 'Username is required.';
    if (formData.username.trim().length < 3)
      return 'Username must be at least 3 characters.';
    if (/\s/.test(formData.username.trim()))
      return 'Username cannot contain spaces.';
    if (!formData.email.trim()) return 'Office Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      return 'Please enter a valid email address.';
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 6)
      return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.companyName.trim()) return 'Company / Organisation name is required.';
    if (!formData.jobRole.trim()) return 'Job Role is required.';
    if (!formData.department.trim()) return 'Department is required.';
    if (!formData.companyDescription.trim())
      return 'Please provide a brief company description.';
    return null;
  };

  const validateStep3 = () => {
    if (!formData.companyWork.trim())
      return 'Please describe what your company does.';
    if (!formData.procurementTypes.trim())
      return 'Please specify the types of procurement you handle.';
    if (!formData.workDescription.trim())
      return 'Please describe what you are responsible for.';
    return null;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    const result = register({
      fullName: formData.fullName,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      companyName: formData.companyName,
      jobRole: formData.jobRole,
      department: formData.department,
      companyDescription: `${formData.companyDescription}. ${formData.companyWork}`.trim(),
      workDescription: formData.workDescription,
      procurementTypes: formData.procurementTypes,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      // If username/email collision → jump back to step 1
      if (
        result.error.toLowerCase().includes('username') ||
        result.error.toLowerCase().includes('email')
      ) {
        setStep(1);
      }
      return;
    }

    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-ambient-orb orb-primary" />
      <div className="login-ambient-orb orb-secondary" />
      <div className="login-ambient-grid" />

      <div className="login-card-wrapper register-card-wrapper">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-logo">
            <BrainSparkleLogo size={40} />
          </div>
          <div className="login-brand-title-row">
            <h1 className="login-brand-title">ProcureMind</h1>
            <span className="login-brand-badge">AI</span>
          </div>
          <p className="login-brand-subtitle">Create Your Enterprise Account</p>
        </div>

        {/* Step Indicator */}
        <div className="register-steps-indicator">
          {[
            { num: 1, label: 'Account' },
            { num: 2, label: 'Company' },
            { num: 3, label: 'Context' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.num}>
              <div className={`step-pill ${step >= s.num ? 'active' : ''}`}>
                <span className="step-num">
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="step-name">{s.label}</span>
              </div>
              {i < arr.length - 1 && <div className="step-connector" />}
            </React.Fragment>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert" role="alert">
            <ShieldAlertIcon size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Multi-Step Form */}
        <form
          onSubmit={step === 3 ? handleSubmit : handleNext}
          className="login-form"
          noValidate
        >
          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <div className="step-fields-group">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. rahul_procure"
                    value={formData.username}
                    onChange={(e) => updateField('username', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Office Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input password-field-with-toggle"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        updateField('password', e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="form-input password-field-with-toggle"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField('confirmPassword', e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Company ── */}
          {step === 2 && (
            <div className="step-fields-group">
              <div className="form-group">
                <label className="form-label">Company / Organisation Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apex Technologies"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Job Role</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Head of Procurement"
                    value={formData.jobRole}
                    onChange={(e) => updateField('jobRole', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Supply Chain"
                    value={formData.department}
                    onChange={(e) => updateField('department', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Brief Company Description</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  placeholder="e.g. Industrial electronics and enterprise software manufacturer..."
                  value={formData.companyDescription}
                  onChange={(e) =>
                    updateField('companyDescription', e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Work Context ── */}
          {step === 3 && (
            <div className="step-fields-group">
              <div className="form-group">
                <label className="form-label">What does your company do?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Builds embedded IoT sensors and enterprise edge devices"
                  value={formData.companyWork}
                  onChange={(e) => updateField('companyWork', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  What type of procurement does your organisation handle?
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Developer Laptops, Lab Instruments, AWS Cloud, SaaS Tools"
                  value={formData.procurementTypes}
                  onChange={(e) =>
                    updateField('procurementTypes', e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  What are you responsible for?
                </label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  placeholder="e.g. Vendor contract negotiations, hardware purchase orders, SaaS renewals..."
                  value={formData.workDescription}
                  onChange={(e) =>
                    updateField('workDescription', e.target.value)
                  }
                />
              </div>

              <div className="register-ai-notice">
                <SparklesIcon size={14} />
                <span>
                  This profile configures your personalised AI Procurement Intelligence Engine.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="register-actions-row">
            {step > 1 && (
              <button
                type="button"
                className="btn-register-back"
                onClick={() => {
                  setError('');
                  setStep((s) => s - 1);
                }}
                disabled={loading}
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button type="submit" className="btn-login-submit">
                Continue to Step {step + 1}
                <ChevronRightIcon size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading-state">
                    <span className="login-spinner" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <CheckCircleIcon size={16} />
                    <span>Create Enterprise Account</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Footer — Back to Sign In */}
        <div className="register-footer-row">
          <span>Already have an account?</span>
          <button
            type="button"
            className="btn-link-login"
            onClick={onNavigateToLogin}
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
